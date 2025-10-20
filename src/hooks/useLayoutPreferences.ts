'use client'

import { useState, useEffect } from 'react';

export type ViewMode = 'grid' | 'list';
export type Density = 'comfortable' | 'compact';
export type SortOrder = 'asc' | 'desc';

export interface LayoutPreferences {
  brawlers: {
    viewMode: ViewMode;
    sortBy: string;
    sortOrder: SortOrder;
  };
  maps: {
    viewMode: ViewMode;
    sortBy: string;
    sortOrder: SortOrder;
  };
  density: Density;
  showAnimations: boolean;
}

const DEFAULT_PREFERENCES: LayoutPreferences = {
  brawlers: {
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  maps: {
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  density: 'comfortable',
  showAnimations: true,
};

const STORAGE_KEY = 'brawl-layout-preferences';

export const useLayoutPreferences = () => {
  const [preferences, setPreferences] = useState<LayoutPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load layout preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: Partial<LayoutPreferences>) => {
    if (typeof window !== 'undefined') {
      try {
        const updated = { ...preferences, ...newPreferences };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setPreferences(updated);
      } catch (error) {
        console.error('Failed to save layout preferences:', error);
      }
    }
  };

  const updateBrawlersView = (updates: Partial<LayoutPreferences['brawlers']>) => {
    savePreferences({
      brawlers: { ...preferences.brawlers, ...updates },
    });
  };

  const updateMapsView = (updates: Partial<LayoutPreferences['maps']>) => {
    savePreferences({
      maps: { ...preferences.maps, ...updates },
    });
  };

  const setDensity = (density: Density) => {
    savePreferences({ density });
  };

  const toggleAnimations = () => {
    savePreferences({ showAnimations: !preferences.showAnimations });
  };

  const resetPreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
    }
  };

  return {
    preferences,
    updateBrawlersView,
    updateMapsView,
    setDensity,
    toggleAnimations,
    resetPreferences,
  };
};
