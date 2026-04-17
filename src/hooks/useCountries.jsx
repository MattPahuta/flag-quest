import { useState, useEffect} from 'react';

const BASE_URL = "https://restcountries.com/v3.1/all?fields=";
const FIELDS = "name,flags,population,region,capital,cca3";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null); // clear any previous error state before attempt

        const response = await fetch(`${BASE_URL}${FIELDS}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
          setCountries(sortedCountries);
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

    fetchCountries();

    // cleanup - don't attempt to set state on unmounted component
    return () => {
      cancelled = true;
    }

  }, []);

  return { countries, loading, error }
}