import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3 } from "lucide-react";

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
      const timer = setTimeout(() => setShowIntro(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className={`relative w-full h-full transition-all duration-300 ${
      isActive ? 'bg-gray-50/80 dark:bg-gray-900/50' : ''
    }`}>
      
      {/* Simple Grid Pattern */}
      {isActive && (
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(156, 163, 175, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(156, 163, 175, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Simple Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-lg flex items-center justify-center"
              >
                <Grid3x3 className="w-6 h-6 text-white" />
              </motion.div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Widget Mode
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={`transition-all duration-300 ${isActive ? 'widget-mode-active' : ''}`}>
        {children}
      </div>

      {/* Simple Status Indicator */}
      {isActive && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              isDragging ? 'bg-orange-500' : 'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragging ? 'Moving' : 'Widget Mode'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Widget Mode Styles with Blur Overlays */}
      {isActive && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .widget-mode-active * {
              transition: all 0.2s ease !important;
            }
            
            /* Blur non-editable sections */
            .widget-mode-active [data-sidebar="true"],
            .widget-mode-active [data-header="true"],
            .widget-mode-active [data-navigation="true"],
            .widget-mode-active [data-footer="true"],
            .widget-mode-active [data-space-header="true"],
            .widget-mode-active [data-space-footer="true"],
            .widget-mode-active nav:not([data-widget-element]),
            .widget-mode-active header:not([data-widget-element]),
            .widget-mode-active footer:not([data-widget-element]),
            .widget-mode-active aside:not([data-widget-element]),
            .widget-mode-active .sidebar,
            .widget-mode-active .header,
            .widget-mode-active .footer,
            .widget-mode-active .space-header,
            .widget-mode-active .space-footer,
            .widget-mode-active .site-header,
            .widget-mode-active .site-footer,
            .widget-mode-active .navigation,
            .widget-mode-active .main-sidebar,
            .widget-mode-active .secondary-sidebar,
            .widget-mode-active .breadcrumb,
            .widget-mode-active .page-header,
            .widget-mode-active .content-header,
            .widget-mode-active .nav-item,
            .widget-mode-active .nav-link,
            .widget-mode-active .menu-item,
            .widget-mode-active .tab-item,
            .widget-mode-active .tabs,
            .widget-mode-active .tab-list,
            .widget-mode-active .navigation-item,
            .widget-mode-active .navigation-menu,
            .widget-mode-active .space-nav,
            .widget-mode-active .site-nav,
            .widget-mode-active [role="navigation"]:not([data-widget-element]),
            .widget-mode-active [role="menubar"]:not([data-widget-element]),
            .widget-mode-active [role="tablist"]:not([data-widget-element]) {
              filter: blur(2px) !important;
              opacity: 0.6 !important;
              pointer-events: none !important;
              position: relative !important;
            }
            
            /* Blur navigation specific elements */
            .widget-mode-active nav button:not([data-widget-element]),
            .widget-mode-active nav a:not([data-widget-element]),
            .widget-mode-active nav span:not([data-widget-element]),
            .widget-mode-active nav div:not([data-widget-element]),
            .widget-mode-active .navigation button:not([data-widget-element]),
            .widget-mode-active .navigation a:not([data-widget-element]),
            .widget-mode-active .navigation span:not([data-widget-element]),
            .widget-mode-active .navigation div:not([data-widget-element]),
            .widget-mode-active header button:not([data-widget-element]),
            .widget-mode-active header a:not([data-widget-element]),
            .widget-mode-active header span:not([data-widget-element]),
            .widget-mode-active header div:not([data-widget-element]) {
              filter: blur(2px) !important;
              opacity: 0.6 !important;
              pointer-events: none !important;
              position: relative !important;
            }
            
            /* Blur overlay for non-editable sections */
            .widget-mode-active [data-sidebar="true"]::before,
            .widget-mode-active [data-header="true"]::before,
            .widget-mode-active [data-navigation="true"]::before,
            .widget-mode-active [data-footer="true"]::before,
            .widget-mode-active [data-space-header="true"]::before,
            .widget-mode-active [data-space-footer="true"]::before,
            .widget-mode-active nav:not([data-widget-element])::before,
            .widget-mode-active header:not([data-widget-element])::before,
            .widget-mode-active footer:not([data-widget-element])::before,
            .widget-mode-active aside:not([data-widget-element])::before,
            .widget-mode-active .sidebar::before,
            .widget-mode-active .header::before,
            .widget-mode-active .footer::before,
            .widget-mode-active .space-header::before,
            .widget-mode-active .space-footer::before,
            .widget-mode-active .site-header::before,
            .widget-mode-active .site-footer::before,
            .widget-mode-active .navigation::before,
            .widget-mode-active .main-sidebar::before,
            .widget-mode-active .secondary-sidebar::before,
            .widget-mode-active .breadcrumb::before,
            .widget-mode-active .page-header::before,
            .widget-mode-active .content-header::before,
            .widget-mode-active .nav-item::before,
            .widget-mode-active .nav-link::before,
            .widget-mode-active .menu-item::before,
            .widget-mode-active .tab-item::before,
            .widget-mode-active .tabs::before,
            .widget-mode-active .tab-list::before,
            .widget-mode-active .navigation-item::before,
            .widget-mode-active .navigation-menu::before,
            .widget-mode-active .space-nav::before,
            .widget-mode-active .site-nav::before,
            .widget-mode-active [role="navigation"]:not([data-widget-element])::before,
            .widget-mode-active [role="menubar"]:not([data-widget-element])::before,
            .widget-mode-active [role="tablist"]:not([data-widget-element])::before,
            .widget-mode-active nav button:not([data-widget-element])::before,
            .widget-mode-active nav a:not([data-widget-element])::before,
            .widget-mode-active .navigation button:not([data-widget-element])::before,
            .widget-mode-active .navigation a:not([data-widget-element])::before,
            .widget-mode-active header button:not([data-widget-element])::before,
            .widget-mode-active header a:not([data-widget-element])::before {
              content: "" !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: rgba(255, 255, 255, 0.3) !important;
              backdrop-filter: blur(1px) !important;
              z-index: 1 !important;
              border-radius: inherit !important;
              pointer-events: none !important;
            }
            
            .dark .widget-mode-active [data-sidebar="true"]::before,
            .dark .widget-mode-active [data-header="true"]::before,
            .dark .widget-mode-active [data-navigation="true"]::before,
            .dark .widget-mode-active [data-footer="true"]::before,
            .dark .widget-mode-active [data-space-header="true"]::before,
            .dark .widget-mode-active [data-space-footer="true"]::before,
            .dark .widget-mode-active nav:not([data-widget-element])::before,
            .dark .widget-mode-active header:not([data-widget-element])::before,
            .dark .widget-mode-active footer:not([data-widget-element])::before,
            .dark .widget-mode-active aside:not([data-widget-element])::before,
            .dark .widget-mode-active .sidebar::before,
            .dark .widget-mode-active .header::before,
            .dark .widget-mode-active .footer::before,
            .dark .widget-mode-active .space-header::before,
            .dark .widget-mode-active .space-footer::before,
            .dark .widget-mode-active .site-header::before,
            .dark .widget-mode-active .site-footer::before,
            .dark .widget-mode-active .navigation::before,
            .dark .widget-mode-active .main-sidebar::before,
            .dark .widget-mode-active .secondary-sidebar::before,
            .dark .widget-mode-active .breadcrumb::before,
            .dark .widget-mode-active .page-header::before,
            .dark .widget-mode-active .content-header::before,
            .dark .widget-mode-active .nav-item::before,
            .dark .widget-mode-active .nav-link::before,
            .dark .widget-mode-active .menu-item::before,
            .dark .widget-mode-active .tab-item::before,
            .dark .widget-mode-active .tabs::before,
            .dark .widget-mode-active .tab-list::before,
            .dark .widget-mode-active .navigation-item::before,
            .dark .widget-mode-active .navigation-menu::before,
            .dark .widget-mode-active .space-nav::before,
            .dark .widget-mode-active .site-nav::before,
            .dark .widget-mode-active [role="navigation"]:not([data-widget-element])::before,
            .dark .widget-mode-active [role="menubar"]:not([data-widget-element])::before,
            .dark .widget-mode-active [role="tablist"]:not([data-widget-element])::before,
            .dark .widget-mode-active nav button:not([data-widget-element])::before,
            .dark .widget-mode-active nav a:not([data-widget-element])::before,
            .dark .widget-mode-active .navigation button:not([data-widget-element])::before,
            .dark .widget-mode-active .navigation a:not([data-widget-element])::before,
            .dark .widget-mode-active header button:not([data-widget-element])::before,
            .dark .widget-mode-active header a:not([data-widget-element])::before {
              background: rgba(0, 0, 0, 0.3) !important;
            }
            
            /* Widget elements styling */
            .widget-mode-active [data-widget-element="true"] {
              border: 1px solid rgba(59, 130, 246, 0.3) !important;
              border-radius: 8px !important;
              position: relative !important;
              filter: none !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }
            
            .widget-mode-active [data-widget-element="true"]:hover {
              border-color: rgba(59, 130, 246, 0.5) !important;
              background-color: rgba(59, 130, 246, 0.05) !important;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important;
            }

            /* Base Sections - Purple Theme */
            .widget-mode-active .site-header,
            .widget-mode-active .site-sidebar, 
            .widget-mode-active .site-footer {
              border: 1px solid rgba(147, 51, 234, 0.3) !important;
              filter: none !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }

            .widget-mode-active .site-header:hover,
            .widget-mode-active .site-sidebar:hover,
            .widget-mode-active .site-footer:hover {
              border-color: rgba(147, 51, 234, 0.5) !important;
              background-color: rgba(147, 51, 234, 0.05) !important;
              box-shadow: 0 2px 8px rgba(147, 51, 234, 0.15) !important;
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
              transition: opacity 0.2s ease !important;
              pointer-events: none !important;
              z-index: 10 !important;
            }

            /* Base Sections Widget Type Labels - Purple */
            .widget-mode-active .site-header[data-widget-type]::after,
            .widget-mode-active .site-sidebar[data-widget-type]::after,
            .widget-mode-active .site-footer[data-widget-type]::after {
              background: rgba(147, 51, 234, 0.9) !important;
            }
            
            .widget-mode-active [data-widget-type]:hover::after {
              opacity: 1 !important;
            }
            
            /* Ensure editable content area is not blurred */
            .widget-mode-active [data-widget-content="true"],
            .widget-mode-active [data-drop-zone="true"],
            .widget-mode-active [data-widget-drop-zone="true"],
            .widget-mode-active .main-content,
            .widget-mode-active .content-area,
            .widget-mode-active .drop-zone,
            .widget-mode-active .widget-drop-zone,
            .widget-mode-active .drop-widgets-zone,
            .widget-mode-active .drag-widgets-zone,
            .widget-mode-active main[data-widget-element] {
              filter: none !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }
          `
        }} />
      )}
    </div>
  );
} 