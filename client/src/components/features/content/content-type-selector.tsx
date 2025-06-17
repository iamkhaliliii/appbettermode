import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { 
  MessageSquare,
  Calendar,
  HelpCircle,
  FileText,
  BookOpen,
  Briefcase,
  X
} from "lucide-react";

export interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface ContentTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentTypeSelect: (contentType: ContentType) => void;
}

// Clean, minimal content types
const DEFAULT_CONTENT_TYPES: ContentType[] = [
  {
    id: 'discussion',
    title: 'Discussion',
    description: 'Start conversations with community members',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'blue'
  },
  {
    id: 'event',
    title: 'Event',
    description: 'Create and manage events with scheduling',
    icon: <Calendar className="h-5 w-5" />,
    color: 'green'
  },
  {
    id: 'qa',
    title: 'Q&A',
    description: 'Ask questions and get answers',
    icon: <HelpCircle className="h-5 w-5" />,
    color: 'purple'
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Share articles and insights',
    icon: <FileText className="h-5 w-5" />,
    color: 'orange'
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Create helpful documentation',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'indigo'
  },
  {
    id: 'jobs',
    title: 'Job',
    description: 'Post career opportunities',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'teal'
  }
];

export function ContentTypeSelector({ open, onOpenChange, onContentTypeSelect }: ContentTypeSelectorProps) {
  
  const handleTypeClick = (contentType: ContentType) => {
    console.log('Content type selected:', contentType);
    onContentTypeSelect(contentType);
  };

  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-4xl h-[80vh] p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col [&>button]:hidden">
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
                         <div className="ml-2 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm0 8h6v6h-6v-6zm-8 0h6v6H3v-6z"/>
               </svg>
             </div>
                         <div>
               <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                 Select Content Type
               </DialogTitle>
               <DialogDescription className="sr-only">
                 Choose the type of content you want to create
               </DialogDescription>
             </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {/* Control Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_CONTENT_TYPES.map((contentType) => (
                <button
                  key={contentType.id}
                  onClick={() => handleTypeClick(contentType)}
                  className="flex flex-col items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left group hover:shadow-sm"
                >
                  {/* Simple Icon */}
                  <div className="flex-shrink-0 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    {contentType.icon}
                  </div>
                  
                  {/* Text Content */}
                  <div className="w-full">
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {contentType.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {contentType.description}
                    </div>
                  </div>

                  {/* Simple Arrow */}
                  <div className="self-end text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Footer */}
        <div className="flex-shrink-0 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Choose the type of content you want to create
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 