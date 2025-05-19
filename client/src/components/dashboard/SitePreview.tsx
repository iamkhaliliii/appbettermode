import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageSquare, HelpCircle, Star, Layout, BookOpen, Briefcase, FileText, Home, LayoutDashboard } from 'lucide-react';

interface SitePreviewProps {
  previewName: string;
  previewColor: string;
  previewLogo: string;
  subdomainValue: string;
  wizardStep: number;
  selectedContentTypes?: string[];
}

export const SitePreview: React.FC<SitePreviewProps> = ({
  previewName,
  previewColor,
  previewLogo,
  subdomainValue,
  wizardStep,
  selectedContentTypes = [],
}) => {

  // Helper function to get icon and name for each content type
  const getContentTypeInfo = (type: string) => {
    switch (type) {
      case 'event':
        return { 
          icon: <Calendar className="h-4 w-4" />, 
          name: 'Events',
          previewContent: (
            <div className="mt-1 w-full">
              <div className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, dayIndex) => (
                  <div 
                    key={`day-${dayIndex}`} 
                    className="aspect-square rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    {dayIndex + 1}
                  </div>
                ))}
              </div>
            </div>
          )
        };
      case 'discussion':
        return { 
          icon: <MessageSquare className="h-4 w-4" />, 
          name: 'Discussions',
          previewContent: (
            <div className="mt-1 space-y-1.5 w-full">
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-5/6"></div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full mr-1 bg-gray-100 dark:bg-gray-800"></div>
                  ))}
                </div>
                <div className="h-3 w-12 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
              </div>
            </div>
          )
        };
      case 'qa':
        return { 
          icon: <HelpCircle className="h-4 w-4" />, 
          name: 'Q&A',
          previewContent: (
            <div className="mt-1 space-y-3 w-full">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full flex-shrink-0 bg-gray-100 dark:bg-gray-800"></div>
                <div className="space-y-1 w-full">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-4/5"></div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-6 px-2 rounded bg-gray-100 dark:bg-gray-800 flex items-center">
                  <div className="h-3 w-5 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
                <div className="h-6 px-2 rounded bg-gray-100 dark:bg-gray-800 flex items-center">
                  <div className="h-3 w-5 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
              </div>
            </div>
          )
        };
      case 'wishlist':
        return { 
          icon: <Star className="h-4 w-4" />, 
          name: 'Wishlist',
          previewContent: (
            <div className="mt-1 space-y-2 w-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full"></div>
                </div>
              ))}
            </div>
          )
        };
      case 'landing':
        return { 
          icon: <Layout className="h-4 w-4" />, 
          name: 'Landing',
          previewContent: (
            <div className="mt-1 space-y-2 w-full">
              <div className="h-20 rounded bg-gray-100 dark:bg-gray-800 w-full"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 rounded bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 rounded bg-gray-100 dark:bg-gray-800"></div>
              </div>
            </div>
          )
        };
      case 'knowledge':
        return { 
          icon: <BookOpen className="h-4 w-4" />, 
          name: 'Knowledge',
          previewContent: (
            <div className="mt-1 grid grid-cols-2 gap-2 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded bg-gray-100 dark:bg-gray-800 p-2">
                  <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
              ))}
            </div>
          )
        };
      case 'jobs':
        return { 
          icon: <Briefcase className="h-4 w-4" />, 
          name: 'Jobs',
          previewContent: (
            <div className="mt-1 space-y-3 w-full">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-2 border border-gray-100 dark:border-gray-800 rounded">
                  <div className="flex justify-between mb-1">
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                    <div className="h-4 w-16 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-md mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 px-2 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                    <div className="h-5 px-2 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'blog':
        return { 
          icon: <FileText className="h-4 w-4" />, 
          name: 'Blog',
          previewContent: (
            <div className="mt-1 space-y-3 w-full">
              <div className="aspect-video w-full rounded bg-gray-100 dark:bg-gray-800"></div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                <div className="h-3 w-3/5 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
              </div>
            </div>
          )
        };
      default:
        return { icon: null, name: type, previewContent: null };
    }
  };

  // Helper function to adjust color brightness
  function adjustColor(hex: string, percent: number) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex color to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust brightness
    const adjustR = Math.max(0, Math.min(255, r + percent));
    const adjustG = Math.max(0, Math.min(255, g + percent));
    const adjustB = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return `#${Math.round(adjustR).toString(16).padStart(2, '0')}${Math.round(adjustG).toString(16).padStart(2, '0')}${Math.round(adjustB).toString(16).padStart(2, '0')}`;
  }

  return (
    <motion.div 
      className="flex flex-col h-full mx-auto w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Browser chrome */}
      <div className="flex flex-col rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 w-full">
        {/* Browser tabs */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 pt-2 border-b border-gray-200 dark:border-gray-700 flex items-center h-10">
          <div className="flex space-x-1.5 left-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex space-x-1 ml-10 mb-[-1px]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-t-md bg-white dark:bg-gray-900 border-t border-l border-r border-gray-200 dark:border-gray-700 text-xs font-medium">
              <AnimatePresence mode="wait">
                {wizardStep >= 2 ? (
                  <motion.div 
                    key="colorDot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-3 h-3 rounded-full"
                    style={{ background: previewColor }}
                  ></motion.div>
                ) : (
                  <motion.div 
                    key="grayDot"
                    className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"
                  ></motion.div>
                )}
              </AnimatePresence>
              <span className="truncate max-w-[80px]">
                {wizardStep >= 2 ? previewName : "Site Preview"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Browser address bar */}
        <div className="h-10 bg-gray-100 dark:bg-gray-800 px-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div className="flex-1 h-7 flex items-center px-3 bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
            {wizardStep >= 2 && subdomainValue ? (
              <div className="flex items-center">
                <div className="flex items-center rounded px-1.5 text-white" style={{ backgroundColor: previewColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2">{subdomainValue}.bettermode.com</span>
              </div>
            ) : (
              <div className="flex gap-2 items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                <span>preview.bettermode.com</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo in navbar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8">
                <AnimatePresence mode="wait">
                  {wizardStep >= 2 && (previewLogo || previewColor) ? (
                    previewLogo ? (
                      <motion.div 
                        key="siteLogo"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="w-8 h-8 relative flex items-center justify-center p-1.5 rounded-md bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        <img 
                          src={previewLogo} 
                          alt="Site logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="colorLogo"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${previewColor}, ${adjustColor(previewColor, -15)})` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {previewName.substring(0, 1).toUpperCase()}
                        </span>
                      </motion.div>
                    )
                  ) : (
                    <motion.div 
                      key="placeholderLogo"
                      className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence mode="wait">
                {wizardStep >= 2 ? (
                  <motion.div 
                    key="siteName"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm text-gray-900 dark:text-white truncate"
                  >
                    {previewName}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholderName" 
                    className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Navigation in navbar */}
            <div className="flex items-center gap-3 pl-4 pt-0.5">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-14 h-3.5 ${
                    wizardStep === 2 && i === 0 
                      ? 'rounded-full' 
                      : ''
                  }`}
                  style={
                    wizardStep === 2 && i === 0 
                      ? { background: `${previewColor}40` } 
                      : { background: 'transparent' }
                  }
                >
                  <div 
                    className={`h-2 w-10 mx-auto rounded-full ${
                      wizardStep === 2 && i === 0 
                        ? 'bg-transparent' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Two-column layout with sidebar and content */}
        <div className="flex flex-1 h-[350px] bg-white dark:bg-gray-900">
          {/* Left Sidebar - Minimal with icons and labels */}
          <div className="w-[180px] border-r border-gray-200 dark:border-gray-700 flex flex-col pt-5 bg-white dark:bg-gray-800 overflow-y-auto">
            {/* Navigation Items with icons and labels */}
            <div className="space-y-1 w-full px-3">
              <AnimatePresence>
                <div className={`flex items-center gap-3 px-2 py-2 rounded-md ${
                  wizardStep >= 2 
                    ? `transition-colors duration-300`
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
                style={
                  wizardStep >= 2 
                    ? { backgroundColor: `${previewColor}15`, color: previewColor }
                    : {}
                }>
                  <div className="w-5 h-5 text-current">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div className="h-4 w-12 flex items-center">
                    {wizardStep >= 2 ? (
                      <span className="text-sm font-medium">Feed</span>
                    ) : (
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Render selected content types in sidebar when on step 3 */}
                {wizardStep === 3 && selectedContentTypes.map((type, index) => {
                  const { icon, name } = getContentTypeInfo(type);
                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors
                        ${index === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <div className={`w-5 h-5 ${index === 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {icon}
                      </div>
                      <span className={`text-sm font-medium ${index === 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
                        {name}
                      </span>
                    </motion.div>
                  );
                })}

                {/* Static sidebar items (placeholders) */}
                {[...Array(wizardStep === 3 ? 0 : 5)].map((_, i) => (
                  <div
                    key={`sidebar-item-${i}`}
                    className="flex items-center gap-3 px-2 py-2"
                  >
                    <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar bottom section */}
            <div className="mt-auto w-full px-3 pt-3 pb-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {/* Header banner */}
              <div className="h-36 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {wizardStep >= 2 ? (
                    <motion.div 
                      key="coloredBanner"
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ 
                        background: `linear-gradient(135deg, ${previewColor}40, ${previewColor}70)`,
                      }}
                    >
                      {/* Decorative shapes */}
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="85" cy="20" r="15" fill="white" />
                          <circle cx="10" cy="40" r="5" fill="white" />
                          <circle cx="50" cy="70" r="20" fill="white" />
                        </svg>
                      </div>
                      
                      {/* Community Name and Description */}
                      <div className="absolute bottom-5 left-5 flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {previewLogo ? (
                            <div className="w-14 h-14 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center">
                              <img 
                                src={previewLogo} 
                                alt="Logo" 
                                className="max-h-full max-w-full object-contain" 
                              />
                            </div>
                          ) : (
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                              style={{ 
                                background: `linear-gradient(135deg, ${previewColor}, ${adjustColor(previewColor, -15)})` 
                              }}
                            >
                              <span className="text-white font-bold text-xl">
                                {previewName.substring(0, 1).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <h2 className="font-bold text-white text-lg drop-shadow-sm">{previewName}</h2>
                          <p className="text-white/80 text-xs">Your community platform</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholderBanner"
                      className="absolute inset-0 flex items-end bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                    >
                      <div className="mb-4 ml-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-gray-300 dark:bg-gray-600"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-md mb-1"></div>
                          <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded-md opacity-70"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
                
              {/* Main content */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-4 w-60 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                  </motion.div>
                </div>
                
                <div className="flex justify-between items-center h-8">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      {wizardStep >= 2 ? <span>Filter</span> : <div className="h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>}
                    </div>
                    <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1 flex items-center">
                      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-md w-10"></div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800"></div>
                    ))}
                  </div>
                </div>
                
                {/* Content display based on selected content type */}
                <div>
                  <motion.div
                    className="mt-2 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Always show consistent feed content regardless of selection */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div 
                        key={`content-${i}`}
                        className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full"></div>
                              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-5/6"></div>
                              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-3/6"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <motion.p 
          className="text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {wizardStep === 1 
            ? "Enter your domain to see a customized preview" 
            : wizardStep === 2
            ? "This is a preview of how your site might look. Colors and layout will vary based on the final theme."
            : "Select content types to add them to your site's navigation."}
        </motion.p>
      </div>
    </motion.div>
  );
}; 