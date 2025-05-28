import React from "react";
import { StatusCounts } from './types';

interface ContentTabsProps {
  activeTab: string;
  statusCounts: StatusCounts;
  isLoading: boolean;
  onTabChange: (tab: string, showPublishedOnly: boolean, showStatusFilter: boolean) => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  statusCounts,
  isLoading,
  onTabChange
}) => {
  return (
    <div className="mb-3 border-b border-gray-100 dark:border-gray-800">
      <div className="flex -mb-px">
        <button 
          className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'all' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
          onClick={() => onTabChange('all', false, false)}
        >
          All <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">{isLoading ? '...' : statusCounts.total}</span>
        </button>
        <button 
          className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'published' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
          onClick={() => onTabChange('published', true, true)}
        >
          Published <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.published}</span>
        </button>
        <button 
          className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'scheduled' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
          onClick={() => onTabChange('scheduled', false, true)}
        >
          Scheduled <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.scheduled}</span>
        </button>
        <button 
          className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'drafts' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
          onClick={() => onTabChange('drafts', false, true)}
        >
          Drafts <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.draft}</span>
        </button>
        <button 
          className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'pending' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
          onClick={() => onTabChange('pending', false, true)}
        >
          Pending <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.pending}</span>
        </button>
      </div>
    </div>
  );
}; 