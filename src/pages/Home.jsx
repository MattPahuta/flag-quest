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

  // Todo: Update inputs with labels
  // - update focus, hover styles
  // - update select input attributes, A11Y (Josh Comeau)

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* search controls wrapper */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* search input */}
        <div className="relative w-full sm:max-w-sm">
          <svg
            aria-hidden="true"
            focusable="false"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white pointer-events-none"
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a country..."
            className="w-full py-4 pl-11 pr-4 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-50 border border-transparent focus:border-blue-400 focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* filter by region select */}
        <select
          name=""
          id=""
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full sm:w-48 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-zinc-50 border border-transparent focus:border-blue-400 focus:outline-none transition-colors duration-200 cursor-pointer">
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
        <div className="grid gap-10 md:gap-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
