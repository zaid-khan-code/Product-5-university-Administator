import React, { useState } from 'react';
import { initialData } from '../data/mockData';

const STORAGE_KEY = 'apexMiningData';

export function useDataStore() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  });

  const updateData = React.useCallback((newDataOrUpdater) => {
    setData((prev) => {
      const nextData = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      return nextData;
    });
  }, []);

  return [data, updateData];
}
