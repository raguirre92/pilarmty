import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

import config from "@payload-config";
import type {
  Author,
  Media,
  Resource as PayloadResource,
  Series,
  Teaching as PayloadTeaching,
  Topic
} from "@/payload-types";
import type {
  Collection,
  Locale,
  Resource,
  Teaching
} from "@/lib/types";
import { normalizePathSegment } from "@/lib/site";
import { payloadMediaUrl } from "@/lib/payload-media";
import { publicationBodyCacheTag } from "@/lib/content-cache-policy";

async function previewIsEnabled() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Static route generation has no request context and must always read published content.
    return false;
  }
}

function related<T extends { id: number | string }>(value: unknown): T | undefined {
  return value && typeof value === "object" && "id" in value
    ? (value as T)
    : undefined;
}

function mediaUrl(value: unknown) {
  return payloadMediaUrl(value);
}

function mediaAlt(value: unknown) {
  return related<Media>(value)?.alt || undefined;
}

function authorName(value: unknown) {
  return related<Author>(value)?.name || undefined;
}

function authorUrl(value: unknown) {
  return related<Author>(value)?.profileUrl || undefined;
}

function authorImage(value: unknown) {
  const author = related<Author>(value);
  return mediaUrl(author?.image) ||
    ((author as (Author & { photoUrl?: string }) | undefined)?.photoUrl || undefined);
}

function topicNames(values: unknown) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => related<Topic>(value)?.name)
    .filter((name): name is string => Boolean(name));
}

function mapSeries(doc: Series, locale: Locale): Collection {
  return {
    slug: doc.slug,
    name: doc.title,
    kind: doc.kind === "event" ? "evento" : "serie",
    description: doc.description || "",
    image: mediaUrl(doc.image),
    imageSquare: mediaUrl(doc.imageSquare),
    imageVertical: mediaUrl(doc.imageVertical),
    locale
  };
}

function mapTeaching(
  doc: PayloadTeaching,
  locale: Locale,
  alternate?: PayloadTeaching
): Teaching | null {
  const series = related<Series>(doc.series);
  const alternateSeries = related<Series>(alternate?.series);
  if (!series) return null;
  return {
    payloadId: doc.id,
    slug: doc.slug,
    collection: series.slug,
    collectionName: series.title,
    title: doc.title,
    locale,
    date: doc.teachingDate || undefined,
    author: authorName(doc.author),
    authorUrl: authorUrl(doc.author),
    authorImage: authorImage(doc.author),
    episode: doc.episode || undefined,
    excerpt: doc.excerpt || undefined,
    keyVerse: doc.keyVerse || undefined,
    body: doc.body as Record<string, unknown> | undefined,
    tags: topicNames(doc.topics),
    image: doc.notionImageUrl || mediaUrl(doc.image) || mediaUrl(series?.image),
    imageAlt: mediaAlt(doc.image) || mediaAlt(series?.image) || series?.title,
    durationMinutes: doc.durationMinutes || undefined,
    youtubeUrl: doc.youtubeUrl || undefined,
    youtubeDescription: doc.youtubeDescription || undefined,
    spotifyUrl: doc.spotifyUrl || undefined,
    legacy: Boolean(doc.legacy),
    seoTitle: doc.seo?.title || undefined,
    seoDescription: doc.seo?.description || undefined,
    canonical: doc.seo?.canonical || undefined,
    noindex: Boolean(doc.seo?.noIndex),
    socialImage: mediaUrl(doc.seo?.socialImage),
    updatedAt: doc.updatedAt,
    translation:
      alternate?.slug && alternateSeries?.slug
        ? { collection: alternateSeries.slug, slug: alternate.slug }
        : undefined
  };
}

function mapResource(
  doc: PayloadResource,
  locale: Locale,
  alternate?: PayloadResource
): Resource {
  return {
    payloadId: doc.id,
    slug: doc.slug,
    title: doc.title,
    locale,
    kind: doc.kind === "pillar" ? "contenido-pilar" : "articulo",
    excerpt: doc.excerpt || undefined,
    body: doc.body as Record<string, unknown> | undefined,
    author: authorName(doc.author),
    authorUrl: authorUrl(doc.author),
    authorImage: authorImage(doc.author),
    date: doc.contentDate || undefined,
    tags: topicNames(doc.topics),
    image: doc.notionImageUrl || mediaUrl(doc.image),
    imageAlt: mediaAlt(doc.image),
    relatedTeachingSlugs: Array.isArray(doc.relatedTeachings)
      ? doc.relatedTeachings
          .map((item) => related<PayloadTeaching>(item)?.slug)
          .filter((slug): slug is string => Boolean(slug))
      : [],
    seoTitle: doc.seo?.title || undefined,
    seoDescription: doc.seo?.description || undefined,
    canonical: doc.seo?.canonical || undefined,
    noindex: Boolean(doc.seo?.noIndex),
    socialImage: mediaUrl(doc.seo?.socialImage),
    updatedAt: doc.updatedAt,
    translation: alternate?.slug
      ? { collection: "recursos", slug: alternate.slug }
      : undefined
  };
}

async function queryTeachings(locale: Locale, preview: boolean) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "teachings",
    locale: "es",
    fallbackLocale: "es",
    depth: 2,
    limit: 1000,
    sort: "-teachingDate",
    draft: preview,
    overrideAccess: preview
  });
  const alternates = new Map();
  const datedFirst = [...result.docs].sort((left, right) => {
    const leftTime = left.teachingDate ? Date.parse(left.teachingDate) : Number.NEGATIVE_INFINITY;
    const rightTime = right.teachingDate ? Date.parse(right.teachingDate) : Number.NEGATIVE_INFINITY;
    return rightTime - leftTime;
  });
  return datedFirst
    .map((doc) => mapTeaching({ ...doc, body: preview ? doc.body : undefined }, locale, alternates.get(doc.id)))
    .filter((doc): doc is Teaching => Boolean(doc));
}

const cachedTeachings = unstable_cache(
  (locale: Locale) => queryTeachings(locale, false),
  ["payload-teachings-catalog-v9"],
  { revalidate: false, tags: ["payload-content", "payload-teachings"] }
);

export async function payloadTeachings(locale: Locale) {
  return (await previewIsEnabled())
    ? queryTeachings(locale, true)
    : cachedTeachings(locale);
}

export async function payloadTeaching(locale: Locale, collection: string, slug: string) {
  const docs = await payloadTeachings(locale);
  const normalizedCollection = normalizePathSegment(collection);
  const normalizedSlug = normalizePathSegment(slug);
  const teaching = docs.find(
    (doc) =>
      doc.collection.normalize("NFC") === normalizedCollection &&
      doc.slug.normalize("NFC") === normalizedSlug
  ) || null;
  if (!teaching || await previewIsEnabled() || teaching.payloadId === undefined) return teaching;
  return { ...teaching, body: await publicationBody("teachings", teaching.payloadId) };
}

async function queryCollections(locale: Locale, preview: boolean) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "series",
    locale: "es",
    fallbackLocale: "es",
    depth: 1,
    limit: 1000,
    sort: "title",
    draft: preview,
    overrideAccess: preview
  });
  return result.docs.map((doc) => mapSeries(doc, locale));
}

const cachedCollections = unstable_cache(
  (locale: Locale) => queryCollections(locale, false),
  ["payload-series-v6"],
  { revalidate: false, tags: ["payload-content", "payload-series"] }
);

export async function payloadCollections(locale: Locale) {
  return (await previewIsEnabled())
    ? queryCollections(locale, true)
    : cachedCollections(locale);
}

async function queryTopicPublicationOverrides() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "topics",
    depth: 0,
    limit: 1000,
    select: { slug: true, publishPage: true, unpublishPage: true },
    overrideAccess: true
  });
  return {
    published: result.docs.filter((doc) => doc.publishPage).map((doc) => doc.slug),
    unpublished: result.docs.filter((doc) => doc.unpublishPage).map((doc) => doc.slug)
  };
}

const cachedTopicPublicationOverrides = unstable_cache(
  queryTopicPublicationOverrides,
  ["payload-topic-pages-v2"],
  { revalidate: false, tags: ["payload-content", "payload-topics"] }
);

export async function payloadManuallyPublishedTopicSlugs() {
  return (await payloadTopicPublicationOverrides()).published;
}

export async function payloadTopicPublicationOverrides() {
  const overrides = await cachedTopicPublicationOverrides();
  return {
    published: new Set(overrides.published),
    unpublished: new Set(overrides.unpublished)
  };
}

async function queryResources(locale: Locale, preview: boolean) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "resources",
    locale: "es",
    fallbackLocale: "es",
    depth: 2,
    limit: 1000,
    sort: "-contentDate",
    draft: preview,
    overrideAccess: preview
  });
  const alternates = new Map();
  return result.docs.map((doc) =>
    mapResource({ ...doc, body: preview ? doc.body : undefined }, locale, alternates.get(doc.id))
  );
}

const cachedResources = unstable_cache(
  (locale: Locale) => queryResources(locale, false),
  ["payload-resources-catalog-v4"],
  { revalidate: false, tags: ["payload-content", "payload-resources"] }
);

export async function payloadResources(locale: Locale) {
  return (await previewIsEnabled())
    ? queryResources(locale, true)
    : cachedResources(locale);
}

export async function payloadResource(locale: Locale, slug: string) {
  const docs = await payloadResources(locale);
  const normalizedSlug = normalizePathSegment(slug);
  const resource = docs.find((doc) => doc.slug.normalize("NFC") === normalizedSlug) || null;
  if (!resource || await previewIsEnabled() || resource.payloadId === undefined) return resource;
  return { ...resource, body: await publicationBody("resources", resource.payloadId) };
}

export async function payloadRedirect(source: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "redirects",
    where: { source: { equals: source } },
    depth: 0,
    limit: 1,
    overrideAccess: true
  });
  const redirect = result.docs[0];
  return redirect
    ? { destination: redirect.destination, permanent: redirect.permanent !== false }
    : null;
}

/** Keep each long body out of the shared catalog cache. */
async function publicationBody(collection: "teachings" | "resources", id: number | string) {
  return (await unstable_cache(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection, where: { and: [{ id: { equals: id } }, { _status: { equals: "published" } }] },
      locale: "es", fallbackLocale: "es", depth: 2, limit: 1,
      select: { body: true }, overrideAccess: false
    });
    return result.docs[0]?.body as Record<string, unknown> | undefined || null;
  }, ["payload-publication-body-v1", collection, String(id)], {
    revalidate: false, tags: [publicationBodyCacheTag(collection, id), "payload-body-media"]
  })()) ?? undefined;
}
