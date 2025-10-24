import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

interface SettingsRadioProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export const SettingsRadio: React.FC<SettingsRadioProps> = ({ options, selected, onChange }) => {
  const { reduceMotion } = useSettingsStore();
  const transition = reduceMotion 
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 400, damping: 30 };
    
  return (
    <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-white/10">
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="relative flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium focus:outline-none transition-colors"
          aria-pressed={selected === option}
        >
          {selected === option && (
            <motion.div
              layoutId="radio-highlighter"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={transition}
            />
          )}
          <span className="relative z-10">{option}</span>
        </button>
      ))}
    </div>
  );
};