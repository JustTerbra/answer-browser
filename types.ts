

export interface Source {
  uri: string;
  title: string;
}

export interface GeminiAnswer {
  text: string;
  sources: Source[];
  relatedSearches: string[];
}

// FIX: Make uri and title optional to match the types from @google/genai package
// Type for grounding chunks from Gemini API
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

export interface MockSearchResult {
    id: number;
    title: string;
    url: string;
    snippet: string;
}

export interface Tab {
  id: string;
  title:string;
  geminiAnswer: GeminiAnswer | null;
  isSearching: boolean;
  searchError: string | null;
  navigationUrl: string | null;
  inputValue: string; // The text in the Omnibox for this tab
  searchQuery: string | null; // The query that generated the current search results
}

export type ActiveView = 'TABS' | 'BOOKMARKS' | 'HISTORY' | 'DOWNLOADS' | 'EXTENSIONS';

// --- Settings Types ---
export type SearchEngine = 'Google' | 'DuckDuckGo' | 'Bing';
export type FontSize = 'small' | 'medium' | 'large';

export interface SettingsState {
  searchEngine: SearchEngine;
  blockTrackers: boolean;
  clearHistoryOnExit: boolean;
  fontSize: FontSize;
  highContrast: boolean;
  enableSoundCues: boolean;
  reduceMotion: boolean;
  setSearchEngine: (engine: SearchEngine) => void;
  setBlockTrackers: (value: boolean) => void;
  setClearHistoryOnExit: (value: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (value: boolean) => void;
  setEnableSoundCues: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
}


// --- Data Types ---
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: number; // timestamp
}

export interface HistoryItem {
  id: string;
  url:string;
  title: string;
  timestamp: number;
}

export interface DownloadItem {
  id: string;
  fileName: string;
  url: string;
  size: string; // e.g., "2.4 MB"
  progress: number; // 0-100
  status: 'in-progress' | 'completed' | 'failed' | 'cancelled';
  createdAt: number;
}

// --- Store State Types ---
export interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'tags'> & { tags?: string[] }) => void;
  removeBookmark: (id: string) => void;
  updateBookmarkTags: (id: string, tags: string[]) => void;
}

export interface HistoryState {
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

export interface DownloadState {
  downloads: DownloadItem[];
  addDownload: (download: Omit<DownloadItem, 'id' | 'progress' | 'status' | 'createdAt'>) => void;
  updateDownload: (id: string, updates: Partial<Pick<DownloadItem, 'progress' | 'status'>>) => void;
  removeDownload: (id: string) => void;
  clearDownloads: () => void;
}