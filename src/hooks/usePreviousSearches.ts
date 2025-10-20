import { useState, useEffect, useCallback } from 'react';

interface PlayerSearch {
  tag: string;
  name: string;
}

export const usePreviousSearches = () => {
  const storageKey = 'previousSearches';
  const [searches, setSearches] = useState<PlayerSearch[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load searches from localStorage after hydration
  useEffect(() => {
    setIsClient(true);
    const loadedSearches = getSearches();
    setSearches(loadedSearches);
  }, []);

  const getSearches = (): PlayerSearch[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  };

  const addSearch = useCallback((tag: string, name: string) => {
    const newSearch = { tag, name };

    setSearches(prevSearches => {
      // Remove if exists and add to beginning
      const updatedSearches = [
        newSearch,
        ...prevSearches.filter(s => s.tag !== tag)
      ].slice(0, 5); // Keep only last 5 searches

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      }

      return updatedSearches;
    });
  }, []);

  const removeSearch = (tag: string) => {
    const updatedSearches = searches.filter(s => s.tag !== tag);
    setSearches(updatedSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
    }
  };

  const clearAllSearches = () => {
    setSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  return {
    searches: isClient ? searches : [],
    addSearch,
    getSearches,
    removeSearch,
    clearAllSearches
  };
};
