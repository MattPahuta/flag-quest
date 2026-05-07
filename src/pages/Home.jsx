import { useState, useMemo } from "react";
import { useCountriesContext } from "../context/CountriesContext";
import SearchControls from "../components/SearchCountrols";
import CountryCard from "../components/CountryCard";
import Loader from "../components/Loader";

function Home() {
  const { countries, loading, error } = useCountriesContext();
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
    <div className="max-w-7xl mx-auto">
      <SearchControls
        search={search}
        selectedRegion={selectedRegion}
        onSearchChange={(e) => setSearch(e.target.value)}
        onRegionChange={(e) => setSelectedRegion(e.target.value)}
      />
      {/* Display Result count */}
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {filteredCountries.length}{" "}
        {filteredCountries.length === 1 ? "country" : "countries"}{" "}
        found
      </p>
      {/* Countries Grid */}
      {filteredCountries.length > 0 ? (
        <div className="grid gap-10 md:gap-16 grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))]">
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
