
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { BookmarkIcon, SearchIcon, TrashIcon, TagIcon } from '../IconComponents';

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const BookmarksPanel: React.FC = () => {
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery) {
      return bookmarks.sort((a, b) => b.createdAt - a.createdAt);
    }
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [bookmarks, searchQuery]);

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-4xl font-bold text-text-primary mb-6 flex items-center">
          <BookmarkIcon className="w-8 h-8 mr-4 text-primary" />
          Bookmarks
        </h1>
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass py-3 pl-12 pr-4 rounded-xl border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary-glow"
          />
        </div>
      </header>
      
      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredBookmarks.length > 0 ? (
            <motion.ul 
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredBookmarks.map((bookmark) => (
                <motion.li
                  key={bookmark.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="bg-glass p-4 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-between group transition-transform duration-200 hover:scale-[1.02] hover:border-white/20"
                >
                  <div className="flex-grow overflow-hidden">
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="group/link">
                      <h2 className="text-lg font-medium text-text-primary group-hover/link:text-primary transition-colors truncate">{bookmark.title}</h2>
                      <p className="text-sm text-text-muted truncate">{bookmark.url}</p>
                    </a>
                    {bookmark.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <TagIcon className="w-4 h-4 text-text-muted" />
                        {bookmark.tags.map(tag => (
                          <span key={tag} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <motion.button
                    onClick={() => removeBookmark(bookmark.id)}
                    aria-label={`Remove ${bookmark.title}`}
                    className="ml-4 p-2 rounded-full text-text-muted hover:bg-primary/20 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-text-muted flex flex-col items-center justify-center h-full"
            >
              <BookmarkIcon className="w-16 h-16 mb-4 text-surface" />
              <h2 className="text-xl font-semibold text-text-primary">No Bookmarks Found</h2>
              <p>
                {searchQuery 
                  ? 'Try a different search term.' 
                  : 'Click the star icon next to the address bar to save a page.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};