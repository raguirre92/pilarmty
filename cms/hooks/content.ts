import { revalidatePath, revalidateTag } from "next/cache";
import { editorialInvalidationPaths, publicationBodyCacheTag, publicContentChanged } from "@/lib/content-cache-policy";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  PayloadRequest
} from "payload";

type EditorialCollection = "series" | "teachings" | "resources" | "topics" | "events" | "communities";
type DocumentData = Record<string, unknown> & { id?: number | string; _status?: string };

function relationId(value: unknown) {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "number" || typeof id === "string" ? id : undefined;
  }
  return undefined;
}

async function seriesSlug(req: PayloadRequest, value: unknown) {
  if (value && typeof value === "object" && "slug" in value) {
    return String((value as { slug: unknown }).slug);
  }
  const id = relationId(value);
  if (!id) return undefined;
  const series = await req.payload.findByID({
    collection: "series" as never,
    id,
    depth: 0,
    overrideAccess: true
  });
  return String((series as unknown as { slug?: string }).slug || "");
}

export async function publicPath(
  collection: EditorialCollection,
  doc: DocumentData,
  req: PayloadRequest
) {
  const locale = String(req.locale) === "en" ? "en" : "es";
  const prefix = locale === "en" ? "/en" : "";
  const slug = String(doc.slug || "");
  if (!slug) return undefined;
  if (collection === "communities") return `${prefix}/comunidades`;
  if (collection === "topics") return `${prefix}/recursos/temas/${slug}`;
  if (collection === "resources") return `${prefix}/recursos/${slug}`;
  if (collection === "series") return `${prefix}/ensenanzas/${slug}`;
  const parentSlug = await seriesSlug(req, doc.series);
  return parentSlug
    ? `${prefix}/ensenanzas/${parentSlug}/${slug}`
    : undefined;
}

async function upsertRedirect(req: PayloadRequest, source: string, destination: string) {
  if (!source || source === destination) return;
  const existing = await req.payload.find({
    collection: "redirects" as never,
    where: { source: { equals: source } },
    depth: 0,
    limit: 1,
    overrideAccess: true
  });
  const first = existing.docs[0] as unknown as { id?: number | string } | undefined;
  if (first?.id) {
    await req.payload.update({
      collection: "redirects" as never,
      id: first.id,
      data: { destination, permanent: true } as never,
      overrideAccess: true
    });
  } else {
    await req.payload.create({
      collection: "redirects" as never,
      data: { source, destination, permanent: true } as never,
      overrideAccess: true
    });
  }
}

function invalidate(paths: Array<string | undefined>, collection?: string, id?: number | string) {
  try {
    revalidateTag("payload-content", "max");
    if (collection === "media") revalidateTag("payload-body-media", "max");
    if ((collection === "teachings" || collection === "resources") && id !== undefined) {
      revalidateTag(publicationBodyCacheTag(collection, id), "max");
    }
    for (const path of new Set([...editorialInvalidationPaths(collection), ...paths])) {
      if (path) revalidatePath(path);
    }
  } catch {
    // Hooks also run from standalone migration scripts, where Next cache state is absent.
  }
}

export const guardPublishedSlug: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req
}) => {
  if (req.context?.skipSlugGuard) return data;
  if (
    originalDoc?._status === "published" &&
    originalDoc.slug &&
    typeof data.slug === "string" &&
    data.slug !== originalDoc.slug &&
    !data.confirmSlugChange
  ) {
    throw new Error(
      "Confirma el cambio de URL antes de modificar el slug de contenido publicado."
    );
  }
  return { ...data, confirmSlugChange: false };
};

export const afterEditorialChange = (
  collection: EditorialCollection
): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    const current = doc as DocumentData;
    const previous = previousDoc as DocumentData | undefined;
    if (req.query?.autosave === "true" || req.query?.autosave === true ||
        !publicContentChanged(collection, current, previous)) return doc;
    const currentPath = await publicPath(collection, current, req);
    const previousPath = previous
      ? await publicPath(collection, previous, req)
      : undefined;

    if (
      (previous?._status === "published" || collection === "topics") &&
      previousPath &&
      currentPath &&
      previousPath !== currentPath
    ) {
      await upsertRedirect(req, previousPath, currentPath);
    }

    if (
      collection === "series" &&
      previous?._status === "published" &&
      previous.slug !== current.slug &&
      current.id
    ) {
      const teachings = await req.payload.find({
        collection: "teachings" as never,
        where: {
          and: [
            { series: { equals: current.id } },
            { _status: { equals: "published" } }
          ]
        },
        depth: 0,
        limit: 1000,
        overrideAccess: true
      });
      const prefix = String(req.locale) === "en" ? "/en" : "";
      for (const teaching of teachings.docs as unknown as DocumentData[]) {
        const teachingSlug = String(teaching.slug || "");
        if (!teachingSlug) continue;
        await upsertRedirect(
          req,
          `${prefix}/ensenanzas/${String(previous.slug)}/${teachingSlug}`,
          `${prefix}/ensenanzas/${String(current.slug)}/${teachingSlug}`
        );
      }
    }

    invalidate([previousPath, currentPath], collection, current.id);
    return doc;
  };

export const afterEditorialDelete = (
  collection: EditorialCollection
): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    invalidate([await publicPath(collection, doc as DocumentData, req)], collection, doc.id);
    return doc;
  };

export const afterRelatedContentChange: CollectionAfterChangeHook = ({ doc, previousDoc, collection }) => {
  if (publicContentChanged(collection.slug, doc, previousDoc)) {
    invalidate([], collection.slug);
  }
  return doc;
};

export const afterRelatedContentDelete: CollectionAfterDeleteHook = ({ doc, collection }) => {
  invalidate([], collection.slug);
  return doc;
};
