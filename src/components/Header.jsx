import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

  // Test: if transition-colors and duration needed here
  return (
    <header className="py-6 px-4 sm:px-10 bg-zinc-50 dark:bg-gray-700 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <Link
            to="/"
            className="rounded-lg hover:opacity-75 transition-opacity hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            FlagQuest
          </Link>
        </h1>

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle color theme button"
          className="py-1 px-2 inline-flex items-center justify-center gap-2 font-medium text-center text-zinc-950 dark:text-zinc-50 rounded-lg hover:opacity-75 transition-opacity hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          {darkMode ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8M11 2h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zm-8 8h2v3h-2zm7.621-15l1.415 1.414l-2.122 2.122L16.5 6.12zM16.5 17.414L17.914 16l2.122 2.121l-1.415 1.415zM6.121 16l1.415 1.414l-2.122 2.122L4 18.12zM4 5.414L5.414 4l2.122 2.121L6.12 7.536z"
                />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M12.97 3a8.02 8.02 0 0 0-4.054 7c0 4.418 3.522 8 7.866 8c1.146 0 2.236-.25 3.218-.698C18.39 19.544 15.787 21 12.849 21C7.962 21 4 16.97 4 12s3.962-9 8.849-9z"
                />
              </svg>
              Dark Mode
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;