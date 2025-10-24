
import { create } from 'zustand';
import type { Tab, ActiveView } from '../types';

// Helper to generate unique IDs without external libraries
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const createNewTab = (): Tab => ({
  id: generateId(),
  title: 'New Tab',
  geminiAnswer: null,
  isSearching: false,
  searchError: null,
  navigationUrl: null,
  inputValue: '',
  searchQuery: null,
});

interface TabState {
  tabs: Tab[];
  activeTabId: string;
  activeView: ActiveView;
  isSidebarCollapsed: boolean;
  isSettingsOpen: boolean;
  addTab: () => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  setTabs: (tabs: Tab[]) => void;
  updateActiveTabContent: (data: Partial<Omit<Tab, 'id'>>) => void;
  clearActiveTab: () => void;
  setActiveView: (view: ActiveView) => void;
  toggleSidebar: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

export const useTabStore = create<TabState>((set) => {
  const firstTab = createNewTab();
  return {
    tabs: [firstTab],
    activeTabId: firstTab.id,
    activeView: 'TABS',
    isSidebarCollapsed: false,
    isSettingsOpen: false,

    addTab: () => set(state => {
      const newTab = createNewTab();
      return {
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
        activeView: 'TABS',
      };
    }),

    removeTab: (tabIdToRemove) => set(state => {
      const { tabs, activeTabId } = state;
      const tabIndex = tabs.findIndex(tab => tab.id === tabIdToRemove);
      if (tabIndex === -1) return {};

      const newTabs = tabs.filter(tab => tab.id !== tabIdToRemove);

      if (newTabs.length === 0) {
        const newTab = createNewTab();
        return { tabs: [newTab], activeTabId: newTab.id, activeView: 'TABS' };
      }

      if (activeTabId === tabIdToRemove) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        return { tabs: newTabs, activeTabId: newTabs[newActiveIndex].id, activeView: 'TABS' };
      }

      return { tabs: newTabs };
    }),

    setActiveTab: (tabId) => set({ activeTabId: tabId, activeView: 'TABS' }),

    setTabs: (newTabs) => set({ tabs: newTabs }),

    updateActiveTabContent: (data) => set(state => {
      const newTabs = state.tabs.map(tab => {
        if (tab.id === state.activeTabId) {
          return {
            ...tab,
            ...data
          };
        }
        return tab;
      });
      return { tabs: newTabs, activeView: 'TABS' };
    }),

    clearActiveTab: () => set(state => {
      const newTabs = state.tabs.map(tab => {
        if (tab.id === state.activeTabId) {
          return {
            ...tab,
            title: 'New Tab',
            geminiAnswer: null,
            isSearching: false,
            searchError: null,
            navigationUrl: null,
            inputValue: '',
            searchQuery: null,
          };
        }
        return tab;
      });
      return { tabs: newTabs, activeView: 'TABS' };
    }),

    setActiveView: (view) => set(state => ({
      activeView: state.activeView === view ? 'TABS' : view,
    })),

    toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    openSettingsModal: () => set({ isSettingsOpen: true }),
    closeSettingsModal: () => set({ isSettingsOpen: false }),
  };
});