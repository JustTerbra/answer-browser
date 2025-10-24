
import React from 'react';
import { SearchIcon } from '../IconComponents';
import { motion } from 'framer-motion';

interface RelatedSearchesProps {
  searches: string[];
  onSearch: (query: string) => void;
}

export const RelatedSearches: React.FC<RelatedSearchesProps> = ({ searches, onSearch }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
        <SearchIcon className="w-5 h-5 mr-3 text-text-muted" />
        Related Searches
      </h3>
      <div className="flex flex-wrap gap-3">
        {searches.map((query, index) => (
          <motion.button
            key={index}
            onClick={() => onSearch(query)}
            className="bg-glass px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md hover:border-primary/50 hover:text-primary transition-all duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {query}
          </motion.button>
        ))}
      </div>
    </div>
  );
};