
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDownloadStore } from '../../store/downloadStore';
import { useDownloadManager } from '../../hooks/useDownloadManager';
import { useSound } from '../../hooks/useSound';
import { completeSound } from '../../assets/sounds';
import { DownloadIcon, FolderOpenIcon, TrashIcon, CloseIcon } from '../IconComponents';
import type { DownloadItem } from '../../types';

const getStatusColor = (status: DownloadItem['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'failed':
      return 'text-red-500';
    case 'cancelled':
      return 'text-text-muted';
    case 'in-progress':
    default:
      return 'text-blue-400';
  }
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-surface-light rounded-full h-1.5 mt-2">
    <motion.div
      className="bg-primary h-1.5 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ ease: "linear" }}
    />
  </div>
);

export const DownloadsPanel: React.FC = () => {
  const { downloads, clearDownloads, removeDownload, updateDownload } = useDownloadStore();
  const { play: playCompleteSound } = useSound(completeSound);
  
  // Hook to simulate downloads
  useDownloadManager(); 

  const sortedDownloads = [...downloads].sort((a, b) => b.createdAt - a.createdAt);
  
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const prevCompletedCountRef = useRef(completedCount);

  // Play a sound when a download completes
  useEffect(() => {
    if (completedCount > prevCompletedCountRef.current) {
      playCompleteSound();
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, playCompleteSound]);

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-text-primary mb-6 flex items-center">
            <DownloadIcon className="w-8 h-8 mr-4 text-primary" />
            Downloads
          </h1>
          {downloads.length > 0 && (
             <button
                onClick={clearDownloads}
                className="mb-6 flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Clear All</span>
              </button>
          )}
        </div>
      </header>

      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
          {sortedDownloads.length > 0 ? (
            <motion.ul className="space-y-4">
              {sortedDownloads.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="bg-glass p-4 rounded-xl border border-white/10 backdrop-blur-md group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow overflow-hidden">
                      <h2 className="text-lg font-medium text-text-primary truncate">{item.fileName}</h2>
                      <p className="text-sm text-text-muted">{item.size}</p>
                    </div>
                     <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                       <span className={`text-sm font-medium capitalize ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                       </span>
                        {item.status === 'in-progress' && (
                            <motion.button whileTap={{scale:0.8}} onClick={() => updateDownload(item.id, { status: 'cancelled' })} aria-label="Cancel download" className="p-1 text-text-muted hover:text-primary"><CloseIcon className="w-5 h-5"/></motion.button>
                        )}
                        {item.status !== 'in-progress' && (
                           <motion.button whileTap={{scale:0.8}} onClick={() => removeDownload(item.id)} aria-label="Remove from list" className="p-1 text-text-muted hover:text-primary"><TrashIcon className="w-5 h-5"/></motion.button>
                        )}
                     </div>
                  </div>
                  {item.status === 'in-progress' && <ProgressBar progress={item.progress} />}
                  {item.status === 'completed' && (
                     <div className="flex items-center space-x-4 mt-3 text-sm">
                        <button className="text-primary font-semibold hover:underline">Open File</button>
                        <button className="text-text-muted hover:text-primary transition-colors flex items-center space-x-1"><FolderOpenIcon className="w-4 h-4"/> <span>Show in Folder</span></button>
                     </div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-text-muted flex flex-col items-center justify-center h-full"
            >
              <DownloadIcon className="w-16 h-16 mb-4 text-surface" />
              <h2 className="text-xl font-semibold text-text-primary">No Downloads</h2>
              <p>Your downloaded files will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};