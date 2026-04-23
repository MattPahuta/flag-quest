import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 text-neutral-900 dark:bg-gray-800 dark:text-zinc-50 transition-colors duration-300">
          <Header />
          <main className="px-4 sm:px-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/country/:id"
                element={<CountryDetail />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
