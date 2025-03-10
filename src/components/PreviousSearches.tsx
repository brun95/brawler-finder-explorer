
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { usePreviousSearches } from "@/hooks/usePreviousSearches";

export const PreviousSearches = () => {
  const { getSearches } = usePreviousSearches();
  const searches = getSearches();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <Clock className="w-4 h-4" />
        <span className="text-sm">Previous searches</span>
      </div>
      <div className="space-y-2">
        {searches.map((search) => (
          <Link
            key={search.tag}
            to={`/player/${search.tag}`}
            className="block p-2 text-left rounded-lg hover:bg-primary/10 transition-colors"
          >
            <div className="font-medium">{search.name}</div>
            <div className="text-sm text-gray-600">#{search.tag}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
