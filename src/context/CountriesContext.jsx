import { createContext, useContext } from "react";
import { useCountries } from "../hooks/useCountries";

// Separate context for countries as theme and data are independent concerns
const CountriesContext = createContext();

export function CountriesProvider({ children }) {
  const { countries, loading, error } = useCountries(); // hook logic remains in useCountries

  // CountriesContext a delivery mechansim, passing data from useCountries to children
  return (
    <CountriesContext value={{ countries, loading, error }}> 
      {children}
    </CountriesContext>
  )
}

export function useCountriesContext() {
  const context = useContext(CountriesContext);
  if (!context) throw new Error('useCountriesContext must be used within CountriesProvider');
  return context;
}