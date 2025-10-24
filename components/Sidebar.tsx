import React from 'react';
import { motion } from 'framer-motion';
import { useTabStore } from '../store/tabStore';
import { BookmarkIcon, HistoryIcon, DownloadIcon, ExtensionsIcon, ChevronDoubleLeftIcon } from './IconComponents';
import type { ActiveView } from '../types';
import { useSound } from '../hooks/useSound';
import { clickSound } from '../assets/sounds';
import { useSettingsStore } from '../store/settingsStore';

const navItems: { view: ActiveView; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
  { view: 'BOOKMARKS', icon: BookmarkIcon, label: 'Bookmarks' },
  { view: 'HISTORY', icon: HistoryIcon, label: 'History' },
  { view: 'DOWNLOADS', icon: DownloadIcon, label: 'Downloads' },
  { view: 'EXTENSIONS', icon: ExtensionsIcon, label: 'Extensions' },
];

const sidebarVariants = {
  collapsed: { width: '80px' },
  expanded: { width: '250px' },
};

const navLabelVariants = {
  collapsed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
  expanded: { opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.2 } },
}

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, activeView, setActiveView, toggleSidebar } = useTabStore();
  const { play: playClickSound } = useSound(clickSound);
  const { reduceMotion } = useSettingsStore();

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    playClickSound();
  }

  const handleToggle = () => {
    toggleSidebar();
    playClickSound();
  }
  
  const transition = reduceMotion
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.aside
      initial={false}
      animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={transition}
      className="flex-shrink-0 bg-surface flex flex-col justify-between border-r border-white/5 overflow-hidden"
    >
      <nav className="flex-grow p-3 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.view}>
              <motion.button
                onClick={() => handleNavClick(item.view)}
                aria-label={item.label}
                className={`w-full flex items-center p-3 my-1 rounded-xl transition-colors duration-200 relative ${
                  activeView === item.view
                    ? 'text-white'
                    : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeView === item.view && (
                   <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={transition}
                   />
                )}
                <item.icon className="w-6 h-6 flex-shrink-0 z-10" />
                <motion.span
                  variants={navLabelVariants}
                  className="ml-4 font-medium whitespace-nowrap z-10"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-white/5">
        <motion.button
          onClick={handleToggle}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center p-3 rounded-xl text-text-muted hover:bg-white/5 hover:text-text-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDoubleLeftIcon className="w-6 h-6" />
          </motion.div>
          <motion.span 
             variants={navLabelVariants}
             className="ml-4 font-medium whitespace-nowrap"
           >
            Collapse
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
};