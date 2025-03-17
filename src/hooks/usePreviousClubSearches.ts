
interface ClubSearch {
  tag: string;
  name: string;
}

export const usePreviousClubSearches = () => {
  const storageKey = 'previousClubSearches';
  
  const addSearch = (tag: string, name: string) => {
    const searches = getSearches();
    const newSearch = { tag, name };
    
    // Remove if exists and add to beginning
    const updatedSearches = [
      newSearch,
      ...searches.filter(s => s.tag !== tag)
    ].slice(0, 6); // Keep only last 6 searches
    
    localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
  };
  
  const getSearches = (): ClubSearch[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  };
  
  return { addSearch, getSearches };
};
