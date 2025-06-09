import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

interface EventAgendaProps {
  agenda: AgendaItem[];
}

export const EventAgenda: React.FC<EventAgendaProps> = ({ agenda }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Agenda
        </h3>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {agenda.map((item, index) => (
            <div key={index} className="flex gap-3">
              {/* Time */}
              <div className="flex-shrink-0 w-16">
                <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {item.time}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                  {item.title}
                </h4>
                
                {item.speaker && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {item.speaker}
                  </div>
                )}
                
                {item.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 