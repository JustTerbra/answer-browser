import React from 'react';
import { motion } from 'framer-motion';
import { useTabStore } from '../../store/tabStore';
import { useSettingsStore } from '../../store/settingsStore';
import { CloseIcon, SearchIcon, EyeOffIcon, ContrastIcon, VolumeUpIcon, ReduceMotionIcon } from '../IconComponents';
import { SettingsToggle } from '../ui/SettingsToggle';
import { SettingsRadio } from '../ui/SettingsRadio';
import { SettingsSegmentedControl } from '../ui/SettingsSegmentedControl';
import type { SearchEngine, FontSize } from '../../types';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const SettingsPanel: React.FC = () => {
  const { closeSettingsModal } = useTabStore();
  const {
    searchEngine, setSearchEngine,
    blockTrackers, setBlockTrackers,
    clearHistoryOnExit, setClearHistoryOnExit,
    fontSize, setFontSize,
    highContrast, setHighContrast,
    enableSoundCues, setEnableSoundCues,
    reduceMotion, setReduceMotion,
  } = useSettingsStore();

  const searchEngines: SearchEngine[] = ['Google', 'DuckDuckGo', 'Bing'];
  const fontSizes: FontSize[] = ['small', 'medium', 'large'];

  const motionTransition = reduceMotion 
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 400, damping: 30 };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={closeSettingsModal}
    >
      <motion.div
        variants={modalVariants}
        transition={motionTransition}
        className="bg-glass w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Settings</h1>
          <motion.button
            onClick={closeSettingsModal}
            aria-label="Close settings"
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CloseIcon className="w-6 h-6" />
          </motion.button>
        </header>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <section>
            <h2 className="text-lg font-semibold flex items-center mb-4"><SearchIcon className="w-5 h-5 mr-3 text-primary"/>Search Engine</h2>
            <SettingsRadio
              options={searchEngines}
              selected={searchEngine}
              onChange={(val) => setSearchEngine(val as SearchEngine)}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold flex items-center mb-4"><EyeOffIcon className="w-5 h-5 mr-3 text-primary"/>Privacy</h2>
            <div className="space-y-4">
              <SettingsToggle
                label="Block Trackers"
                description="Prevent known trackers from following you across the web."
                enabled={blockTrackers}
                onChange={setBlockTrackers}
              />
              <SettingsToggle
                label="Clear History on Exit"
                description="Automatically delete your browsing history when you close the browser."
                enabled={clearHistoryOnExit}
                onChange={setClearHistoryOnExit}
              />
            </div>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold flex items-center mb-4"><ContrastIcon className="w-5 h-5 mr-3 text-primary"/>Appearance</h2>
            <div className="space-y-6">
               <div>
                  <h3 className="text-text-primary mb-2">Font Size</h3>
                   <SettingsSegmentedControl
                      options={fontSizes}
                      selected={fontSize}
                      onChange={(val) => setFontSize(val as FontSize)}
                   />
               </div>
               <SettingsToggle
                label="High Contrast Mode"
                description="Increase contrast for better readability."
                enabled={highContrast}
                onChange={setHighContrast}
              />
            </div>
          </section>
          
           <section>
            <h2 className="text-lg font-semibold flex items-center mb-4"><ReduceMotionIcon className="w-5 h-5 mr-3 text-primary"/>Accessibility</h2>
             <SettingsToggle
                label="Reduce Motion"
                description="Simplify animations for a calmer experience."
                enabled={reduceMotion}
                onChange={setReduceMotion}
              />
          </section>

          <section>
            <h2 className="text-lg font-semibold flex items-center mb-4"><VolumeUpIcon className="w-5 h-5 mr-3 text-primary"/>Audio</h2>
             <SettingsToggle
                label="Enable Sound Cues"
                description="Play subtle sounds for actions like opening tabs."
                enabled={enableSoundCues}
                onChange={setEnableSoundCues}
              />
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};