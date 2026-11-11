# FlagQuest - REST Countries Explorer

FlagQuest is a responsive country explorer built with React, React Router, and Tailwind CSS. Browse all countries from the from a local dataset, search by country name, filter by world region, and view details of the selected country.  

*Note:* This project was originally built to consume data from the [REST Countries API](https://restcountries.com/), per the Frontend Masters instructions and original challenge design comp. Since my original implementation, the API switched from a free to a paid model. I have adapted the app to rely on a local `data.json` file (provided by Frontend Mentor). Little has changed in the code between the API and local data versions, but where it has I've left development comments within the relevant files and call outs within this project README. 

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 


![](./src/assets/ss_home-page.jpg)

![](./src/assets/ss_detail-page.jpg)


## Table of Contents

- [Overview](#overview)
  - [Features](#features)
  - [Links](#links)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
- [Data Source & Migration](#data-source--migration)
- [Architecture & Key Decisions](#architecture--key-decisions)
  - [Separation of Data and Theme Concerns](#separation-of-data-and-theme-concerns)
  - [Load Once, Share Everywhere](#load-once-share-everywhere)
  - [Custom Hooks as a Data Layer](#custom-hooks-as-a-data-layer)
  - [Component Design](#component-design)
  - [Utility Functions](#utility-functions)
  - [Theme System](#theme-system)
  - [Accessibility](#accessibility)
- [Legacy API reference](#legacy-api-reference)
- [Author](#author)


## Overview


### Features

Users may:

- See all countries from the dataset on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode

### Links

- [Frontend Mentor solution page](https://www.frontendmentor.io/solutions/country-explorer-built-with-react-react-router-and-tailwind-css-3H-hLVUfmk)
- [live demo site](https://resilient-platypus-dcfded.netlify.app/)


### Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and component architecture |
| React Router | Client-side routing |
| Tailwind CSS v4 | Utility-first styling and dark mode |
| Vite | Build tooling and dev server |
| Local JSON (data.json) | Country dataset, normalized at load time |

No API keys or environment variables are required. All country data ships with the app.

### Project Structure

```
src/
├── components/
│   ├── CountryCard.jsx       # Individual country card with flag, metadata
│   ├── SearchControls.jsx    # Search input and region select filtering controls
│   ├── Header.jsx            # App header with theme toggle
│   └── Loader.jsx            # Motion safe spinner for loading states
├── context/
│   ├── CountriesContext.jsx  # Delivers country data across the component tree
│   └── ThemeContext.jsx      # Global dark/light mode state and persistence
├── data/
│   ├── data.json             # Country dataset (sourced from FEM, REST Countries v2 shape)
│   └── countries.js          # Loads, normalizes and caches the dataset
├── hooks/
│   ├── useCountries.jsx      # Fetches and sorts all countries from the API
│   └── useCountryDetail.jsx  # Fetches a single country by cca3 code
├── pages/
│   ├── CountryDetail.jsx     # Full detail view for a single country
│   ├── Home.jsx              # Homepage with responsive grid
│   └── NotFound.jsx          # 404 page for unknown routes and invalid codes
└── utils/
    └── formatters.js         # Pure formatting functions to handle API data
```

## Data Source & Migration
 
FlagQuest was originally built against the live [REST Countries API v3.1](https://restcountries.com/). When that API moved to a paid model, the app's data fetching stopped working. Frontend Mentor now supplies the same data as a local file, `src/data/data.json`, so the app was migrated to use it.
 
### The Adapter Approach
 
The local file uses the older REST Countries **v2** shape, but every component and formatter was built against **v3**. Fields have different names, and several are structured differently (strings instead of arrays, arrays instead of keyed objects).
 
Rather than rewrite the components, I added a single adapter module, `src/data/countries.js`. It converts each record to the v3 shape once, when the data loads. As a result, **no UI component or formatter changed during the migration**; only the data layer did.
 
```js
export function normalizeCountry(c) {
  // ...
  return {
    name: { common: c.name, official: c.name, nativeName: { /* ... */ } },
    cca3: c.alpha3Code,
    capital: c.capital ? [c.capital] : [],
    tld: c.topLevelDomain ?? [],
    currencies,  // keyed by currency code
    languages,   // keyed by language code
    // ...
  }
}
```
 
The loader also handles performance and data quality:
 
- **Dynamic import:** `import("./data.json")` makes Vite split the ~400 KB dataset into its own chunk. The main bundle stays small, and the existing loading state still has a real job to do.
- **A single cached promise:** Both hooks call `loadCountries()`, which parses and normalizes the dataset only once. Every later call reuses the same promise. If loading fails, the cache is cleared so the next call can retry.
- **Constant-time lookups:** The loader builds a `Map` keyed by `cca3`, so the detail page finds a country with one lookup instead of searching the whole list.
- **Data sanitization:** The dataset contains a few border codes that don't match any country (such as `UNK`). These are removed at load time, so every border link on the detail page leads to a real country.

### Field Mapping
 
| v2 field (`data.json`) | v3 field (used by the app) |
|---|---|
| `name` (string) | `name.common` |
| `nativeName` (string) | `name.nativeName[langCode].common` |
| `alpha2Code` / `alpha3Code` | `cca2` / `cca3` |
| `capital` (string) | `capital` (array) |
| `topLevelDomain` | `tld` |
| `currencies` (array) | `currencies` (object keyed by currency code) |
| `languages` (array) | `languages` (object keyed by language code) |
| `flags.svg` / `flags.png` | `flags.svg` / `flags.png` / `flags.alt` |

## Architecture & Key Decisions

### Separation of Data and Theme Concerns

Global state is split across two independent React contexts — `ThemeContext` for light/dark theme modes and `CountriesContext` for the API data. Each context has a specific responsibility.

### Load Once, Share Everywhere
 
Country data is loaded a single time at the app level by `CountriesProvider`, which wraps `BrowserRouter`. Both the `Home` and `CountryDetail` pages read this data from context instead of loading it themselves. This also lets the detail page resolve border country names without any extra work.
 
Behind the context, the loader's cached promise means the dataset is parsed and normalized exactly once per session, no matter how many components ask for it.

### Custom hooks as a data layer

Two separate custom hooks handle the needed data fetching logic:

- `useCountries` - handles getting all countries, sorting, and managing loading and error states.
- `useCountryDetail` - looks up a single country by the `cca3` code in the URL, and runs again whenever that URL parameter changes.

The page components import the hooks, destructure what they need, and focus primarily on rendering, separating concerns.

Each hook also uses a `cancelled` cleanup pattern. Loading is asynchronous (the dataset is a dynamic import), so a user can navigate away before it finishes. The flag prevents the hook from setting state on a component that has already unmounted:

```js
  useEffect(() => {
    let cancelled = false;

    async function getCountries() {
      try {
        setLoading(true);
        setError(null); // clear any previous error state before attempt
        const { list } = await loadCountries(); // normalized & sorted
        if (!cancelled) {
          setCountries(list)
        }
      } catch (error) {
        if (!cancelled) {
          setError(`Could not load country data: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getCountries();

    return () => {
      cancelled = true;
    }

  }, []);
```

### Component Design

The scope of individual components is limited, generally only extracting when they appear in more than one place or contribute to a cluttered parent file. `Header`, `CountryCard`, and `Loader` were obvious and initial components. `SearchControls` came later after `Home` grew too large and cumbersome. Additionally, I used several internal components with `CountryDetail`, such as `DescListRow` and `BorderCountries`, to make the component more readable and manageable. Since these internal components weren't needed anywhere else in the project, I kept them local.


### Utility Functions

The project implements a number of utility functions to format and/or normalize data (originally pulled from the API, now retrieved from the local dataset). Additionally, each function takes a defensive approach, assuming there will be gaps in the data (e.g., no capital, no currencies, missing native names, etc.):

```js
export function formatNativeName(nativeName) {
  if (!nativeName) return 'N/A'
  const first = Object.values(nativeName)[0]
  return first?.common || 'N/A'
}
```
`nativeName`, `currencies`, and `languages` are all objects keyed by language or currency codes not known in advance. `Object.values()` extracts the data without needing to know the key, making the formatters resilient to any valid API response shape.

```js
function getBorderName(cca3) {
  const found = countries.find(c => c.cca3 === cca3)
  return found ? found.name.common : cca3
}
```
Another utility function is used to generate the border country chip buttons and prevent repetitive data fetching. Reusing data already available, the function checks the cca3 code against the countries in state, within unknown border codes filteed out.


### Theme System

- Dark/light theme with persistence and OS-preference detection
- Manual light/dark theme toggle
- Smooth color transitions

I utilized [Tailwind's class strategy](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) along with `localStorage` within `ThemeContext` to manage the user's preferred/selected theme. We first check for a saved preference, then fall back to the OS-level preference:

```js
const [darkMode, setDarkMode] = useState(() => {
  const stored = localStorage.getItem('theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})
```

### Accessibility

The project uses semantic HTML and ARIA attributes throughout:
 
- **Description lists for metadata:** Country details are marked up with `dl`, `dt`, and `dd` rather than generic `div` elements, which is an ideal fit for label/value pairs.
- **Labelled controls:** The search input and region select both have accessible names through `aria-label`.
- **Visible focus states:** Every interactive element (cards, buttons, border links, form controls) has a clear `focus-visible` outline.
- **Decorative icons hidden:** The search icon uses `aria-hidden="true"` and `focusable="false"`, so screen readers skip it.
- **Flag alt text:** Every flag image has descriptive alt text.
- **Reduced motion:** The loading spinner respects the user's reduced-motion preference.

```jsx
<dl>
  <div className="flex gap-1">
    <dt className="font-semibold">Population:</dt>
    <dd>{formatPopulation(population)}</dd>
  </div>
</dl>
```
 
Note: I was initially wary of wrapping the `dt` and `dd` pairs in `div`s (to match the design comp) out of fear I'd break accessibility, but the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl#wrapping_name-value_groups_in_div_elements) confirmed that this is valid.

## Legacy API Reference
 
This project originally used the [REST Countries API v3.1](https://restcountries.com).
 
| Endpoint | Used for |
|---|---|
| `/v3.1/all?fields=...` | Homepage — all countries, scoped fields |
| `/v3.1/alpha/{cca3}` | Detail page — full data for single country |


## Author

- Website - [Matt Pahuta](https://www.mattpahuta.com)
- Frontend Mentor - [@mattpahuta](https://www.frontendmentor.io/profile/MattPahuta)
- LinkedIn - [Matt Pahuta](https://linkedin.com/in/mattpahuta)