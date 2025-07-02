import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Info } from 'lucide-react';

interface GeneralWidgetPopoverProps {
  children: React.ReactNode;
  widgetName: string;
  isSelected?: boolean;
  position?: 'top' | 'bottom';
}

export function GeneralWidgetPopover({ children, widgetName, isSelected = false, position = 'top' }: GeneralWidgetPopoverProps) {
  const handleUpgradeClick = () => {
    console.log('Upgrade plan clicked');
  };

  const positionClasses = position === 'bottom' 
    ? "absolute -bottom-12 left-0 right-0 z-[99999]" 
    : "absolute -top-12 left-0 right-0 z-[99999]";

  const animationProps = position === 'bottom'
    ? {
        initial: { opacity: 0, y: 10, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.9 }
      }
    : {
        initial: { opacity: 0, y: -10, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.9 }
      };

  return (
    <div className="relative">
      {/* Original Content */}
      {children}
      
      {/* Banner */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            {...animationProps}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`${positionClasses} p-2 bg-purple-600 text-white rounded-md shadow-lg border border-purple-500`}
          >
            {/* Minimal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white">
                  {widgetName} • General Widget
                </span>
              </div>
              
              {/* Minimal CTA */}
              <button
                onClick={handleUpgradeClick}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2 py-1 rounded transition-colors"
              >
                <Crown className="w-3 h-3" />
                Upgrade
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 