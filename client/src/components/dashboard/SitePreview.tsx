import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SitePreviewProps {
  previewName: string;
  previewColor: string;
  previewLogo: string;
  subdomainValue: string;
  wizardStep: number;
}

export const SitePreview: React.FC<SitePreviewProps> = ({
  previewName,
  previewColor,
  previewLogo,
  subdomainValue,
  wizardStep,
}) => {
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
                {wizardStep === 2 ? (
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
                {wizardStep === 2 ? previewName : "Site Preview"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Browser address bar */}
        <div className="flex items-center gap-2 px-3 py-2 h-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1.5">
            <div className="text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L3.56 9l2.72 2.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.72 5.22a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06L16.44 9l-2.72-2.72a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 px-3 py-1 h-7 rounded-md bg-white dark:bg-gray-700 text-xs text-center text-gray-600 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600">
            <AnimatePresence mode="wait">
              {wizardStep === 2 && subdomainValue ? (
                <motion.span
                  key="subdomainUrl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {subdomainValue}.yourdomain.com
                </motion.span>
              ) : (
                <motion.span
                  key="defaultUrl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  yourdomain.com
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo in navbar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8">
                <AnimatePresence mode="wait">
                  {wizardStep === 2 && (previewLogo || previewColor) ? (
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
                    ></motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="w-24 h-4">
                <AnimatePresence mode="wait">
                  {wizardStep === 2 ? (
                    <motion.span 
                      key="siteName"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-semibold text-sm truncate block" 
                      style={{ color: previewColor }}
                    >
                      {previewName}
                    </motion.span>
                  ) : (
                    <motion.div 
                      key="nameText"
                      className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"
                    ></motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mx-4 h-6 border-l border-gray-200 dark:border-gray-700"></div>
            
            <div className="w-40 h-8 rounded-md flex items-center px-3 bg-gray-100 dark:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
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
          <div className="w-[180px] border-r border-gray-200 dark:border-gray-700 flex flex-col pt-5 bg-white dark:bg-gray-800">
            {/* Navigation Items with icons and labels */}
            <div className="space-y-1 w-full px-3">
              <AnimatePresence>
                <div className={`flex items-center gap-3 px-2 py-2 rounded-md ${
                  wizardStep === 2 
                    ? `transition-colors duration-300`
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
                style={
                  wizardStep === 2 
                    ? { backgroundColor: `${previewColor}15`, color: previewColor }
                    : {}
                }>
                  <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="h-4 w-12 flex items-center">
                    {wizardStep === 2 ? (
                      <span className="text-sm font-medium">Home</span>
                    ) : (
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              
                {['users', 'document', 'settings', 'chart'].map((icon, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    initial={{ opacity: wizardStep === 1 ? 0.5 : 0 }}
                    animate={{ 
                      opacity: 1,
                      y: wizardStep === 2 ? 0 : 0
                    }}
                    transition={{ 
                      delay: wizardStep === 2 ? 0.3 + i * 0.1 : 0,
                      duration: 0.3 
                    }}
                  >
                    <div className="w-5 h-5">
                      {icon === 'users' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      )}
                      {icon === 'document' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === 'settings' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === 'chart' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      )}
                    </div>
                    <div className="h-3 w-16 flex items-center">
                      {wizardStep === 2 ? (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "4rem" }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                          className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                        ></motion.div>
                      ) : (
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {/* Header banner */}
              <div className="h-36 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {wizardStep === 2 ? (
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
                      
                      {/* Banner Buttons */}
                      <motion.div 
                        className="absolute bottom-5 right-5 flex gap-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                          </svg>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="skeletonBanner"
                      className="absolute inset-0 bg-gray-100 dark:bg-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="absolute bottom-5 left-5 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Mirroring the position of the buttons in step 2 */}
                      <div className="absolute bottom-5 right-5 flex gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Main content area */}
              <div className="p-5 space-y-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 -mx-5 px-5 pb-3 h-9">
                  <AnimatePresence mode="wait">
                    {wizardStep === 2 ? (
                      <motion.div 
                        key="coloredTab"
                        className="mr-4 border-b-2 pb-3 px-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ borderColor: previewColor, color: previewColor }}
                      >
                        <span className="font-medium text-sm">All Posts</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="grayTab"
                        className="mr-4 border-b-2 pb-3 px-1 border-gray-300 dark:border-gray-600"
                      >
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="mr-4 text-gray-500 dark:text-gray-400 px-1">
                    {wizardStep === 2 ? (
                      <span className="text-sm">Latest</span>
                    ) : (
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    )}
                  </div>
                  <div className="mr-4 text-gray-500 dark:text-gray-400 px-1">
                    {wizardStep === 2 ? (
                      <span className="text-sm">Popular</span>
                    ) : (
                      <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center h-8">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      {wizardStep === 2 ? <span>Filter</span> : <div className="h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>}
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
                
                {/* Minimal Feed */}
                <div className="space-y-3 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
                      initial={{ opacity: wizardStep === 1 ? 0.7 : 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: wizardStep === 2 ? 0.3 + (i * 0.1) : 0,
                        duration: 0.3
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                        <div className="space-y-2 w-full">
                          <div className="flex justify-between items-center">
                            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5"></div>
                          </div>
                          
                          {i === 0 && (
                            <div className="mt-3 h-20 rounded-lg w-full">
                              {wizardStep === 2 ? (
                                <motion.div 
                                  className="h-full w-full"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  style={{ background: `linear-gradient(135deg, ${previewColor}20, ${previewColor}40)` }}
                                ></motion.div>
                              ) : (
                                <div className="h-full w-full bg-gray-200 dark:bg-gray-700"></div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-2">
                            <div className="flex gap-3">
                              {[...Array(3)].map((_, j) => (
                                <div key={j} className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-5"></div>
                              ))}
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
            : "This is a preview of how your site might look. Colors and layout will vary based on the final theme."}
        </motion.p>
      </div>
    </motion.div>
  );
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