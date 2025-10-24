import React from 'react';
import type { Source } from '../types';
import { LinkIcon } from './IconComponents';
import { motion } from 'framer-motion';

interface SourceListProps {
  sources: Source[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Sources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source, index) => (
          <motion.a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start space-x-3 bg-glass p-4 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:scale-105"
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          >
            <div className="flex-shrink-0 pt-1">
               <LinkIcon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors"/>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-text-primary line-clamp-2">{source.title}</p>
              <p className="text-xs text-text-muted group-hover:text-primary transition-colors line-clamp-1">{source.uri}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};