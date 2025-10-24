import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

interface SettingsSegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export const SettingsSegmentedControl: React.FC<SettingsSegmentedControlProps> = ({ options, selected, onChange }) => {
  const { reduceMotion } = useSettingsStore();
  const transition = reduceMotion 
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 400, damping: 30 };

  return (
    <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-white/10 w-min">
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="relative w-24 py-1.5 px-4 rounded-lg text-center text-sm font-medium focus:outline-none transition-colors capitalize"
          aria-pressed={selected === option}
        >
          {selected === option && (
            <motion.div
              layoutId="segment-highlighter"
              className="absolute inset-0 bg-surface-light rounded-lg"
              transition={transition}
            />
          )}
          <span className="relative z-10">{option}</span>
        </button>
      ))}
    </div>
  );
};