import { createContext, useContext } from "react";
import { useCountries } from "../hooks/useCountries";

const CountriesContext = createContext();

export function CountriesProvider({ children }) {
  const { countries, loading, error } = useCountries();

  return (
    <CountriesContext.Provider value={{ countries, loading, error }}>
      {children}
    </CountriesContext.Provider>
  );
}

export function useCountriesContext() {
  const context = useContext(CountriesContext);
  if (!context)
    throw new Error(
      "useCountriesContext must be used within CountriesProvider",
    );
  return context;
}
