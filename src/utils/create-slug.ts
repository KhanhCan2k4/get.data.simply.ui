/**
 * Generates a URL-friendly slug from a given string.
 *
 * @param text The string to convert into a slug.
 * @returns The generated slug.
 *
 * @example
 * // returns "hello-world-123"
 * createSlug("  Hello World 123!  ");
 *
 * @example
 * // returns "a-quick-brown-fox"
 * createSlug("A quick brown fox-");
 *
 * @example
 * // returns "deja-vu-et-creme-brulee"
 * createSlug("Déjà vu et crème brûlée");
 */
export function createSlug(text: string): string {
  if (typeof text !== "string") {
    return "";
  }

  const slug = text
    .toLowerCase()
    .trim()

    // Decompose accented characters into base characters and diacritical marks
    .normalize("NFD")

    // Remove the diacritical marks (accents)
    .replace(/[\u0300-\u036f]/g, "")

    // Replace non-alphanumeric characters with a hyphen
    // \s matches whitespace, \W matches non-word characters. The _ is included in \w so we add it here.
    .replace(/[\s\W_]+/g, "-")

    // Remove any leading or trailing hyphens that may have been created
    .replace(/^-+|-+$/g, "");

  return slug;
}
