import React from 'react';
import { Reorder, motion } from 'framer-motion';
import { useTabStore } from '../store/tabStore';
import { TabComponent } from './Tab';
import { PlusIcon } from './IconComponents';
import { useSound } from '../hooks/useSound';
import { tabOpenSound } from '../assets/sounds';

export const TabsBar: React.FC = () => {
  const { tabs, setTabs, addTab, activeTabId } = useTabStore();
  const { play: playTabOpenSound } = useSound(tabOpenSound);

  const handleAddTab = () => {
    addTab();
    playTabOpenSound();
  };

  return (
    <div className="flex-shrink-0 h-[56px] bg-surface/30 flex items-center px-3 border-b border-white/5 z-10">
      <Reorder.Group
        axis="x"
        values={tabs}
        onReorder={setTabs}
        className="flex items-center space-x-1 h-full"
        layoutScroll
      >
        {tabs.map((tab) => (
          <TabComponent
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
          />
        ))}
      </Reorder.Group>
      <motion.button
        onClick={handleAddTab}
        aria-label="Add new tab"
        className="p-2 ml-2 rounded-lg hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-primary-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <PlusIcon className="w-5 h-5 text-text-muted" />
      </motion.button>
    </div>
  );
};