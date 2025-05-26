import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bold, 
  Italic, 
  Heading, 
  Quote, 
  Link, 
  Image, 
  List, 
  ListOrdered,
  X,
  Maximize2,
  Clock,
  Save,
  ExternalLink,
  MessageSquareDashed,
  ArrowUpRight,
  AlarmClockCheck,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPostDialog({ open, onOpenChange }: NewPostDialogProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft:", { title, content });
  };

  const handleSchedulePost = () => {
    // TODO: Implement schedule post functionality
    console.log("Schedule post:", { title, content });
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publish:", { title, content });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col [&>button]:hidden",
          isFullscreen 
            ? "w-[95vw] h-[95vh] max-w-none max-h-none" 
            : "w-[90vw] max-w-4xl h-[80vh]"
        )}
      >
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="ml-2 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
              </svg>
            </div>
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
              Create a new Discussion
            </DialogTitle>
          </div>
          <div className="flex items-center justify-center gap-1">
            {/* Action Links */}

            
            {/* Control Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Title Input */}
            <div className="p-6 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <Input
                placeholder="What is your title?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            {/* Content Editor */}
            <div className="px-6 pb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              
              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 border border-gray-200 dark:border-gray-700 rounded-t-md bg-gray-50 dark:bg-gray-800">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heading className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heading className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Quote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>

              {/* Text Area */}
              <Textarea
                placeholder="October 2024: Enhancements and Fixes ✨

New Features

• Redesigned Space Header: A newly redesigned Space Header introduces more customization and visual appeal, letting you set the tone for each community space. This update offers dynamic media options and adjustable display settings, allowing you to create a unique look th..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] border-gray-200 dark:border-gray-700 border-t-0 rounded-t-none rounded-b-md resize-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center">
            <Button
              variant="link"
              asChild
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              <a href="http://localhost:4000/dashboard/site/google/content?status=draft" target="_blank" rel="noopener noreferrer">
                <Save className="h-4 w-4" />
                View all drafts <span className="text-xs text-gray-400 dark:text-gray-400"><ArrowUpRight/></span>
              </a>
            </Button>
            <Button
              variant="link"
              asChild
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              <a href="http://localhost:4000/dashboard/site/google/content?status=scheduled" target="_blank" rel="noopener noreferrer">
                <Clock className="h-4 w-4" /> View all scheduled <span className="text-xs text-gray-400 dark:text-gray-400"><ArrowUpRight/></span>
              </a>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              Cancel
            </Button>
            <div className="flex items-center">
              <Button
                onClick={handlePublish}
                className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-r-none"
              >
                Publish
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-2 rounded-l-none border-l border-green-500"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-48">
                  <DropdownMenuItem onClick={handleSaveDraft} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save draft
                    <span className="ml-auto text-xs text-gray-400">⌘D</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSchedulePost} className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Schedule post
                    <span className="ml-auto text-xs text-gray-400">⌘S</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 