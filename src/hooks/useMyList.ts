import { useState, useEffect } from 'react';
import type { Movie, MyListItem } from '@/types/movie';

const STORAGE_KEY = 'netflix-bot-mylist';

export const useMyList = () => {
  const [myList, setMyList] = useState<MyListItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedList = JSON.parse(stored) as MyListItem[];
        setMyList(parsedList);
      }
    } catch (error) {
      console.error('Error loading My List from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever myList changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myList));
    } catch (error) {
      console.error('Error saving My List to localStorage:', error);
    }
  }, [myList]);

  const addToMyList = (movie: Movie) => {
    const exists = myList.some(item => item.imdbID === movie.imdbID);
    if (!exists) {
      const newItem: MyListItem = {
        imdbID: movie.imdbID,
        movie,
        addedAt: new Date().toISOString(),
      };
      setMyList(prev => [newItem, ...prev]);
      return true;
    }
    return false;
  };

  const removeFromMyList = (imdbId: string) => {
    setMyList(prev => prev.filter(item => item.imdbID !== imdbId));
  };

  const isInMyList = (imdbId: string) => {
    return myList.some(item => item.imdbID === imdbId);
  };

  const clearMyList = () => {
    setMyList([]);
  };

  return {
    myList: myList.map(item => item.movie),
    addToMyList,
    removeFromMyList,
    isInMyList,
    clearMyList,
    count: myList.length,
  };
};
