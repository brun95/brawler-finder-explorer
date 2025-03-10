
interface PlayerSearch {
  tag: string;
  name: string;
}

export const usePreviousSearches = () => {
  const storageKey = 'previousSearches';
  
  const addSearch = (tag: string, name: string) => {
    const searches = getSearches();
    const newSearch = { tag, name };
    
    // Remove if exists and add to beginning
    const updatedSearches = [
      newSearch,
      ...searches.filter(s => s.tag !== tag)
    ].slice(0, 5); // Keep only last 5 searches
    
    localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
  };
  
  const getSearches = (): PlayerSearch[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  };
  
  return { addSearch, getSearches };
};
