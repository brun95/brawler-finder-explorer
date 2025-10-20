'use client'

import { useState, useEffect } from 'react';

export interface Favorite {
  id: string;
  type: 'player' | 'club' | 'brawler';
  name: string;
  tag?: string;
  addedAt: number;
  metadata?: {
    trophies?: number;
    icon?: number;
    members?: number;
    class?: string;
  };
}

const STORAGE_KEY = 'brawl-favorites';
const MAX_FAVORITES = 50;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  const saveFavorites = (newFavorites: Favorite[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
        setFavorites(newFavorites);
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  };

  const addFavorite = (favorite: Omit<Favorite, 'addedAt'>) => {
    const newFavorite: Favorite = {
      ...favorite,
      addedAt: Date.now(),
    };

    const existing = favorites.find(f => f.id === favorite.id && f.type === favorite.type);
    if (existing) {
      return false; // Already favorited
    }

    const newFavorites = [newFavorite, ...favorites].slice(0, MAX_FAVORITES);
    saveFavorites(newFavorites);
    return true;
  };

  const removeFavorite = (id: string, type: Favorite['type']) => {
    const newFavorites = favorites.filter(f => !(f.id === id && f.type === type));
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: string, type: Favorite['type']) => {
    return favorites.some(f => f.id === id && f.type === type);
  };

  const toggleFavorite = (favorite: Omit<Favorite, 'addedAt'>) => {
    if (isFavorite(favorite.id, favorite.type)) {
      removeFavorite(favorite.id, favorite.type);
      return false;
    } else {
      return addFavorite(favorite);
    }
  };

  const clearAllFavorites = () => {
    saveFavorites([]);
  };

  const getFavoritesByType = (type: Favorite['type']) => {
    return favorites.filter(f => f.type === type);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    getFavoritesByType,
  };
};
