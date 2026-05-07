import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="py-24 flex flex-col items-center justify-center">
      <p className="mb-5 text-6xl font-bold text-neutral-500 dark:text-zinc-500">
        404
      </p>
      <h1 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-zinc-200">
        Page not found
      </h1>
      <p className="mb-8 text-sm text-neutral-600 dark:text-zinc-400">
        The page you're looking for does not exist.
      </p>
      <Link
        to="/"
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
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
