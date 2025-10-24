import React from 'react';
import { ExtensionsIcon } from '../IconComponents';
import { motion } from 'framer-motion';

const mockExtensions = [
  { name: 'React Developer Tools', enabled: true },
  { name: 'uBlock Origin', enabled: true },
  { name: 'Dark Reader', enabled: false },
  { name: 'Grammarly', enabled: true },
];

export const ExtensionsPanel: React.FC = () => {
  return (
    <div className="p-4 h-full">
      <h1 className="text-4xl font-bold text-text-primary mb-6 flex items-center">
        <ExtensionsIcon className="w-8 h-8 mr-4 text-primary" />
        Extensions
      </h1>
      <ul className="space-y-4">
        {mockExtensions.map((item, index) => (
          <li key={index} className="bg-glass p-4 rounded-xl border border-white/10 backdrop-blur-md flex justify-between items-center">
            <h2 className="text-lg font-medium text-text-primary">{item.name}</h2>
             <div
                className={`flex items-center w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                  item.enabled ? 'bg-primary justify-end' : 'bg-surface justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                  className="w-5 h-5 bg-white rounded-full m-0.5"
                />
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
};