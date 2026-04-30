import { Link } from "react-router-dom";
import { formatPopulation, formatCapital } from "../utils/formatters";

// ToDo: add better focus styles (outlines, etc.)

function CountryCard({ country }) {
  const { name, flags, population, region, capital, cca3 } = country;

  return (
    <Link
      to={`/country/${cca3}`}
      className="group block bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="h-48 overflow-hidden">
        <img
          src={flags.svg || flags.png}
          alt={flags.alt || `Flag of ${name.common}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 text-neutral-900 dark:text-zinc-50">
        <h2 className="mb-3 text-lg font-bold truncate">
          {name.common}
        </h2>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-1">
            <dt className="font-semibold">Population:</dt>
            <dd>{formatPopulation(population)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold">Region:</dt>
            <dd>{region}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold">Capital:</dt>
            <dd>{formatCapital(capital)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export default CountryCard;