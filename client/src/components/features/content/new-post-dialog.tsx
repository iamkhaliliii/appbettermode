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
import { PollV3 } from "@/components/features/polls/poll-block";
import { PollConfigModalV3, PollConfigV3 } from "@/components/features/polls/poll-config-modal";
import { PollV2 } from "@/components/features/polls/poll-block-v2";
import { PollConfigModalV2, PollConfigV2 } from "@/components/features/polls/poll-config-modal-v2";

// Import Post type for editing
import { Post } from "@/components/dashboard/site-config/content/types";

// Import Schedule Post Popover
import { SchedulePopover } from "./composer-modal/common";

// Import ContentType
import { ContentType } from "./content-type-selector";

// Import Event Create Form


// Create custom schema with poll blocks
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Include default blocks
    ...defaultBlockSpecs,
    // Add custom poll blocks
    pollV3: PollV3, // V3 Poll (formerly V4)
    pollV2: PollV2, // V2 Poll (formerly V3)
  },
});



export interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: Post | null; // Add optional editing post prop
  onStatusChange?: (post: Post, newStatus: string) => void; // Add status change handler
  selectedContentType?: ContentType | null; // Add selected content type
}

export function NewPostDialog({ open, onOpenChange, editingPost, onStatusChange, selectedContentType }: NewPostDialogProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [pollV3ModalOpen, setPollV3ModalOpen] = React.useState(false);
  const [pollV2ModalOpen, setPollV2ModalOpen] = React.useState(false);
  const [editingPollV3Config, setEditingPollV3Config] = React.useState<Partial<PollConfigV3> | null>(null);
  const [editingPollV2Config, setEditingPollV2Config] = React.useState<Partial<PollConfigV2> | null>(null);
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState<string>("Draft");
  
  // Track schedule popover state to prevent dropdown from closing
  const [isSchedulePopoverOpen, setIsSchedulePopoverOpen] = React.useState(false);
  
  // Add scheduled date state
  const [scheduledDate, setScheduledDate] = React.useState<Date | null>(null);
  
  // Track dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  // Generate unique dialog ID (keeping for potential future use)
  const dialogId = React.useRef(`dialog-${Math.random().toString(36).substr(2, 9)}`);
  
  // Use refs to track modal states for event handlers (to avoid closure issues)
  const modalStatesRef = React.useRef({
    pollV3ModalOpen: false,
    pollV2ModalOpen: false,
  });
  
  // Add debounce tracking to prevent rapid multiple events
  const eventProcessingRef = React.useRef({
    lastEditV3Event: 0,
    lastEditV2Event: 0,
    processingDelay: 300, // 300ms debounce
  });
  
  // Update refs when modal states change
  React.useEffect(() => {
    modalStatesRef.current.pollV3ModalOpen = pollV3ModalOpen;
  }, [pollV3ModalOpen]);
  
  React.useEffect(() => {
    modalStatesRef.current.pollV2ModalOpen = pollV2ModalOpen;
  }, [pollV2ModalOpen]);

  // Cleanup on unmount to prevent any lingering event listeners
  React.useEffect(() => {
    return () => {
      // Reset all timing states
      eventProcessingRef.current.lastEditV3Event = 0;
      eventProcessingRef.current.lastEditV2Event = 0;
      console.log('[CLEANUP] Component unmounting, event timers reset');
    };
  }, []);

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

  // Function to create poll block from config (V3)
  const createPollBlock = (config: PollConfigV3) => {
    console.log('[POLL V4] Creating/updating poll block', { editingBlockId, config });
    
    if (editingBlockId) {
      // Update existing block
      console.log(`[POLL V4] Updating existing block: ${editingBlockId}`);
      const block = editor.document.find(b => b.id === editingBlockId);
      if (block) {
        editor.updateBlock(block, {
          type: "pollV3",
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
        console.log(`[POLL V4] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[POLL V4] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollV3Config(null);
    } else {
      // Create new block
      console.log('[POLL V3] Creating new poll block');
      insertOrUpdateBlock(editor, {
        type: "pollV3",
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
      console.log('[POLL V4] Successfully created new poll block');
    }
    
    console.log('[POLL V4] Poll block operation completed');
  };

  // Function to create poll V3 block from config
  const createPollV3Block = (config: PollConfigV3) => {
    console.log('[POLL V3] Creating/updating poll block', { editingBlockId, config });
    
    if (editingBlockId) {
      // Update existing block
      console.log(`[POLL V3] Updating existing block: ${editingBlockId}`);
      const block = editor.document.find(b => b.id === editingBlockId);
      if (block) {
        editor.updateBlock(block, {
          type: "pollV3",
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
        console.log(`[POLL V3] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[POLL V3] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollV3Config(null);
    } else {
      // Create new block
      console.log('[POLL V3] Creating new poll block');
      insertOrUpdateBlock(editor, {
        type: "pollV3",
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
      console.log('[POLL V3] Successfully created new poll block');
    }
    
    console.log('[POLL V3] Poll block operation completed');
  };

  // Function to create poll V2 block from config
  const createPollV2Block = (config: PollConfigV2) => {
    console.log('[POLL V2] Creating/updating poll block', { editingBlockId, config });
    
    if (editingBlockId) {
      // Update existing block
      console.log(`[POLL V2] Updating existing block: ${editingBlockId}`);
      const block = editor.document.find(b => b.id === editingBlockId);
      if (block) {
        editor.updateBlock(block, {
          type: "pollV2",
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
            allowAddOptions: config.allowAddOptions,
          },
        });
        console.log(`[POLL V2] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[POLL V2] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollV2Config(null);
    } else {
      // Create new block
      console.log('[POLL V2] Creating new poll block');
      insertOrUpdateBlock(editor, {
        type: "pollV2",
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
          allowAddOptions: config.allowAddOptions,
        },
      });
      console.log('[POLL V2] Successfully created new poll block');
    }
    
    console.log('[POLL V2] Poll block operation completed');
  };

  // Slash menu item to open Poll V3 config modal
  const insertPoll = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Poll (V3)",
    subtext: "Create an interactive poll with advanced settings",
    onItemClick: () => {
      setEditingPollV3Config(null);
      setEditingBlockId(null);
      setPollV3ModalOpen(true);
    },
    aliases: [
      "poll",
      "pollv3",
      "poll(v3)",
      "vote", 
      "survey",
      "question",
      "voting",
      "choice",
    ],
    group: "Basic blocks",
    icon: <BarChart3 />,
  });

  // Slash menu item to open Poll V2 config modal
  const insertPollV2 = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Poll (V2)",
    subtext: "Create a simple poll with basic options",
    onItemClick: () => {
      setEditingPollV2Config(null);
      setEditingBlockId(null);
      setPollV2ModalOpen(true);
    },
    aliases: [
      "pollv2",
      "poll(v2)",
      "simplepoll",
      "basicpoll",
    ],
    group: "Basic blocks",
    icon: <BarChart3 />,
  });



  // Listen for poll V3 edit events
  React.useEffect(() => {
    // Only register event listener if this dialog is currently open
    if (!open) return;
    
    const handleEditPollV3 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();
      
      const now = Date.now();
      const lastEvent = eventProcessingRef.current.lastEditV3Event;
      
      // Debounce: ignore events that come too quickly
      if (now - lastEvent < eventProcessingRef.current.processingDelay) {
        console.log(`[V3] Event ignored - too soon after last event (${now - lastEvent}ms)`);
        return;
      }
      
      eventProcessingRef.current.lastEditV3Event = now;
      
      const { blockId, currentConfig } = event.detail;
      console.log(`[V3] Processing edit event for block: ${blockId}`);
      
      // Check if any modal is already open
      if (modalStatesRef.current.pollV3ModalOpen || modalStatesRef.current.pollV2ModalOpen) {
        console.log(`[V3] Modal already open, ignoring edit event`);
        return;
      }
      
      // Process the event
      setEditingBlockId(blockId);
      setEditingPollV3Config(currentConfig);
      setPollV3ModalOpen(true);
      
      console.log(`[V3] Modal opened for block: ${blockId}`);
    };

    console.log(`[V3] Registering edit poll V3 event listener (dialog open)`);
    window.addEventListener('editPollV3', handleEditPollV3 as EventListener, { passive: false });
    
    return () => {
      console.log(`[V3] Removing edit poll V3 event listener (dialog closing)`);
      window.removeEventListener('editPollV3', handleEditPollV3 as EventListener);
    };
  }, [open]); // Only register when dialog is open



  // Listen for poll V2 edit events
  React.useEffect(() => {
    // Only register event listener if this dialog is currently open
    if (!open) return;
    
    const handleEditPollV2 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();
      
      const now = Date.now();
      const lastEvent = eventProcessingRef.current.lastEditV2Event;
      
      // Debounce: ignore events that come too quickly
      if (now - lastEvent < eventProcessingRef.current.processingDelay) {
        console.log(`[V2] Event ignored - too soon after last event (${now - lastEvent}ms)`);
        return;
      }
      
      eventProcessingRef.current.lastEditV2Event = now;
      
      const { blockId, currentConfig } = event.detail;
      console.log(`[V2] Processing edit event for block: ${blockId}`);
      
      // Check if any modal is already open
      if (modalStatesRef.current.pollV3ModalOpen || modalStatesRef.current.pollV2ModalOpen) {
        console.log(`[V2] Modal already open, ignoring edit event`);
        return;
      }
      
      // Process the event
      setEditingBlockId(blockId);
      setEditingPollV2Config(currentConfig);
      setPollV2ModalOpen(true);
      
      console.log(`[V2] Modal opened for block: ${blockId}`);
    };

    console.log(`[V2] Registering edit poll V2 event listener (dialog open)`);
    window.addEventListener('editPollV2', handleEditPollV2 as EventListener, { passive: false });
    
    return () => {
      console.log(`[V2] Removing edit poll V2 event listener (dialog closing)`);
      window.removeEventListener('editPollV2', handleEditPollV2 as EventListener);
    };
  }, [open]); // Only register when dialog is open

  // Listen for poll V3 delete events
  React.useEffect(() => {
    // Only register event listener if this dialog is currently open
    if (!open) return;
    
    const handleDeletePollV3 = (event: CustomEvent) => {
      event.stopPropagation(); // Prevent event bubbling
      const { blockId } = event.detail;
      
      console.log(`[V3] Received delete poll V3 event for block: ${blockId}`);
      
      // Find and remove the block
      const blockToDelete = editor.document.find(b => b.id === blockId);
      if (blockToDelete) {
        console.log(`[V3] Deleting poll V3 block: ${blockId}`);
        editor.removeBlocks([blockToDelete]);
        console.log(`[V3] Successfully deleted poll V3 block: ${blockId}`);
      } else {
        console.error(`[V3] Poll V3 block not found: ${blockId}`);
      }
    };

    console.log(`[V3] Registering delete poll V3 event listener (dialog open)`);
    window.addEventListener('deletePollV3', handleDeletePollV3 as EventListener);
    
    return () => {
      console.log(`[V3] Removing delete poll V3 event listener (dialog closing)`);
      window.removeEventListener('deletePollV3', handleDeletePollV3 as EventListener);
    };
  }, [open]); // Only register when dialog is open

  // Listen for poll V2 delete events
  React.useEffect(() => {
    // Only register event listener if this dialog is currently open
    if (!open) return;
    
    const handleDeletePollV2 = (event: CustomEvent) => {
      event.stopPropagation(); // Prevent event bubbling
      const { blockId } = event.detail;
      
      console.log(`[V2] Received delete poll V2 event for block: ${blockId}`);
      
      // Find and remove the block
      const blockToDelete = editor.document.find(b => b.id === blockId);
      if (blockToDelete) {
        console.log(`[V2] Deleting poll V2 block: ${blockId}`);
        editor.removeBlocks([blockToDelete]);
        console.log(`[V2] Successfully deleted poll V2 block: ${blockId}`);
      } else {
        console.error(`[V2] Poll V2 block not found: ${blockId}`);
      }
    };

    console.log(`[V2] Registering delete poll V2 event listener (dialog open)`);
    window.addEventListener('deletePollV2', handleDeletePollV2 as EventListener);
    
    return () => {
      console.log(`[V2] Removing delete poll V2 event listener (dialog closing)`);
      window.removeEventListener('deletePollV2', handleDeletePollV2 as EventListener);
    };
  }, [open]); // Only register when dialog is open

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
    console.log('[V3] Closing poll V3 modal');
    
    // Reset state
    setPollV3ModalOpen(false);
    setEditingPollV3Config(null);
    setEditingBlockId(null);
    
    // Reset debounce timing to allow new events
    eventProcessingRef.current.lastEditV3Event = 0;
    
    console.log('[V3] Poll V3 modal closed and state reset');
  };

  const handlePollV2ModalClose = () => {
    console.log('[V2] Closing poll V2 modal');
    
    // Reset state
    setPollV2ModalOpen(false);
    setEditingPollV2Config(null);
    setEditingBlockId(null);
    
    // Reset debounce timing to allow new events
    eventProcessingRef.current.lastEditV2Event = 0;
    
    console.log('[V2] Poll V2 modal closed and state reset');
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
                {editingPost 
                  ? `Edit ${selectedContentType?.title || 'Content'}` 
                  : `Create a new ${selectedContentType?.title || 'Post'}`
                }
              </DialogTitle>
              <DialogDescription className="sr-only">
                {editingPost 
                  ? `Edit and update your ${selectedContentType?.title.toLowerCase() || 'content'}` 
                  : `Create and share a new ${selectedContentType?.title.toLowerCase() || 'post'} with your community`
                }
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

                <>
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
                                // Add poll blocks to block type select
                                {
                                  name: "Poll V4",
                                  type: "poll",
                                  icon: BarChart3,
                                  isSelected: (block) => block.type === "poll",
                                } satisfies BlockTypeSelectItem,
                                {
                                  name: "Poll V3",
                                  type: "pollV3",
                                  icon: BarChart3,
                                  isSelected: (block) => block.type === "pollV3",
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
                            // Insert the Poll items as the last items in the "Basic blocks" group
                            defaultItems.splice(lastBasicBlockIndex + 1, 0, insertPoll(editor));
                            defaultItems.splice(lastBasicBlockIndex + 2, 0, insertPollV2(editor));
                            
                            // Return filtered items based on the query
                            return filterSuggestionItems(defaultItems, query);
                          }}
                        />
                      </BlockNoteView>
                    </div>
                  </div>
                </>
            </div>
          </div>

          {/* Footer Actions - Fixed */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* Scheduled Banner - Show above footer when scheduled */}
            {scheduledDate && (
              <div className="flex items-center justify-between px-6 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Scheduled for {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SchedulePopover
                    onConfirm={handleEditSchedule}
                    title="Edit Schedule"
                    initialDate={scheduledDate}
                    side="top"
                    align="end"
                    onOpenChange={setIsSchedulePopoverOpen}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDropdownOpen(false)}
                      className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                    >
                      <SquarePen className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </SchedulePopover>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleRemoveSchedule();
                    }}
                    className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
            
            {/* Normal Footer - Always show */}
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
                    {scheduledDate ? 'Schedule Post' : editingPost ? (currentStatus === 'Draft' ? 'Publish' : currentStatus === 'Published' ? 'Update' : 'Publish') : 'Publish'}
                  </Button>
                  <DropdownMenu 
                    open={isDropdownOpen}
                    onOpenChange={(open) => {
                      // Prevent dropdown from closing when schedule popover is open
                      if (isSchedulePopoverOpen && !open) {
                        return;
                      }
                      setIsDropdownOpen(open);
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                          {!scheduledDate && (
                            // Only show "Schedule post" when not scheduled
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
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* Poll Configuration Modal */}
      {pollV3ModalOpen && (
        <PollConfigModalV3
          open={pollV3ModalOpen}
          onOpenChange={handlePollModalClose}
          onConfirm={createPollBlock}
          initialConfig={editingPollV3Config || undefined}
        />
      )}

      {/* Poll V2 Configuration Modal */}
      {pollV2ModalOpen && (
        <PollConfigModalV2
          open={pollV2ModalOpen}
          onOpenChange={handlePollV2ModalClose}
          onConfirm={createPollV2Block}
          initialConfig={editingPollV2Config || undefined}
        />
      )}

    </>
  );
} 