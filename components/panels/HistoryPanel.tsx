
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore } from '../../store/historyStore';
import type { HistoryItem } from '../../types';
import { HistoryIcon, SearchIcon, TrashIcon } from '../IconComponents';

const groupHistoryByDate = (history: HistoryItem[]) => {
  const groups: { [key: string]: HistoryItem[] } = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  history.forEach(item => {
    const itemDate = new Date(item.timestamp);
    itemDate.setHours(0, 0, 0, 0);

    let key: string;
    if (itemDate.getTime() === today.getTime()) {
      key = 'Today';
    } else if (itemDate.getTime() === yesterday.getTime()) {
      key = 'Yesterday';
    } else {
      key = itemDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });
  return groups;
}

export const HistoryPanel: React.FC = () => {
  const { history, clearHistory, removeHistoryItem } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
    if (!searchQuery) {
      return sortedHistory;
    }
    return sortedHistory.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const groupedHistory = groupHistoryByDate(filteredHistory);

  return (
    <div className="p-4 h-full flex flex-col">
       <header className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-text-primary mb-6 flex items-center">
            <HistoryIcon className="w-8 h-8 mr-4 text-primary" />
            History
          </h1>
          {history.length > 0 && (
             <button
                onClick={clearHistory}
                className="mb-6 flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Clear Browsing Data</span>
              </button>
          )}
        </div>
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass py-3 pl-12 pr-4 rounded-xl border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary-glow"
          />
        </div>
      </header>
      
      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
          {Object.keys(groupedHistory).length > 0 ? (
            <div>
              {Object.entries(groupedHistory).map(([date, items]) => (
                <section key={date} className="mb-8">
                  <h2 className="text-lg font-semibold text-text-primary mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-2">{date}</h2>
                  <ul className="space-y-2">
                    {items.map(item => (
                       <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        className="p-3 rounded-xl flex items-center justify-between group bg-glass border border-transparent hover:border-white/10 hover:bg-surface/50 transition-colors"
                      >
                         <a href={item.url} target="_blank" rel="noopener noreferrer" className="group/link flex-grow flex items-center space-x-4 overflow-hidden">
                           <span className="text-sm text-text-muted flex-shrink-0">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <div className="overflow-hidden">
                              <h3 className="font-medium text-text-primary group-hover/link:text-primary transition-colors truncate">{item.title}</h3>
                              <p className="text-sm text-text-muted truncate">{item.url}</p>
                           </div>
                         </a>
                         <motion.button
                           onClick={() => removeHistoryItem(item.id)}
                           aria-label={`Remove ${item.title} from history`}
                           className="ml-4 p-2 rounded-full text-text-muted hover:bg-primary/20 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                         >
                           <TrashIcon className="w-5 h-5" />
                         </motion.button>
                       </motion.li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-text-muted flex flex-col items-center justify-center h-full"
            >
              <HistoryIcon className="w-16 h-16 mb-4 text-surface" />
              <h2 className="text-xl font-semibold text-text-primary">No History Found</h2>
              <p>
                {searchQuery
                  ? 'Try a different search term.'
                  : 'Your browsing history will appear here.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};