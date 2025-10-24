
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DownloadState, DownloadItem } from '../types';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set) => ({
      downloads: [],
      addDownload: (download) => set((state) => {
        const newDownload: DownloadItem = {
          ...download,
          id: generateId(),
          progress: 0,
          status: 'in-progress',
          createdAt: Date.now(),
        };
        return { downloads: [...state.downloads, newDownload] };
      }),
      updateDownload: (id, updates) => set((state) => ({
        downloads: state.downloads.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      })),
      removeDownload: (id) => set((state) => ({
        downloads: state.downloads.filter((d) => d.id !== id),
      })),
      clearDownloads: () => set({ downloads: [] }),
    }),
    {
      name: 'answer-browser-downloads',
    }
  )
);
