// *** Formatters for CountryCards, API data

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


// *** Formatters specific to CountryDetails page:

/**
 * Extract native name from API-returned nativeName object 
 * nativeName keyed by language code 
 * get the firstEntry (if multiple) of nativeName obj, take the 'common' name
 * return 'N/A' if no nativeName property or if no common prop in first entry
 */
export function formatNativeName(nativeName) {
  if (!nativeName) return 'N/A';
  const firstEntry = Object.values(nativeName)[0];
  return firstEntry?.common || 'N/A';
}

/**
 * Extract currency names and symbols from currencies object
 * e.g. { EUR: {name: "Euro", symbol: "€"} } => "Euro (€)"
 */
export function formatCurrencies(currencies) {
  if (!currencies) return 'N/A';
  return Object.values(currencies)
    .map(currency => `${currency.name} (${currency.symbol})`)
    .join(', ');
}

/**
 * Extract language names from languages object 
 * e.g. { deu: "German", frk: "Frankish" } => "German, Frankish"
 */
export function formatLanguages(languages) {
  if (!languages) return 'N/A';
  return Object.values(languages).join(', ');
}

/**
 * Extract top-level domain string(s) from array
 * e.g. [".de", ".example"] => ".de, .example"
 */
export function formatTLD(tld) {
  if (!tld || tld.length === 0) return 'N/A';
  return tld.join(', ');
}