import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Initializing AI Carbon Network...');

  useEffect(() => {
    // Increment progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Dynamic loading text updates
        if (prev === 25) setText('Establishing secure grid synchronization...');
        if (prev === 55) setText('Scanning active trust vectors...');
        if (prev === 80) setText('Calibrating AI scanning models...');
        
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bgSpace text-textPrimary">
      {/* Sci-fi glow effects in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accentGreen/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accentCyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10 max-w-sm w-full px-6">
        {/* Glowing Logo */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-24 h-24 flex items-center justify-center rounded-2xl glass-panel border border-accentGreen/30 shadow-neon-green"
          >
            {/* SVG Logo Mark representing leaves + digital grids */}
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16 text-accentGreen"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Outer hexagonal shell */}
              <motion.polygon
                points="50,5 90,28 90,72 50,95 10,72 10,28"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                strokeWidth="1.5"
                stroke="rgba(0, 255, 136, 0.4)"
              />
              {/* Core digital leaf */}
              <motion.path
                d="M50,85 C25,65 25,35 50,15 C75,35 75,65 50,85 Z"
                initial={{ pathLength: 0, fill: 'rgba(0, 255, 136, 0)' }}
                animate={{ pathLength: 1, fill: 'rgba(0, 255, 136, 0.1)' }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              />
              {/* Grid nodes overlay */}
              <motion.line
                x1="50" y1="15" x2="50" y2="85"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
                strokeWidth="1"
                stroke="rgba(0, 212, 255, 0.5)"
              />
              <motion.circle cx="50" cy="15" r="3" fill="#00D4FF" />
              <motion.circle cx="50" cy="50" r="4" fill="#00FF88" className="animate-pulse" />
              <motion.circle cx="50" cy="85" r="3" fill="#00D4FF" />
            </svg>
          </motion.div>
          {/* Outer rotating pulse ring */}
          <div className="absolute -inset-4 border border-accentCyan/10 rounded-full animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider font-heading text-gradient-green-cyan uppercase">
            ACCN
          </h1>
          <p className="text-[10px] text-textMuted tracking-[0.2em] font-mono mt-0.5">
            AI CARBON CREDIT NETWORK
          </p>
        </div>

        {/* Progress Info */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="flex justify-between text-[10px] font-mono text-textSecondary">
            <span className="text-left select-none max-w-[250px] truncate">{text}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-cardBorder rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accentGreen shadow-neon-green"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Futuristic bottom coordinates info */}
      <div className="absolute bottom-6 flex gap-6 text-[8px] font-mono text-textMuted select-none">
        <span>LAT: 17.3850° N</span>
        <span>LNG: 78.4867° E</span>
        <span>SYS: v1.0.2</span>
        <span>GRID: ACTIVE</span>
      </div>
    </div>
  );
};
