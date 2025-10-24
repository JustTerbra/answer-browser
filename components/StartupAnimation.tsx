
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface StartupAnimationProps {
  onAnimationComplete: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    // FIX: Add `as const` to `type` to ensure TypeScript infers the correct literal type for framer-motion.
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
  },
};

export const StartupAnimation: React.FC<StartupAnimationProps> = ({ onAnimationComplete }) => {
  const restOfWord = "nswer".split("");
  
  // Use useEffect to call onAnimationComplete after a fixed delay
  // onAnimationComplete prop on motion component is not always reliable
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500); // Total animation duration + buffer
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 bg-background flex justify-center items-center z-[100]"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-baseline justify-center font-extrabold text-[20vw] select-none"
      >
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.3 } }}
            className="text-primary"
        >
          A
        </motion.span>
        {restOfWord.map((letter, index) => (
          <motion.span key={index} variants={letterVariants} className="text-text-primary">
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};