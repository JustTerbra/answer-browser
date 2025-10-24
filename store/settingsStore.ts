import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState } from '../types';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      searchEngine: 'Google',
      blockTrackers: true,
      clearHistoryOnExit: false,
      fontSize: 'medium',
      highContrast: false,
      enableSoundCues: true,
      reduceMotion: false,

      // Actions
      setSearchEngine: (engine) => set({ searchEngine: engine }),
      setBlockTrackers: (value) => set({ blockTrackers: value }),
      setClearHistoryOnExit: (value) => set({ clearHistoryOnExit: value }),
      setFontSize: (size) => set({ fontSize: size }),
      setHighContrast: (value) => set({ highContrast: value }),
      setEnableSoundCues: (value) => set({ enableSoundCues: value }),
      setReduceMotion: (value) => set({ reduceMotion: value }),
    }),
    {
      name: 'answer-browser-settings', // name of the item in the storage (must be unique)
    }
  )
);