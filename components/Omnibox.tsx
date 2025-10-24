

import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Add Transition to framer-motion import
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { SearchIcon } from './IconComponents';
import { autocompleteSuggestions } from '../data/mockData';
import { useSettingsStore } from '../store/settingsStore';
import { useUndoRedo } from '../hooks/useUndoRedo';

interface OmniboxProps {
  onSearch: (query: string) => void;
  onNavigate: (url: string) => void;
  initialValue: string;
}

export const Omnibox: React.FC<OmniboxProps> = ({ onSearch, onNavigate, initialValue }) => {
  const { state: historyValue, set: setHistory, reset: resetHistory, undo, redo, canUndo, canRedo } = useUndoRedo(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { searchEngine, reduceMotion } = useSettingsStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [actionFeedback, setActionFeedback] = useState<'undo' | 'redo' | null>(null);

  // Sync prop changes (e.g., new tab) to the history state
  useEffect(() => {
    resetHistory(initialValue);
    setInputValue(initialValue);
  }, [initialValue, resetHistory]);

  // Sync history state changes (from undo/redo) to the visible input value
  useEffect(() => {
    setInputValue(historyValue);
  }, [historyValue]);

  // Debounce updates from the input to the history state
  useEffect(() => {
    if (inputValue !== historyValue) {
      const handler = setTimeout(() => {
        setHistory(inputValue);
      }, 500); // Debounce history updates by 500ms
      return () => clearTimeout(handler);
    }
  }, [inputValue, historyValue, setHistory]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'l') {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = autocompleteSuggestions.filter(s =>
        s.toLowerCase().startsWith(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent, value: string = inputValue) => {
    e.preventDefault();
    const finalValue = value.trim();
    if (!finalValue) return;

    // Immediately commit final value to history on submit
    setHistory(finalValue);

    // Detect if it's a URL or a search query
    const isUrl = finalValue.includes('.') && !finalValue.includes(' ');
    if (isUrl) {
      onNavigate(finalValue);
    } else {
      onSearch(finalValue);
    }
    
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: string) => {
     handleSubmit(new Event('submit') as unknown as React.FormEvent, suggestion);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isModKey = e.metaKey || e.ctrlKey;
    
    if (isModKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) { // Redo (Cmd/Ctrl + Shift + Z)
        if (canRedo) {
          redo();
          setActionFeedback('redo');
        }
      } else { // Undo (Cmd/Ctrl + Z)
        if (canUndo) {
          undo();
          setActionFeedback('undo');
        }
      }
    } else if (isModKey && e.key.toLowerCase() === 'y') {
      e.preventDefault(); // Redo (Cmd/Ctrl + Y)
      if (canRedo) {
        redo();
        setActionFeedback('redo');
      }
    }
  };

  // Effect to clear the visual feedback pulse
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 300);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  const transition = reduceMotion
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 500, damping: 30 };
    
  // FIX: Explicitly type `listTransition` to resolve TypeScript error with framer-motion's `ease` property.
  const listTransition: Transition = reduceMotion
    ? { duration: 0.1 }
    : { duration: 0.2, ease: [0.2, 0.9, 0.2, 1] };

  return (
    <div className="relative w-full" ref={containerRef}>
       <motion.div
        className="absolute -inset-0.5 rounded-2xl bg-primary"
        animate={{
          opacity: isFocused ? 0.3 : 0,
          boxShadow: actionFeedback ? '0 0 15px 5px rgba(225, 6, 0, 0.4)' : '0 0 0px 0px rgba(225, 6, 0, 0)',
        }}
        transition={transition}
        style={{ pointerEvents: 'none' }}
      />
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted pointer-events-none">
            <SearchIcon className="w-5 h-5"/>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            // Immediately commit state on blur
            if (inputValue !== historyValue) {
              setHistory(inputValue);
            }
          }}
          placeholder={`Search with ${searchEngine} or type a URL`}
          className="relative w-full pl-12 pr-4 py-3 bg-glass backdrop-blur-md rounded-xl text-text-primary placeholder-text-muted focus:outline-none shadow-inner border border-white/10"
        />
      </form>
      <AnimatePresence>
        {isFocused && (inputValue || suggestions.length > 0) && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={listTransition}
            className="absolute top-full mt-2 w-full bg-glass backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/10 z-30"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2.5 text-text-primary hover:bg-primary cursor-pointer text-sm"
              >
                {suggestion}
              </li>
            ))}
             {suggestions.length === 0 && inputValue && !inputValue.includes('.') && (
                <li className="px-4 py-2.5 text-text-muted text-sm italic">
                  Press Enter to search for "{inputValue}"
                </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};