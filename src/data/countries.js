// Local data layer for FlagQuest.
//
// Frontend Mentor's data.json uses the older REST Countries v2 shape
// (e.g. `name` is a string, `alpha3Code`, `capital` is a string,
// `currencies`/`languages` are arrays). The UI was built against the v3
// API shape (`name.common`, `cca3`, `capital[]`, keyed objects), so we
// normalize once here and every component keeps working unchanged.

export function normalizeCountry(c) {
  const languages = Object.fromEntries(
    (c.languages ?? []).map((lang) => [
      lang.iso639_2 ?? lang.iso639_1 ?? lang.name,
      lang.name,
    ])
  );

  const currencies = Object.fromEntries(
    (c.currencies ?? []).map(({ code, name, symbol }) => [code, { name, symbol }])
  );

  // v3 keys nativeName by language code; v2 only has a single string
  const nativeKey = Object.keys(languages)[0] ?? "default";
  const native = c.nativeName ?? c.name;

  return {
    name: {
      common: c.name,
      official: c.name,
      nativeName: { [nativeKey]: { common: native, official: native } },
    },
    cca2: c.alpha2Code,
    cca3: c.alpha3Code,
    flags: {
      svg: c.flags?.svg ?? c.flag,
      png: c.flags?.png ?? c.flags?.svg ?? c.flag,
      alt: `Flag of ${c.name}`,
    },
    population: c.population ?? 0,
    region: c.region ?? "",
    subregion: c.subregion ?? "",
    capital: c.capital ? [c.capital] : [],
    tld: c.topLevelDomain ?? [],
    currencies,
    languages,
    borders: c.borders ?? [],
  };
}

// Load + normalize once, shared by every hook. Dynamic import keeps the
// ~400 KB JSON out of the main bundle and keeps the loading state meaningful.
let cache = null;

export function loadCountries() {
  if (!cache) {
    cache = import("./data.json")
      .then(({ default: raw }) => {
        const list = raw.map(normalizeCountry);
        const byCode = new Map(list.map((country) => [country.cca3, country]));

        // Drop border codes with no matching entry (e.g. "UNK") so
        // border links never point at a missing country
        for (const country of list) {
          country.borders = country.borders.filter((code) => byCode.has(code));
        }

        list.sort((a, b) => a.name.common.localeCompare(b.name.common));
        return { list, byCode };
      })
      .catch((err) => {
        cache = null; // allow a retry on next call
        throw err;
      });
  }
  return cache;
}