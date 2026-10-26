import { isDeepStrictEqual } from "node:util";

type PublicDocument = Record<string, unknown>;
const draftCollections = new Set(["teachings", "resources", "series", "events", "communities"]);
const fields: Record<string, string[]> = {
  teachings: ["_status", "title", "slug", "series", "episode", "teachingDate", "author", "excerpt", "keyVerse", "body", "topics", "image", "notionImageUrl", "durationMinutes", "youtubeUrl", "youtubeDescription", "spotifyUrl", "legacy", "seo", "deletedAt"],
  resources: ["_status", "title", "slug", "kind", "contentDate", "author", "excerpt", "body", "topics", "image", "notionImageUrl", "relatedTeachings", "seo", "deletedAt"],
  series: ["_status", "title", "slug", "kind", "description", "image", "imageSquare", "imageVertical", "deletedAt"],
  topics: ["name", "slug", "publishPage", "unpublishPage", "deletedAt"],
  authors: ["name", "profileUrl", "image", "photoUrl", "deletedAt"],
  media: ["url", "filename", "alt", "caption", "mimeType", "width", "height", "sizes", "deletedAt"],
  events: ["_status", "title", "excerpt", "startDate", "endDate", "location", "image", "registrationUrl", "registrationLabel", "deletedAt"],
  communities: ["_status", "slug", "name", "label", "description", "image", "location", "schedule", "ctaLabel", "ctaUrl", "sortOrder", "deletedAt"]
};
const relations = new Set(["series", "author", "image", "imageSquare", "imageVertical", "topics", "relatedTeachings"]);
function relationValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(relationValue);
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id: unknown }).id;
  }
  return value ?? null;
}

/** A sync status write or a saved draft must not evict published pages. */
export function publicContentChanged(collection: string, current: PublicDocument, previous?: PublicDocument) {
  if (draftCollections.has(collection) &&
      current._status !== "published" && previous?._status !== "published") return false;
  if (!previous) return true;
  const selected = fields[collection];
  if (!selected) return true;
  return selected.some((field) => !isDeepStrictEqual(
    relations.has(field) ? relationValue(current[field]) : current[field] ?? null,
    relations.has(field) ? relationValue(previous[field]) : previous[field] ?? null
  ));
}

export function publicationBodyCacheTag(collection: "teachings" | "resources", id: number | string) {
  return `payload-${collection}-body:${id}`;
}

/** Institutional pages have no dependency on editorial publications. */
export function editorialInvalidationPaths(collection?: string) {
  if (collection === "communities") return ["/", "/en", "/comunidades", "/en/comunidades"];
  if (collection === "events") return ["/", "/en", "/visitanos", "/en/visitanos"];
  return ["/", "/en", "/recursos", "/en/recursos", "/ensenanzas", "/en/ensenanzas", "/sitemap-es.xml", "/sitemap-en.xml"];
}

/** Payload's collection hooks invalidate real edits, including imports and unpublishing. */
export function shouldInvalidateNotionFallback(source: string | undefined, imported = 0) {
  return source !== "payload" && imported > 0;
}
