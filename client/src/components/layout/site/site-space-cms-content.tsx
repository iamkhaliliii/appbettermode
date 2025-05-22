import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceCmsContentProps {
  siteSD: string;
  space: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    cms_type?: string;
  };
  site: any;
}

export function SpaceCmsContent({ siteSD, space, site }: SpaceCmsContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentData, setContentData] = useState<any>(null);
  
  // Fetch content data based on space and site
  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true);
      
      // Simulate content loading (normally you'd fetch from API)
      setTimeout(() => {
        // Mock data based on space type
        const mockContent = {
          title: space.name,
          description: space.description || 'No description available',
          items: Array(5).fill(null).map((_, i) => ({
            id: `item-${i}`,
            title: `${space.name} Item ${i + 1}`,
            description: `This is a sample ${space.name} item.`,
            createdAt: new Date().toISOString(),
          }))
        };
        
        setContentData(mockContent);
        setIsLoading(false);
      }, 800); // Simulating network delay
    };
    
    fetchContentData();
  }, [space.id, space.name, siteSD]);
  
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center h-full"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="ml-3">Loading content...</p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-2">{contentData.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{contentData.description}</p>
            
            <div className="space-y-4">
              {contentData.items.map((item: any) => (
                <div 
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Posted: {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 