import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Widget System Types
export interface Widget {
  id: string;
  type: string;
  name: string;
  component: React.ComponentType<any>;
  editable: boolean;
  draggable: boolean;
  category: 'site' | 'widget' | 'content';
}

export interface WidgetZone {
  id: string;
  name: string;
  widgets: Widget[];
  allowDrop: boolean;
}

interface WidgetSystemState {
  isActive: boolean;
  zones: WidgetZone[];
  activeWidget: string | null;
  isDragging: boolean;
}

interface WidgetSystemContextType {
  state: WidgetSystemState;
  activate: () => void;
  deactivate: () => void;
  setActiveWidget: (id: string | null) => void;
  setDragging: (dragging: boolean) => void;
  registerZone: (zone: WidgetZone) => void;
  updateZone: (zoneId: string, widgets: Widget[]) => void;
}

// Widget System Context
const WidgetSystemContext = createContext<WidgetSystemContextType | null>(null);

export const useWidgetSystem = () => {
  const context = useContext(WidgetSystemContext);
  if (!context) {
    throw new Error('useWidgetSystem must be used within WidgetSystemProvider');
  }
  return context;
};

// Widget System Provider
interface WidgetSystemProviderProps {
  children: ReactNode;
}

export function WidgetSystemProvider({ children }: WidgetSystemProviderProps) {
  const [state, setState] = useState<WidgetSystemState>({
    isActive: false,
    zones: [],
    activeWidget: null,
    isDragging: false
  });

  const activate = () => setState(prev => ({ ...prev, isActive: true }));
  const deactivate = () => setState(prev => ({ 
    ...prev, 
    isActive: false, 
    activeWidget: null, 
    isDragging: false 
  }));

  const setActiveWidget = (id: string | null) => {
    setState(prev => ({ ...prev, activeWidget: id }));
  };

  const setDragging = (dragging: boolean) => {
    setState(prev => ({ ...prev, isDragging: dragging }));
  };

  const registerZone = (zone: WidgetZone) => {
    setState(prev => ({
      ...prev,
      zones: [...prev.zones.filter(z => z.id !== zone.id), zone]
    }));
  };

  const updateZone = (zoneId: string, widgets: Widget[]) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.map(zone => 
        zone.id === zoneId ? { ...zone, widgets } : zone
      )
    }));
  };

  return (
    <WidgetSystemContext.Provider value={{
      state,
      activate,
      deactivate,
      setActiveWidget,
      setDragging,
      registerZone,
      updateZone
    }}>
      {children}
    </WidgetSystemContext.Provider>
  );
}

// Widget Zone Component
interface WidgetZoneProps {
  id: string;
  name: string;
  type: 'site' | 'widget' | 'content';
  children: ReactNode;
  className?: string;
}

export function WidgetZone({ id, name, type, children, className = '' }: WidgetZoneProps) {
  const { state, setActiveWidget } = useWidgetSystem();

  const handleClick = () => {
    if (state.isActive && type === 'widget') {
      setActiveWidget(id);
    }
  };

  const isActive = state.activeWidget === id;
  const isWidget = type === 'widget';
  const isSite = type === 'site';

  return (
    <div
      className={`widget-zone widget-zone-${type} ${className} ${
        state.isActive ? 'widget-mode-active' : ''
      } ${isActive ? 'widget-active' : ''}`}
      onClick={handleClick}
      data-zone-id={id}
      data-zone-type={type}
    >
      {/* Widget Mode Indicator */}
      {state.isActive && isWidget && (
        <div className="widget-indicator">
          <span className="widget-label">{name}</span>
        </div>
      )}
      
      {children}
    </div>
  );
}

// Widget Wrapper Component
interface WidgetWrapperProps {
  children: ReactNode;
  className?: string;
}

export function WidgetWrapper({ children, className = '' }: WidgetWrapperProps) {
  const { state } = useWidgetSystem();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (state.isActive) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.isActive]);

  return (
    <div className={`widget-wrapper ${state.isActive ? 'widget-mode' : ''} ${className}`}>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="widget-intro-overlay"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="widget-intro-content"
            >
              <div className="widget-intro-icon">🎨</div>
              <p>Widget Mode</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children}

      {/* Status Indicator */}
      {state.isActive && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="widget-status"
        >
          <div className={`status-dot ${state.isDragging ? 'dragging' : 'active'}`} />
          <span>{state.isDragging ? 'Moving Widget' : 'Widget Mode'}</span>
        </motion.div>
      )}

      {/* Simple, Clean CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .widget-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
        }

        .widget-mode {
          background: rgba(248, 250, 252, 0.5);
        }

        .widget-zone {
          position: relative;
          transition: all 0.2s ease;
        }

        /* Site Zones - Blurred when widget mode is active */
        .widget-mode .widget-zone-site {
          filter: blur(1px);
          opacity: 0.7;
          pointer-events: none;
        }

        .widget-mode .widget-zone-site::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.3);
          z-index: 1;
          pointer-events: none;
        }

        /* Widget Zones - Editable and highlighted */
        .widget-mode .widget-zone-widget {
          filter: none;
          opacity: 1;
          pointer-events: auto;
          border: 2px dashed transparent;
          border-radius: 8px;
          margin: 8px 0;
          position: relative;
          cursor: pointer;
        }

        .widget-mode .widget-zone-widget:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-1px);
        }

        .widget-zone-widget.widget-active {
          border-color: #10b981 !important;
          background: rgba(16, 185, 129, 0.05) !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        /* Content Zones - Normal, no special styling */
        .widget-mode .widget-zone-content {
          filter: none;
          opacity: 1;
          pointer-events: auto;
        }

        /* Widget Indicator */
        .widget-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .widget-zone-widget:hover .widget-indicator {
          opacity: 1;
        }

        .widget-active .widget-indicator {
          opacity: 1;
        }

        .widget-label {
          background: #3b82f6;
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .widget-active .widget-label {
          background: #10b981;
        }

        /* Intro Overlay */
        .widget-intro-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          pointer-events: none;
        }

        .widget-intro-content {
          text-align: center;
          color: #374151;
        }

        .widget-intro-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        /* Status Indicator */
        .widget-status {
          position: fixed;
          bottom: 16px;
          right: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 50;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
        }

        .status-dot.dragging {
          background: #f59e0b;
        }

        /* Dark Mode */
        .dark .widget-mode {
          background: rgba(17, 24, 39, 0.5);
        }

        .dark .widget-mode .widget-zone-site::before {
          background: rgba(0, 0, 0, 0.3);
        }

        .dark .widget-intro-overlay {
          background: rgba(17, 24, 39, 0.8);
        }

        .dark .widget-intro-content {
          color: #f3f4f6;
        }

                 .dark .widget-status {
           background: #1f2937;
           border-color: #374151;
           color: #f3f4f6;
         }
       ` }} />
    </div>
  );
}  