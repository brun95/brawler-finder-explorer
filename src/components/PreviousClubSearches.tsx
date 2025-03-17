
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { usePreviousClubSearches } from "@/hooks/usePreviousClubSearches";
import { useLanguage } from "@/hooks/useLanguage";

export const PreviousClubSearches = () => {
  const { getSearches } = usePreviousClubSearches();
  const { t } = useLanguage();
  const searches = getSearches();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4 max-w-sm mx-auto">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{t.search.previousSearches}</span>
      </div>
      <div className="space-y-1">
        {searches.map((search) => (
          <Link
            key={search.tag}
            to={`/club/${search.tag.replace('#', '')}`}
            className="block p-2 text-left rounded-lg hover:bg-primary/10 dark:hover:bg-gray-800 transition-colors bg-white/50 dark:bg-gray-900/50"
          >
            <div className="font-medium dark:text-gray-200">{search.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">#{search.tag}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
