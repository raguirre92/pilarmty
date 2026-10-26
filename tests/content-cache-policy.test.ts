import assert from "node:assert/strict";
import test from "node:test";
import { publicContentChanged, editorialInvalidationPaths, publicationBodyCacheTag, shouldInvalidateNotionFallback } from "../lib/content-cache-policy";

const published = { id: 42, _status: "published", title: "Gracia", body: { root: { children: [{ text: "Original" }] } }, series: 7, topics: [3] };

test("reimporting unchanged published content does not invalidate for sync bookkeeping", () => {
  assert.equal(publicContentChanged("teachings", { ...published, lastSyncedAt: "2026-10-26", sourceUpdatedAt: "2026-10-26", updatedAt: "later", syncStatus: "synced", syncError: null }, published), false);
});
test("populated relationships and raw IDs compare equally", () => {
  assert.equal(publicContentChanged("teachings", { ...published, series: { id: 7, updatedAt: "later" }, topics: [{ id: 3, teachingsCount: 99 }] }, published), false);
});
test("new drafts and draft edits leave published cache intact", () => {
  assert.equal(publicContentChanged("teachings", { _status: "draft", title: "Draft" }), false);
  assert.equal(publicContentChanged("teachings", { _status: "draft", title: "Edit" }, { _status: "draft", title: "Draft" }), false);
});
test("publishing, unpublishing, trashing, restoring and body edits invalidate", () => {
  assert.equal(publicContentChanged("teachings", published), true);
  assert.equal(publicContentChanged("teachings", published, { ...published, _status: "draft" }), true);
  assert.equal(publicContentChanged("teachings", { ...published, _status: "draft" }, published), true);
  assert.equal(publicContentChanged("teachings", { ...published, deletedAt: "today" }, published), true);
  assert.equal(publicContentChanged("teachings", published, { ...published, deletedAt: "yesterday" }), true);
  assert.equal(publicContentChanged("teachings", { ...published, body: { root: { children: [{ text: "Updated" }] } } }, published), true);
});
test("public metadata changes invalidate but author sync metadata does not", () => {
  assert.equal(publicContentChanged("authors", { name: "Sergio", updatedAt: "later", teachingsCount: 40 }, { name: "Sergio" }), false);
  assert.equal(publicContentChanged("authors", { name: "Sergio", photoUrl: "/new.jpg" }, { name: "Sergio" }), true);
  assert.equal(publicContentChanged("topics", { name: "Gracia", publishPage: true }, { name: "Gracia", publishPage: false }), true);
  assert.equal(publicContentChanged("events", { _status: "published", startDate: "2026-12-01" }, { _status: "published", startDate: "2026-11-01" }), true);
  assert.equal(publicContentChanged("communities", { _status: "published", schedule: "Viernes" }, { _status: "published", schedule: "Jueves" }), true);
});
test("body tags isolate publications and institutional paths stay scoped", () => {
  assert.notEqual(publicationBodyCacheTag("teachings", 42), publicationBodyCacheTag("teachings", 43));
  assert.notEqual(publicationBodyCacheTag("teachings", 42), publicationBodyCacheTag("resources", 42));
  assert.ok(!editorialInvalidationPaths("teachings").includes("/visitanos"));
  assert.ok(editorialInvalidationPaths("events").includes("/visitanos"));
});
test("Payload syncs never flush the root layout; fallback still refreshes after an import", () => {
  assert.equal(shouldInvalidateNotionFallback("payload", 100), false);
  assert.equal(shouldInvalidateNotionFallback("notion", 0), false);
  assert.equal(shouldInvalidateNotionFallback("notion", 1), true);
  assert.equal(shouldInvalidateNotionFallback(undefined, 1), true);
});
