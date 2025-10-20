
'use client'

import { Clock, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePreviousSearches } from "@/hooks/usePreviousSearches";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "./ui/button";

export const PreviousSearches = () => {
  const { searches, removeSearch, clearAllSearches } = usePreviousSearches();
  const { t } = useLanguage();

  if (searches.length === 0) return null;

  const handleRemoveSearch = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeSearch(tag);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    clearAllSearches();
  };

  return (
    <div className="mt-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{t.search.previousSearches}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="h-6 px-2 text-xs hover:text-red-500"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear All
        </Button>
      </div>
      <div className="space-y-1">
        {searches.map((search) => (
          <div key={search.tag} className="relative group">
            <Link
              href={`/player/${search.tag}`}
              className="block p-2 pr-10 text-left rounded-lg hover:bg-primary/10 dark:hover:bg-gray-800 transition-colors bg-white/50 dark:bg-gray-900/50"
            >
              <div className="font-medium dark:text-gray-200">{search.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">#{search.tag}</div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleRemoveSearch(e, search.tag)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
