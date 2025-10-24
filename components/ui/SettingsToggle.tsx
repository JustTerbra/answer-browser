import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

interface SettingsToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, enabled, onChange }) => {
  const { reduceMotion } = useSettingsStore();
  const transition = reduceMotion 
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 700, damping: 30 };

  return (
    <div
      onClick={() => onChange(!enabled)}
      className="flex justify-between items-center p-4 rounded-xl bg-glass border border-white/10 cursor-pointer hover:bg-surface/50 transition-colors"
    >
      <div>
        <h3 className="font-medium text-text-primary">{label}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div
        className={`flex items-center w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-primary justify-end' : 'bg-surface justify-start'
        }`}
      >
        <motion.div
          layout
          transition={transition}
          className="w-5 h-5 bg-white rounded-full m-0.5"
        />
      </div>
    </div>
  );
};