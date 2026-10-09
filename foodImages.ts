/**
 * Food photo helper for Panda Calorie Tracker.
 *
 * Uses real-photo search results from LoremFlickr based on the food name.
 * Because this is an online search service, a result can sometimes be similar
 * rather than an exact match, and an internet connection is required.
 */
export function foodImage(id: number, name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ",")
    .replace(/^,+|,+$/g, "");

  const tags = slug ? `${slug},food` : "food";
  return `https://loremflickr.com/900/700/${tags}?lock=${encodeURIComponent(String(id))}`;
}
