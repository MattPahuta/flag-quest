import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "https://restcountries.com/v3.1";

export function useCountryDetail() {
  const { id } = useParams();
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

    return { country, loading, error };
  
}