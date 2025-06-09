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
  ChevronUp
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
}

export function NewPostDialog({ open, onOpenChange }: NewPostDialogProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [pollModalOpen, setPollModalOpen] = React.useState(false);
  const [editingPollConfig, setEditingPollConfig] = React.useState<Partial<PollConfig> | null>(null);
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null);

  // Generate unique dialog ID
  const dialogId = React.useRef(`dialog-${Math.random().toString(36).substr(2, 9)}`);
  const editManager = React.useRef(PollEditEventManager.getInstance());

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
    setContent([]);
    onOpenChange(false);
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
                Create a new Discussion
              </DialogTitle>
              <DialogDescription className="sr-only">
                Create and share a new discussion post with your community
              </DialogDescription>
            </div>
            </div>
            <div className="flex items-center justify-center gap-1">
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