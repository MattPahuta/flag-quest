/**
 * Format the raw population integer from API to locale-aware string
 */
export function formatPopulation(number) {
  return number.toLocaleString();
}

/**
 * Extract first capital from API-retured capitals array (in case of multiples)
 * Guard against countries with no designated capitals (empty array or undefined)
 */
export function formatCapital(capital) {
  if (!capital || capital.length === 0) return "N/A";
  return capital[0];
}