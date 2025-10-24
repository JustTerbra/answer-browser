
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryState, HistoryItem } from '../types';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistoryItem: (item) => set((state) => {
        // Prevent adding duplicate if it's the most recent item
        const lastItem = state.history[state.history.length - 1];
        if (lastItem && lastItem.url === item.url) {
          return state;
        }
        
        const newHistoryItem: HistoryItem = {
          ...item,
          id: generateId(),
          timestamp: Date.now(),
        };
        return { history: [...state.history, newHistoryItem] };
      }),
      removeHistoryItem: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'answer-browser-history',
    }
  )
);
