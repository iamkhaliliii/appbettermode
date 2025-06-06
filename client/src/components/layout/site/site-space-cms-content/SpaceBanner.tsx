import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceBannerProps {
  show: boolean;
  bannerUrl?: string;
  spaceName: string;
}

export function SpaceBanner({ show, bannerUrl, spaceName }: SpaceBannerProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className="overflow-hidden mb-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className="relative w-full h-32 md:h-40 lg:h-48 mb-6 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700"
      >
        {/* Background Image */}
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt={`${spaceName} banner`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Default gradient background with pattern */
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.3,
                delay: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg"
            >
              {spaceName}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.3,
                delay: 0.4,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="text-lg md:text-xl opacity-90 drop-shadow-md"
            >
              Welcome to our community space
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ 
            duration: 0.5,
            delay: 0.3,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="absolute bottom-6 left-6 w-12 h-12 bg-white bg-opacity-15 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
} 