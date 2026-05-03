import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCountriesContext } from "../context/CountriesContext";
import Loader from "../components/Loader";
import {
  formatPopulation,
  formatCapital,
  formatNativeName,
  formatCurrencies,
  formatLanguages,
  formatTLD,
} from "../utils/formatters";

const BASE_URL = "https://restcountries.com/v3.1";

function CountryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { countries } = useCountriesContext();
  const [country, setCounty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch details for specified country
  useEffect(() => {
    let cancelled = false;

    async function fetchCountry() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/alpha/${id}`);

        if (!response.ok) {
          throw new Error(`Country not found (${response.status})`);
        }

        const data = await response.json();

        if (!cancelled) {
          setCounty(data[0]); // API returns an array with a single item
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCountry();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // resolve the country's cca3 code to country's common name
  function getBorderName(cca3) {
    const found = countries.find((country) => country.cca3 === cca3);
    return found ? found.name.common : cca3; // fallback to returning code if not found
  }

  if (loading) return <Loader />;

  // *** ToDo: style error container/back button
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-20 flex justify-center items-center">
        <p className="text-lg text-red-500 dark:text-red-400">
          {error}
        </p>
        <button onClick={() => navigate(-1)} className="flex">
          Go back
        </button>
      </div>
    );
  }

  if (!country) return null;

  // destructure needed country data
  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    tld,
    currencies,
    languages,
    borders,
  } = country;

  return (
    <div className="max-w-3xl lg:max-w-7xl mx-auto px-5 sm:px-16 lg:px-5">
      {/* back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="min-h-11 mb-16 inline-flex items-center justify-center border-none rounded-md bg-gray-300 dark:bg-gray-700 text-neutral-900 dark:text-gray-50 px-4 py-2 text-sm font-semibold shadow-md hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 cursor-pointer transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Go Back
      </button>

      {/* country info container */}
      <div className="flex flex-col lg:flex-row gap-12 md:gap-14">
        {/* country flag */}
        <div className="">
          <img
            src={flags.svg || flags.png}
            alt={flags.alt || `flag of ${name.common}`}
            className="aspect-3/2 rounded-lg shadow-lg"
          />
        </div>
        {/* details */}
        <div className="full">
          <h1 className="mb-4 text-3xl font-bold">{name.common}</h1>
          {/* description list grid */}
          <div className="mb-8 lg:mb-16 grid sm:grid-cols-2 gap-8">
            <dl className="space-y-2">
              <DescListRow
                label="Native Name"
                value={formatNativeName(name.nativeName)}
              />
              <DescListRow
                label="Population"
                value={formatPopulation(population)}
              />
              <DescListRow label="Region" value={region} />
              <DescListRow
                label="Sub Region"
                value={subregion || "N/A"}
              />
              <DescListRow
                label="Capital"
                value={formatCapital(capital)}
              />
            </dl>
            <dl className="space-y-2">
              <DescListRow
                label="Top Level Domain"
                value={formatTLD(tld)}
              />
              <DescListRow
                label="Currencies"
                value={formatCurrencies(currencies)}
              />
              <DescListRow
                label="Languages"
                value={formatLanguages(languages)}
              />
            </dl>
          </div>
          {/* border countries - link buttons in flex row */}
          {borders && borders.length > 0 && (
            <div>
              <h2 className="mb-4 font-semibold">
                Border Countries:
              </h2>
              <div className="flex flex-wrap gap-4">
                {borders.map((cca3) => (
                  <Link
                    key={cca3}
                    to={`/country/${cca3}`}
                    className="inline-flex items-center justify-center border-none rounded-md bg-gray-200 dark:bg-gray-700 text-neutral-900 dark:text-gray-50 px-4 py-2 text-sm font-semibold shadow-md hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 cursor-pointer transition-colors">
                    {getBorderName(cca3)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal component to facilitate description list items
function DescListRow({ label, value }) {
  return (
    <div className="flex gap-1">
      <dt className="font-semibold">{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default CountryDetail;
