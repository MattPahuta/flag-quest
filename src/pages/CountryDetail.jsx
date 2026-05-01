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
    <div className="max-w-7xl mx-auto">
      {/* back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Go Back
      </button>

      {/* country info container */}
      <div className="flex flex-col lg:flex-row gap-12 md:gap-14">
        {/* country flag */}
        <div className="w-full">
          <img
            src={flags.svg || flags.png}
            alt={flags.alt || `flag of ${name.common}`}
            className="w-full max-h-100 object-cover rounded-lg shadow-lg"
          />
        </div>
        {/* details */}
        <div className="full">
          <h1 className="mb-4 text-2xl font-bold">{name.common}</h1>
          {/* description list grid */}
          <div className="mb-8 grid sm:grid-cols-2 gap-8">
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
              <h2 className="font-semibold">Border Countries:</h2>
              <div className="flex flex-wrap gap-2">
                {borders.map((cca3) => (
                  <Link
                    key={cca3}
                    to={`/country/${cca3}`}
                    className="py-1 px-3.5 text-sm">
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
