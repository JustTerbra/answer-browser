
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookmarkState, Bookmark } from '../types';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (bookmark) => set((state) => {
        const newBookmark: Bookmark = {
          ...bookmark,
          id: generateId(),
          createdAt: Date.now(),
          tags: bookmark.tags || [],
        };
        return { bookmarks: [...state.bookmarks, newBookmark] };
      }),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      })),
      updateBookmarkTags: (id, tags) => set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === id ? { ...b, tags } : b
        ),
      })),
    }),
    {
      name: 'answer-browser-bookmarks',
    }
  )
);
