const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function SearchControls({
  search,
  selectedRegion,
  onSearchChange,
  onRegionChange,
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row justify-between">
      <div className="relative grow lg:grow-0 lg:min-w-120">
        <svg
          aria-hidden="true"
          focusable="false"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m16.325 14.899l5.38 5.38a1.008 1.008 0 0 1-1.427 1.426l-5.38-5.38a8 8 0 1 1 1.426-1.426M10 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12"
          />
        </svg>
        <input
          id="country-search"
          aria-label="Search by country name"
          type="text"
          value={search}
          onChange={onSearchChange}
          placeholder="Search for a country..."
          className="w-full py-4 pl-11 pr-4 rounded-lg shadow-sm text-base border-0 text-slate-900 bg-white dark:bg-gray-700 dark:text-zinc-50 placeholder-slate-400 outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 transition-colors duration-200"
        />
      </div>
      <select
        id="region-select"
        aria-label="Filter by region"
        value={selectedRegion}
        onChange={onRegionChange}
        className="max-w-52 min-h-14 py-4 px-6 rounded-lg shadow-sm cursor-pointer text-base border-0 text-slate-900 bg-white dark:bg-gray-700 dark:text-zinc-50 outline-1 -outline-offset-1 outline-slate-300  dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 transition-colors duration-200">
        <option value="">Filter by Region</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchControls;
