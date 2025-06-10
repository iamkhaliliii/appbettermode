import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
import { 
  X,
  Maximize2,
  Clock,
  Save,
  ArrowUpRight,
  ChevronUp,
  Lock,
  EyeOff,
  Calendar,
  Undo2,
  Timer,
  SquarePen
} from "lucide-react";
import { cn } from "@/lib/utils";

// BlockNote imports
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { 
  useCreateBlockNote,
  BlockTypeSelectItem,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { 
  BlockNoteSchema, 
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { BarChart3 } from "lucide-react";

// Import custom poll block and modal
import { Poll } from "@/components/features/polls/poll-block";
import { PollConfigModal, PollConfig } from "@/components/features/polls/poll-config-modal";

// Import Post type for editing
import { Post } from "@/components/dashboard/site-config/content/types";

// Import Schedule Post Popover
import { SchedulePopover } from "./schedule-popover";

// Create custom schema with poll block
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Include default blocks
    ...defaultBlockSpecs,
    // Add custom poll block
    poll: Poll,
  },
});

// Global singleton to manage poll edit events
class PollEditEventManager {
  private static instance: PollEditEventManager;
  private activeDialogId: string | null = null;
  private isProcessing: boolean = false;

  static getInstance(): PollEditEventManager {
    if (!PollEditEventManager.instance) {
      PollEditEventManager.instance = new PollEditEventManager();
    }
    return PollEditEventManager.instance;
  }

  registerDialog(dialogId: string): boolean {
    // Only allow one active dialog at a time
    if (this.activeDialogId === null) {
      this.activeDialogId = dialogId;
      console.log(`[EDIT-MANAGER] Registered active dialog: ${dialogId}`);
      return true;
    }
    console.log(`[EDIT-MANAGER] Dialog ${dialogId} blocked - active dialog: ${this.activeDialogId}`);
    return false;
  }

  unregisterDialog(dialogId: string): void {
    if (this.activeDialogId === dialogId) {
      this.activeDialogId = null;
      this.isProcessing = false;
      console.log(`[EDIT-MANAGER] Unregistered dialog: ${dialogId}`);
    }
  }

  canProcess(dialogId: string): boolean {
    if (this.isProcessing) {
      console.log(`[EDIT-MANAGER] Event already being processed, ignoring ${dialogId}`);
      return false;
    }
    if (this.activeDialogId !== dialogId) {
      console.log(`[EDIT-MANAGER] Dialog ${dialogId} not active, ignoring`);
      return false;
    }
    return true;
  }

  startProcessing(): void {
    this.isProcessing = true;
  }

  stopProcessing(): void {
    this.isProcessing = false;
  }
}

export interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: Post | null; // Add optional editing post prop
  onStatusChange?: (post: Post, newStatus: string) => void; // Add status change handler
}

export function NewPostDialog({ open, onOpenChange, editingPost, onStatusChange }: NewPostDialogProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [pollModalOpen, setPollModalOpen] = React.useState(false);
  const [editingPollConfig, setEditingPollConfig] = React.useState<Partial<PollConfig> | null>(null);
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState<string>("Draft");
  
  // Track schedule popover state to prevent dropdown from closing
  const [isSchedulePopoverOpen, setIsSchedulePopoverOpen] = React.useState(false);
  
  // Add scheduled date state
  const [scheduledDate, setScheduledDate] = React.useState<Date | null>(null);
  
  // Generate unique dialog ID
  const dialogId = React.useRef(`dialog-${Math.random().toString(36).substr(2, 9)}`);
  const editManager = React.useRef(PollEditEventManager.getInstance());

  // Initialize form data when editing post changes
  React.useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setCurrentStatus(editingPost.status);
      // Set scheduled date if post is scheduled
      if (editingPost.status === 'Schedule' && editingPost.publishedAt) {
        setScheduledDate(new Date(editingPost.publishedAt));
      } else {
        setScheduledDate(null);
      }
      // For now, start with empty content - you can extend this to parse actual content
      setContent([]);
    } else {
      setTitle("");
      setCurrentStatus("Draft");
      setScheduledDate(null);
      setContent([]);
    }
  }, [editingPost]);

  // Create BlockNote editor instance with custom schema
  const editor = useCreateBlockNote({
    schema,
    initialContent: content.length > 0 ? content : undefined,
  });

  // Function to create poll block from config
  const createPollBlock = (config: PollConfig) => {
    console.log('[POLL] Creating/updating poll block', { editingBlockId, config });
    
    if (editingBlockId) {
      // Update existing block
      console.log(`[POLL] Updating existing block: ${editingBlockId}`);
      const block = editor.document.find(b => b.id === editingBlockId);
      if (block) {
        editor.updateBlock(block, {
          type: "poll",
          props: {
            question: config.question,
            pollType: config.pollType,
            optionsJson: JSON.stringify(config.options),
            votesJson: JSON.stringify({}),
            maxVotesPerUser: config.maxVotesPerUser,
            allowedUsers: config.allowedUsers,
            startDate: config.startDate,
            endDate: config.endDate,
            showResultsAfterVote: config.showResultsAfterVote,
            showResultsBeforeEnd: config.showResultsBeforeEnd,
            allowAddOptions: config.allowAddOptions,
          },
        });
        console.log(`[POLL] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[POLL] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollConfig(null);
    } else {
      // Create new block
      console.log('[POLL] Creating new poll block');
      insertOrUpdateBlock(editor, {
        type: "poll",
        props: {
          question: config.question,
          pollType: config.pollType,
          optionsJson: JSON.stringify(config.options),
          votesJson: JSON.stringify({}),
          maxVotesPerUser: config.maxVotesPerUser,
          allowedUsers: config.allowedUsers,
          startDate: config.startDate,
          endDate: config.endDate,
          showResultsAfterVote: config.showResultsAfterVote,
          showResultsBeforeEnd: config.showResultsBeforeEnd,
          allowAddOptions: config.allowAddOptions,
        },
      });
      console.log('[POLL] Successfully created new poll block');
    }
    
    console.log('[POLL] Poll block operation completed');
  };

  // Slash menu item to open Poll config modal
  const insertPoll = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Poll",
    subtext: "Create an interactive poll with voting options",
    onItemClick: () => {
      setEditingPollConfig(null);
      setEditingBlockId(null);
      setPollModalOpen(true);
    },
    aliases: [
      "poll",
      "vote",
      "survey",
      "question",
      "voting",
      "choice",
    ],
    group: "Basic blocks",
    icon: <BarChart3 />,
  });

  // Listen for poll edit events using singleton manager
  React.useEffect(() => {
    const currentDialogId = dialogId.current;
    const manager = editManager.current;
    
    // Try to register this dialog as the active one
    const isActive = manager.registerDialog(currentDialogId);
    
    if (!isActive) {
      console.log(`[${currentDialogId}] Not active, skipping event listener setup`);
      return;
    }

    const handleEditPoll = (event: CustomEvent) => {
      const { blockId, currentConfig } = event.detail;
      
      console.log(`[${currentDialogId}] Received edit poll event for block: ${blockId}`);
      
      // Check if this dialog can process the event
      if (!manager.canProcess(currentDialogId)) {
        return;
      }
      
      // Check if modal is already open
      if (pollModalOpen) {
        console.log(`[${currentDialogId}] Modal already open, ignoring event`);
        return;
      }
      
      console.log(`[${currentDialogId}] Processing edit poll event for block: ${blockId}`);
      
      // Start processing
      manager.startProcessing();
      
      // Process the event
      setEditingBlockId(blockId);
      setEditingPollConfig(currentConfig);
      setPollModalOpen(true);
      
      // Reset processing flag after a delay
      setTimeout(() => {
        manager.stopProcessing();
      }, 500);
    };

    console.log(`[${currentDialogId}] Registering edit poll event listener`);
    window.addEventListener('editPoll', handleEditPoll as EventListener);
    
    return () => {
      console.log(`[${currentDialogId}] Removing edit poll event listener`);
      window.removeEventListener('editPoll', handleEditPoll as EventListener);
      manager.unregisterDialog(currentDialogId);
    };
  }, [pollModalOpen]); // Add pollModalOpen dependency

  // Listen for poll delete events using singleton manager
  React.useEffect(() => {
    const currentDialogId = dialogId.current;
    const manager = editManager.current;
    
    // Only listen if this dialog is active
    if (!manager.canProcess(currentDialogId)) {
      return;
    }

    const handleDeletePoll = (event: CustomEvent) => {
      const { blockId } = event.detail;
      
      console.log(`[${currentDialogId}] Received delete poll event for block: ${blockId}`);
      
      // Find and remove the block
      const blockToDelete = editor.document.find(b => b.id === blockId);
      if (blockToDelete) {
        console.log(`[${currentDialogId}] Deleting poll block: ${blockId}`);
        editor.removeBlocks([blockToDelete]);
        console.log(`[${currentDialogId}] Successfully deleted poll block: ${blockId}`);
      } else {
        console.error(`[${currentDialogId}] Poll block not found: ${blockId}`);
      }
    };

    console.log(`[${currentDialogId}] Registering delete poll event listener`);
    window.addEventListener('deletePoll', handleDeletePoll as EventListener);
    
    return () => {
      console.log(`[${currentDialogId}] Removing delete poll event listener`);
      window.removeEventListener('deletePoll', handleDeletePoll as EventListener);
    };
  }, [editor]); // Add editor dependency

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft:", { title, content });
  };

  const handleScheduleConfirm = (scheduledDateTime: Date) => {
    setScheduledDate(scheduledDateTime);
    if (editingPost) {
      handleStatusChange("Schedule");
      console.log("Post scheduled for:", scheduledDateTime.toLocaleString());
    } else {
      setCurrentStatus("Schedule");
      console.log("New post scheduled for:", scheduledDateTime.toLocaleString());
    }
  };

  const handleScheduleNewPostConfirm = (scheduledDateTime: Date) => {
    setScheduledDate(scheduledDateTime);
    setCurrentStatus("Schedule");
    console.log("New post scheduled for:", scheduledDateTime.toLocaleString());
  };

  const handleRemoveSchedule = () => {
    setScheduledDate(null);
    setCurrentStatus("Draft");
    if (editingPost) {
      handleStatusChange("Draft");
    }
    console.log("Schedule removed");
  };

  const handleEditSchedule = (newScheduledDateTime: Date) => {
    setScheduledDate(newScheduledDateTime);
    console.log("Schedule updated to:", newScheduledDateTime.toLocaleString());
  };

  const handlePublish = () => {
    if (editingPost) {
      // If editing, handle status change to Published
      if (currentStatus === 'Draft') {
        handleMoveToPublished();
      } else {
        // For other statuses, just republish/update
        console.log("Republishing/Updating:", { title, content, status: currentStatus });
        alert(`Updated "${title}" and refreshed publication status`);
      }
    } else {
      // Creating new post
      console.log("Publishing new post:", { title, content });
      alert(`Published new post: "${title}"`);
      onOpenChange(false);
    }
  };

  const handleUpdate = () => {
    // TODO: Implement update functionality (save changes without changing status)
    console.log("Update:", { title, content, status: currentStatus });
    alert(`Updated "${title}" - Changes saved. Status remains: ${currentStatus}`);
    // onOpenChange(false); // Keep dialog open for now so user can make more changes
  };

  const handleCancel = () => {
    setTitle("");
    setContent([]);
    onOpenChange(false);
  };

  // Status change handlers
  const handleStatusChange = (newStatus: string) => {
    if (editingPost && onStatusChange) {
      setCurrentStatus(newStatus);
      onStatusChange(editingPost, newStatus);
    }
  };

  const handleUnpublish = () => {
    if (editingPost) {
      handleStatusChange("Draft");
      console.log("Unpublishing post:", editingPost.title);
    }
  };

  const handleMoveToPublished = () => {
    if (editingPost) {
      handleStatusChange("Published");
      console.log("Publishing post:", editingPost.title);
    }
  };

  const handleHidePost = () => {
    if (editingPost && onStatusChange) {
      // TODO: Implement hide functionality (this might be a separate property, not status)
      console.log("Hiding post:", editingPost.title);
      alert(`Hide "${editingPost.title}" - This will be implemented with API call`);
    }
  };

  const handleLockPost = () => {
    if (editingPost && onStatusChange) {
      // TODO: Implement lock functionality (this might be a separate property, not status)
      console.log("Locking post:", editingPost.title);
      alert(`Lock "${editingPost.title}" - This will be implemented with API call`);
    }
  };

  const handleContentChange = () => {
    setContent(editor.document as any);
  };

  const handlePollModalClose = () => {
    console.log('[MODAL] Closing poll modal');
    setPollModalOpen(false);
    setEditingPollConfig(null);
    setEditingBlockId(null);
    
    console.log('[MODAL] Poll modal closed and state reset');
  };

  return (
    <>
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
                          <div>
              <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                {editingPost ? 'Edit Discussion' : 'Create a new Discussion'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {editingPost ? 'Edit and update your discussion post' : 'Create and share a new discussion post with your community'}
              </DialogDescription>
            </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              {/* Status Display - Only show when editing */}
              {editingPost && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  currentStatus === 'Published' 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50'
                    : currentStatus === 'Schedule'
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50'
                }`}>
                  {currentStatus}
                </span>
              )}
              
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
              <div className="p-6 pt-2 pb-4">
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
                
                {/* BlockNote Rich Text Editor with Poll Support */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden min-h-[400px] pt-8">
                  <BlockNoteView 
                    editor={editor} 
                    onChange={handleContentChange}
                    theme="light"
                  >
                    {/* Custom Formatting Toolbar with Poll Block Support */}
                    <FormattingToolbarController
                      formattingToolbar={() => (
                        <FormattingToolbar
                          blockTypeSelectItems={[
                            // Default block type select items
                            ...blockTypeSelectItems(editor.dictionary),
                            // Add poll block to block type select
                            {
                              name: "Poll",
                              type: "poll",
                              icon: BarChart3,
                              isSelected: (block) => block.type === "poll",
                            } satisfies BlockTypeSelectItem,
                          ]}
                        />
                      )}
                    />
                    {/* Custom Slash Menu with Poll Block Support */}
                    <SuggestionMenuController
                      triggerCharacter={"/"}
                      getItems={async (query) => {
                        // Get all default slash menu items
                        const defaultItems = getDefaultReactSlashMenuItems(editor);
                        // Find index of last item in "Basic blocks" group
                        const lastBasicBlockIndex = defaultItems.findLastIndex(
                          (item) => item.group === "Basic blocks",
                        );
                        // Insert the Poll item as the last item in the "Basic blocks" group
                        defaultItems.splice(lastBasicBlockIndex + 1, 0, insertPoll(editor));
                        
                        // Return filtered items based on the query
                        return filterSuggestionItems(defaultItems, query);
                      }}
                    />
                  </BlockNoteView>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* Scheduled State - Show links + scheduled post button + icon actions */}
            {scheduledDate ? (
              <div className="flex items-center justify-between p-6 pt-4">
                <div className="flex items-center gap-0">
                  {/* View all links - Always show */}
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
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  
                  <div className="flex items-center">
                    <Button
                      className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 rounded-r-none text-sm"
                    >
                      Scheduled Post ({(scheduledDate.getMonth() + 1).toString().padStart(2, '0')}/{scheduledDate.getDate().toString().padStart(2, '0')}/{scheduledDate.getFullYear()} {scheduledDate.getHours().toString().padStart(2, '0')}:{scheduledDate.getMinutes().toString().padStart(2, '0')})
                    </Button>
                    <SchedulePopover
                      onConfirm={handleEditSchedule}
                      title="Edit Schedule"
                      initialDate={scheduledDate}
                      side="top"
                      align="end"
                      onOpenChange={setIsSchedulePopoverOpen}
                    >
                      <Button
                        className="bg-white border-t border-blue-600 text-blue-600 hover:bg-blue-50 px-2 rounded-none border-b border-blue-600"
                        title="Edit schedule time"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </SchedulePopover>
                    <Button
                      onClick={handleRemoveSchedule}
                      className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-2 rounded-l-none border-l border-blue-600"
                      title="Remove schedule"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Normal State */
              <div className="flex items-center justify-between p-6 pt-4">
                <div className="flex items-center gap-0">
                  {/* View all links - Always show */}
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
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  
                  {/* Update button - Show for Draft and Scheduled, but not Published */}
                  {editingPost && currentStatus !== 'Published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUpdate}
                      className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400"
                    >
                      Update
                    </Button>
                  )}
                  
                  <div className="flex items-center">
                    <Button
                      onClick={currentStatus === 'Published' ? handleUpdate : handlePublish}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-r-none"
                    >
                      {editingPost ? (currentStatus === 'Draft' ? 'Publish' : currentStatus === 'Published' ? 'Update' : 'Publish') : 'Publish'}
                    </Button>
                    <DropdownMenu 
                      open={isSchedulePopoverOpen ? true : undefined}
                      onOpenChange={(open) => {
                        // Prevent dropdown from closing when schedule popover is open
                        if (isSchedulePopoverOpen && !open) {
                          return;
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white px-2 rounded-l-none border-l border-green-500"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="top" className="w-48">
                        {editingPost ? (
                          // Editing mode - Post management actions
                          <>
                            {currentStatus === 'Published' && (
                              <DropdownMenuItem onClick={handleUnpublish} className="flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4 rotate-180" />
                                Unpublish
                              </DropdownMenuItem>
                            )}
                            {currentStatus !== 'Draft' && (
                              <DropdownMenuItem onClick={handleHidePost} className="flex items-center gap-2">
                                <EyeOff className="h-4 w-4" />
                                Hide post
                              </DropdownMenuItem>
                            )}
                            {currentStatus !== 'Draft' && (
                              <DropdownMenuItem onClick={handleLockPost} className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Lock post
                              </DropdownMenuItem>
                            )}
                            {currentStatus !== 'Published' && (
                              <SchedulePopover
                                onConfirm={handleScheduleConfirm}
                                title={currentStatus === 'Draft' ? 'Schedule & Publish' : 'Reschedule'}
                                initialDate={currentStatus === 'Schedule' && editingPost?.publishedAt ? new Date(editingPost.publishedAt) : undefined}
                                side="top"
                                align="end"
                                onOpenChange={setIsSchedulePopoverOpen}
                                keepDropdownOpen={true}
                              >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {currentStatus === 'Draft' ? 'Schedule & Publish' : 'Reschedule'}
                                </DropdownMenuItem>
                              </SchedulePopover>
                            )}
                          </>
                        ) : (
                          // Creating mode - Original actions
                          <>
                            <DropdownMenuItem onClick={handleSaveDraft} className="flex items-center gap-2">
                              <Save className="h-4 w-4" />
                              Save draft
                              <span className="ml-auto text-xs text-gray-400">⌘D</span>
                            </DropdownMenuItem>
                            <SchedulePopover
                              onConfirm={handleScheduleNewPostConfirm}
                              title="Schedule Post"
                              side="top"
                              align="end"
                              onOpenChange={setIsSchedulePopoverOpen}
                              keepDropdownOpen={true}
                            >
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Schedule post
                                <span className="ml-auto text-xs text-gray-400">⌘S</span>
                              </DropdownMenuItem>
                            </SchedulePopover>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Poll Configuration Modal */}
      {pollModalOpen && (
        <PollConfigModal
          open={pollModalOpen}
          onOpenChange={handlePollModalClose}
          onConfirm={createPollBlock}
          initialConfig={editingPollConfig || undefined}
        />
      )}


    </>
  );
} 