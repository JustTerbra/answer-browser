

import React, { useCallback, useState, Suspense } from 'react';
// FIX: Add Transition to framer-motion import
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { Omnibox } from './components/Omnibox';
import { SettingsIcon, ExtensionsIcon, ProfileIcon, StarIcon } from './components/IconComponents';
import { TabsBar } from './components/TabsBar';
import { useTabStore } from './store/tabStore';
import { useSettingsStore } from './store/settingsStore';
import { useBookmarkStore } from './store/bookmarkStore';
import { useHistoryStore } from './store/historyStore';
import { getAnswerFromGemini } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { SearchResultsPanel } from './components/panels/SearchResultsPanel';
import { StartupAnimation } from './components/StartupAnimation';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy-load panels for better initial performance
const BookmarksPanel = React.lazy(() => import('./components/panels/BookmarksPanel').then(module => ({ default: module.BookmarksPanel })));
const HistoryPanel = React.lazy(() => import('./components/panels/HistoryPanel').then(module => ({ default: module.HistoryPanel })));
const DownloadsPanel = React.lazy(() => import('./components/panels/DownloadsPanel').then(module => ({ default: module.DownloadsPanel })));
const ExtensionsPanel = React.lazy(() => import('./components/panels/ExtensionsPanel').then(module => ({ default: module.ExtensionsPanel })));
const SettingsPanel = React.lazy(() => import('./components/panels/SettingsPanel').then(module => ({ default: module.SettingsPanel })));


const App: React.FC = () => {
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);
  const { tabs, activeTabId, updateActiveTabContent, clearActiveTab, activeView, isSettingsOpen, openSettingsModal } = useTabStore();
  const { fontSize, highContrast, reduceMotion } = useSettingsStore();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const { addHistoryItem } = useHistoryStore();
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const isCurrentPageBookmarked = activeTab?.navigationUrl 
    ? bookmarks.some(b => b.url === activeTab.navigationUrl) 
    : false;

  const handleToggleBookmark = () => {
    if (!activeTab || !activeTab.navigationUrl || activeTab.navigationUrl.trim() === '') return;

    if (isCurrentPageBookmarked) {
      const bookmarkToRemove = bookmarks.find(b => b.url === activeTab.navigationUrl);
      if (bookmarkToRemove) removeBookmark(bookmarkToRemove.id);
    } else {
      addBookmark({
        url: activeTab.navigationUrl,
        title: activeTab.title,
      });
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    updateActiveTabContent({
      isSearching: true,
      searchError: null,
      geminiAnswer: null,
      navigationUrl: null,
      inputValue: query,
      title: `Searching: ${query}`,
      searchQuery: query,
    });

    try {
      const result = await getAnswerFromGemini(query);
      updateActiveTabContent({
        geminiAnswer: result,
        isSearching: false,
        title: `Answer: ${query}`,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      updateActiveTabContent({
        searchError: errorMessage,
        isSearching: false,
        title: `Error: ${query}`,
      });
    }
  }, [updateActiveTabContent]);

  const handleNavigate = useCallback((url: string) => {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    let hostname = 'Invalid URL';
    try {
        hostname = new URL(fullUrl).hostname;
        addHistoryItem({
          url: fullUrl,
          title: hostname,
        });
    } catch (e) {
        console.error("Invalid URL provided for navigation:", fullUrl);
    }
    updateActiveTabContent({
      geminiAnswer: null,
      searchError: null,
      isSearching: false,
      navigationUrl: fullUrl,
      inputValue: url,
      title: hostname,
      searchQuery: null,
    });
  }, [updateActiveTabContent, addHistoryItem]);
  
  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      case 'medium':
      default:
        return 'text-base';
    }
  }

  const renderActiveView = () => {
    switch(activeView) {
      case 'BOOKMARKS':
        return <BookmarksPanel />;
      case 'HISTORY':
        return <HistoryPanel />;
      case 'DOWNLOADS':
        return <DownloadsPanel />;
      case 'EXTENSIONS':
        return <ExtensionsPanel />;
      case 'TABS':
      default:
        if (activeTab?.isSearching) {
          return <LoadingSpinner />;
        }

        if (activeTab?.searchError) {
          return (
            <div className="text-center mt-20 p-8 bg-glass rounded-2xl border border-red-500/30 backdrop-blur-md">
              <h2 className="text-xl text-red-400 font-semibold mb-2">Search Failed</h2>
              <p className="text-text-muted">{activeTab.searchError}</p>
            </div>
          );
        }

        if (activeTab?.searchQuery && activeTab.geminiAnswer) {
          return <SearchResultsPanel query={activeTab.searchQuery} answer={activeTab.geminiAnswer} onNewSearch={handleSearch} />;
        }
        
        if (activeTab?.navigationUrl) {
            return (
                <div className="text-center mt-20">
                    <p className="text-lg text-text-muted">Navigating to...</p>
                    <a href={activeTab.navigationUrl} target="_blank" rel="noopener noreferrer" className="text-2xl text-primary hover:underline break-all">{activeTab.navigationUrl}</a>
                </div>
            );
        }

        return (
          <div className="text-center h-full flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-primary rounded-3xl mb-6"></div>
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-2">Answer</h1>
            <p className="text-text-muted text-lg">Your intelligent search companion.</p>
          </div>
        );
    }
  }

  if (showStartupAnimation) {
    return <StartupAnimation onAnimationComplete={() => setShowStartupAnimation(false)} />;
  }
  
  // FIX: Explicitly type `motionTransition` to resolve TypeScript error with framer-motion's `ease` property.
  const motionTransition: Transition = reduceMotion 
    ? { duration: 0.1, ease: 'linear' }
    : { duration: 0.4, ease: [0.2, 0.9, 0.2, 1] };

  return (
    <div className={`h-screen bg-background text-text-primary font-sans flex overflow-hidden ${getFontSizeClass()} ${highContrast ? 'high-contrast' : ''} animate-fade-in`}>
      <Sidebar />
      <div className="flex flex-col flex-grow min-w-0">
        <header className="flex-shrink-0 h-[80px] px-6 flex items-center justify-between border-b border-white/5 shadow-md z-20 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearActiveTab} className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary-glow rounded-lg p-1">
              <div className="w-6 h-6 bg-primary rounded-lg"></div>
              <h1 className="text-xl font-bold tracking-wider">Answer</h1>
            </motion.button>
          </div>

          <div className="flex-grow flex items-center justify-center max-w-3xl mx-4">
             <Omnibox 
              key={activeTab?.id}
              initialValue={activeTab?.inputValue || ''}
              onSearch={handleSearch} 
              onNavigate={handleNavigate} 
            />
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleBookmark}
              disabled={!activeTab?.navigationUrl}
              aria-label={isCurrentPageBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
              className="p-2 ml-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-glow"
            >
              <StarIcon className={`w-6 h-6 transition-colors ${isCurrentPageBookmarked ? 'text-yellow-400' : 'text-text-muted'}`} fill={isCurrentPageBookmarked ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          <div className="flex items-center space-x-1">
            <motion.button whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }} whileTap={{ scale: 0.9 }} onClick={openSettingsModal} aria-label="Settings" className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-glow">
              <SettingsIcon className="w-6 h-6 text-text-muted" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }} whileTap={{ scale: 0.9 }} aria-label="Extensions" className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-glow">
              <ExtensionsIcon className="w-6 h-6 text-text-muted" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }} whileTap={{ scale: 0.9 }} aria-label="Profile" className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-glow">
              <ProfileIcon className="w-6 h-6 text-text-muted" />
            </motion.button>
          </div>
        </header>
        
        <TabsBar />

        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto bg-surface-light/20">
          <div className="w-full max-w-4xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeView}-${activeTab?.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={motionTransition}
                className="h-full"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  {renderActiveView()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {isSettingsOpen && (
          <Suspense fallback={null}>
            <SettingsPanel />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;