import React from 'react';
import { motion, Reorder } from 'framer-motion';
import type { Tab } from '../types';
import { useTabStore } from '../store/tabStore';
import { CloseIcon } from './IconComponents';
import { useSound } from '../hooks/useSound';
import { tabCloseSound } from '../assets/sounds';
import { useSettingsStore } from '../store/settingsStore';

interface TabProps {
  tab: Tab;
  isActive: boolean;
}

export const TabComponent: React.FC<TabProps> = ({ tab, isActive }) => {
  const { removeTab, setActiveTab } = useTabStore();
  const { play: playTabCloseSound } = useSound(tabCloseSound);
  const { reduceMotion } = useSettingsStore();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent setActiveTab from firing
    playTabCloseSound();
    removeTab(tab.id);
  };
  
  const spring = reduceMotion
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 500, damping: 30 };

  return (
    <Reorder.Item
      value={tab}
      id={`tab-${tab.id}`}
      onClick={() => setActiveTab(tab.id)}
      className={`relative h-[42px] flex items-center justify-between px-4 rounded-xl cursor-pointer group select-none max-w-[220px] transition-colors duration-200 ${
        isActive ? 'bg-glass' : 'hover:bg-surface/60'
      }`}
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
    >
      <span className="text-sm truncate pr-2 text-text-primary">{tab.title}</span>
      <motion.button
        onClick={handleClose}
        aria-label={`Close tab: ${tab.title}`}
        className="p-1 rounded-full text-text-muted opacity-0 group-hover:opacity-100 hover:bg-primary/50 hover:text-white focus:opacity-100 focus:bg-primary/50 focus:outline-none"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <CloseIcon className="w-4 h-4" />
      </motion.button>

      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="underline"
          transition={spring}
        />
      )}
    </Reorder.Item>
  );
};