import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadCountries } from "../data/countries";

// const BASE_URL = "https://restcountries.com/v3.1";

export function useCountryDetail() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      let cancelled = false;
  
      async function getCountry() {
        try {
          setLoading(true);
          setError(null);
  
          // const response = await fetch(`${BASE_URL}/alpha/${id}`);
          const { byCode } = await loadCountries();
          const match = byCode.get(id?.toUpperCase());
  
          // if (!response.ok) {
          //   throw new Error(`Country not found (${response.status})`);
          // }
          if (!match) {
            throw new Error(`Country not found (${id})`);
          }
  
          // const data = await response.json();
  
          // if (!cancelled) {
          //   setCountry(data[0]); // API returns an array with a single item
          // }
          if (!cancelled) {
            setCountry(match);
          }
        } catch (error) {
          if (!cancelled) {
            // setError(error.message);
            setCountry(null);
            setError(error.message);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }
  
      getCountry();
  
      return () => {
        cancelled = true;
      };
    }, [id]);

    return { country, loading, error };
  
}