import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Tablet, Grid3x3, Sparkles } from "lucide-react";

interface WidgetModeWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
  isDragging?: boolean;
}

export function WidgetModeWrapper({ isActive, children, isDragging = false }: WidgetModeWrapperProps) {
  const [showIntro, setShowIntro] = useState(false);

  // Show intro animation when entering widget mode
  useEffect(() => {
    if (isActive) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className={`relative w-full h-full transition-all duration-500 ${
      isActive ? 'bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10' : ''
    }`}>
      
      {/* Widget Mode Background Grid */}
      {isActive && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Widget Mode Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Grid3x3 className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Widget Mode Activated
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Drag widgets to arrange your layout
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with Widget Mode Styling */}
      <div 
        className={`transition-all duration-500 ${
          isActive ? 'widget-mode-active' : ''
        }`}
        style={{
          filter: isActive ? 'none' : 'none'
        }}
      >
        {children}
      </div>

      {/* Widget Mode Status Bar */}
      {isActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isDragging ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse'
              }`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging ? 'Moving Widget...' : 'Widget Mode'}
              </span>
            </div>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Sparkles className="w-3 h-3" />
              <span>{isDragging ? 'Drag & Drop Active' : 'Linear Layout'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Monitor className="w-4 h-4 text-blue-500" />
              <Tablet className="w-4 h-4 text-gray-400" />
              <Smartphone className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Widget Mode Global Styles */}
      {isActive && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .widget-mode-active * {
              transition: all 0.3s ease !important;
            }
            
            .widget-mode-active [data-widget-element="true"] {
              border: 2px dashed rgba(59, 130, 246, 0.3) !important;
              border-radius: 8px !important;
              position: relative !important;
              backdrop-filter: blur(1px) !important;
            }
            
            .widget-mode-active [data-widget-element="true"]:hover {
              border-color: rgba(59, 130, 246, 0.6) !important;
              background-color: rgba(59, 130, 246, 0.05) !important;
              transform: scale(1.02) !important;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
            }
            
            .widget-mode-active [data-widget-element="true"]::before {
              content: "";
              position: absolute !important;
              top: -2px !important;
              left: -2px !important;
              right: -2px !important;
              bottom: -2px !important;
              background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent) !important;
              border-radius: 8px !important;
              pointer-events: none !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease !important;
            }
            
            .widget-mode-active [data-widget-element="true"]:hover::before {
              opacity: 1 !important;
            }
            
            .widget-mode-active [data-widget-type]::after {
              content: attr(data-widget-type) !important;
              position: absolute !important;
              top: 4px !important;
              right: 4px !important;
              background: rgba(59, 130, 246, 0.9) !important;
              color: white !important;
              font-size: 10px !important;
              padding: 2px 6px !important;
              border-radius: 4px !important;
              font-weight: 500 !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease !important;
              pointer-events: none !important;
              z-index: 10 !important;
            }
            
            .widget-mode-active [data-widget-type]:hover::after {
              opacity: 1 !important;
            }
          `
        }} />
      )}
    </div>
  );
} 