import { useState, useMemo } from "react";
import { useCountries } from "../hooks/useCountries";
import CountryCard from "../components/CountryCard";
import Loader from "../components/Loader";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function Home() {
  const { countries, loading, error } = useCountries();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRegion = selectedRegion
        ? country.region === selectedRegion
        : true;
      return matchesSearch && matchesRegion;
    });
  }, [countries, search, selectedRegion]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="py-20 flex justify-center items-center">
        <p className="text-lg text-red-500 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 xl:px-4">
      {/* search controls wrapper */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row justify-between">
        {/* search input group */}
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a country..."
            className="w-full py-4 pl-11 pr-4 rounded-lg shadow-sm text-base border-0 text-slate-900 bg-white dark:bg-gray-700 dark:text-zinc-50 placeholder-slate-400 outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 transition-colors duration-200"
          />
        </div>
        {/* filter by region select */}
        <select
          id="region-select"
          aria-label="Filter by region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="max-w-52 min-h-14 py-4 px-6 rounded-lg shadow-sm cursor-pointer text-base border-0 text-slate-900 bg-white dark:bg-gray-700 dark:text-zinc-50 outline-1 -outline-offset-1 outline-slate-300  dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 transition-colors duration-200">
          <option value="">Filter by Region</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Display Result count */}
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {filteredCountries.length}{" "}
        {filteredCountries.length === 1 ? "country" : "countries"}{" "}
        found.
      </p>

      {/* Countries Grid */}
      {filteredCountries.length > 0 ? (
        <div className="grid gap-10 md:gap-16 grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]">
          {filteredCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No countries match search.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
