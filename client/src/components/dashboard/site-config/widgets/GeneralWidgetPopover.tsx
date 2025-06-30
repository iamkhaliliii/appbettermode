import React, { useState, useRef, useEffect } from 'react';
import { Crown, Info } from 'lucide-react';

interface GeneralWidgetPopoverProps {
  children: React.ReactNode;
  widgetName: string;
}

export function GeneralWidgetPopover({ children, widgetName }: GeneralWidgetPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

      // Adjust if popover would go off screen horizontally
      if (left < 8) {
        left = 8;
      } else if (left + popoverRect.width > viewportWidth - 8) {
        left = viewportWidth - popoverRect.width - 8;
      }

      // Adjust if popover would go off screen vertically
      if (top + popoverRect.height > viewportHeight - 8) {
        top = triggerRect.top - popoverRect.height - 8;
      }

      setPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleUpgradeClick = () => {
    // Handle upgrade plan action
    console.log('Upgrade plan clicked');
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {children}
      </div>

      {isVisible && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[9998]" />
          
          {/* Popover */}
          <div
            ref={popoverRef}
            className="fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="general-widget-popover bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-5 max-w-sm">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {widgetName} • General Widget
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                    Global across your entire site
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                This widget appears on all pages of your site. With the Enterprise plan, you can customize different headers, sidebars, and footers for each page.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleUpgradeClick}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Enterprise
              </button>

              {/* Arrow */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700 rotate-45"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 