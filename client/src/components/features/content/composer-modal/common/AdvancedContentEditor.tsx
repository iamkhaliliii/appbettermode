import * as React from "react";

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

// Lucide icons for widgets
import { 
  BarChart3, 
  Layout,
  Image,
  Video,
  Type,
  Menu,
  ImageIcon,
  Megaphone,
  Code,
  Monitor,
  ExternalLink,
  AlignLeft,
  Settings,
  Palette,
  Sparkles
} from "lucide-react";

// Import custom poll blocks and modal
import { PollV3 } from "@/components/features/polls/poll-block";
import { PollConfigModalV3, PollConfigV3 } from "@/components/features/polls/poll-config-modal";
import { PollV2 } from "@/components/features/polls/poll-block-v2";
import { PollConfigModalV2, PollConfigV2 } from "@/components/features/polls/poll-config-modal-v2";

// Import existing widgets system
import { availableWidgets, type AvailableWidget } from "@/components/dashboard/site-config/widgets";

import { BaseContentEditorProps } from "./types";

// Create custom schema with poll blocks only (widgets will be handled differently)
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Include default blocks
    ...defaultBlockSpecs,
    // Add custom poll blocks
    pollV3: PollV3, // V3 Poll (formerly V4)
    pollV2: PollV2, // V2 Poll (formerly V3)
  },
});

export interface AdvancedContentEditorProps extends BaseContentEditorProps {
  enableWidgets?: boolean;
  enablePremiumFeatures?: boolean;
  onWidgetAdd?: (widget: AvailableWidget) => void;
  onWidgetEdit?: (widgetId: string, settings: any) => void;
}

export function AdvancedContentEditor({ 
  content, 
  onContentChange,
  enableWidgets = true,
  enablePremiumFeatures = true,
  onWidgetAdd,
  onWidgetEdit
}: AdvancedContentEditorProps) {
  // Poll modal states
  const [pollV3ModalOpen, setPollV3ModalOpen] = React.useState(false);
  const [pollV2ModalOpen, setPollV2ModalOpen] = React.useState(false);
  const [editingPollV3Config, setEditingPollV3Config] = React.useState<Partial<PollConfigV3> | null>(null);
  const [editingPollV2Config, setEditingPollV2Config] = React.useState<Partial<PollConfigV2> | null>(null);
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null);

  // Create BlockNote editor instance with custom schema
  const editor = useCreateBlockNote({
    schema,
    initialContent: content.length > 0 ? content : undefined,
  });

  // Listen for poll V3 edit events
  React.useEffect(() => {
    const handleEditPollV3 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const { blockId, currentConfig } = event.detail;
      console.log(`[Advanced V3] Processing edit event for block: ${blockId}`);

      if (pollV3ModalOpen || pollV2ModalOpen) {
        console.log(`[Advanced V3] Modal already open, ignoring edit event`);
        return;
      }

      setEditingBlockId(blockId);
      setEditingPollV3Config(currentConfig);
      setPollV3ModalOpen(true);
    };

    window.addEventListener('editPollV3', handleEditPollV3 as EventListener, { passive: false });

    return () => {
      window.removeEventListener('editPollV3', handleEditPollV3 as EventListener);
    };
  }, [pollV3ModalOpen, pollV2ModalOpen]);

  // Listen for poll V2 edit events
  React.useEffect(() => {
    const handleEditPollV2 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const { blockId, currentConfig } = event.detail;
      console.log(`[Advanced V2] Processing edit event for block: ${blockId}`);

      if (pollV3ModalOpen || pollV2ModalOpen) {
        console.log(`[Advanced V2] Modal already open, ignoring edit event`);
        return;
      }

      setEditingBlockId(blockId);
      setEditingPollV2Config(currentConfig);
      setPollV2ModalOpen(true);
    };

    window.addEventListener('editPollV2', handleEditPollV2 as EventListener, { passive: false });

    return () => {
      window.removeEventListener('editPollV2', handleEditPollV2 as EventListener);
    };
  }, [pollV3ModalOpen, pollV2ModalOpen]);

  // Listen for poll delete events
  React.useEffect(() => {
    const handleDeletePollV3 = (event: CustomEvent) => {
      event.stopPropagation();
      const { blockId } = event.detail;

      const blockToDelete = editor.document.find(b => b.id === blockId);
      if (blockToDelete) {
        editor.removeBlocks([blockToDelete]);
      }
    };

    const handleDeletePollV2 = (event: CustomEvent) => {
      event.stopPropagation();
      const { blockId } = event.detail;

      const blockToDelete = editor.document.find(b => b.id === blockId);
      if (blockToDelete) {
        editor.removeBlocks([blockToDelete]);
      }
    };

    window.addEventListener('deletePollV3', handleDeletePollV3 as EventListener);
    window.addEventListener('deletePollV2', handleDeletePollV2 as EventListener);

    return () => {
      window.removeEventListener('deletePollV3', handleDeletePollV3 as EventListener);
      window.removeEventListener('deletePollV2', handleDeletePollV2 as EventListener);
    };
  }, [editor]);

  // Handle content change from BlockNote editor
  const handleContentChange = () => {
    onContentChange(editor.document as any);
  };

  // Function to create poll V3 block from config
  const createPollV3Block = (config: PollConfigV3) => {
    console.log('[ADVANCED POLL V3] Creating/updating poll block', { editingBlockId, config });

    if (editingBlockId) {
      // Update existing block
      console.log(`[ADVANCED POLL V3] Updating existing block: ${editingBlockId}`);
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
        console.log(`[ADVANCED POLL V3] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[ADVANCED POLL V3] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollV3Config(null);
    } else {
      // Create new block
      console.log('[ADVANCED POLL V3] Creating new poll block');
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
      console.log('[ADVANCED POLL V3] Successfully created new poll block');
    }

    console.log('[ADVANCED POLL V3] Poll block operation completed');
  };

  // Function to create poll V2 block from config
  const createPollV2Block = (config: PollConfigV2) => {
    console.log('[ADVANCED POLL V2] Creating/updating poll block', { editingBlockId, config });

    if (editingBlockId) {
      // Update existing block
      console.log(`[ADVANCED POLL V2] Updating existing block: ${editingBlockId}`);
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
        console.log(`[ADVANCED POLL V2] Successfully updated block: ${editingBlockId}`);
      } else {
        console.error(`[ADVANCED POLL V2] Block not found: ${editingBlockId}`);
      }
      setEditingBlockId(null);
      setEditingPollV2Config(null);
    } else {
      // Create new block
      console.log('[ADVANCED POLL V2] Creating new poll block');
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
      console.log('[ADVANCED POLL V2] Successfully created new poll block');
    }

    console.log('[ADVANCED POLL V2] Poll block operation completed');
  };

  // Function to create widget block as a paragraph with widget info
  const createWidgetBlock = (widget: AvailableWidget) => {
    console.log('[ADVANCED WIDGET] Creating widget block', { widget });
    
    insertOrUpdateBlock(editor, {
      type: "paragraph",
      content: `[Widget: ${widget.name}] - ${widget.description || 'Widget placeholder'}`,
    });
    
    if (onWidgetAdd) {
      onWidgetAdd(widget);
    }
    
    console.log('[ADVANCED WIDGET] Widget block created successfully');
  };

  // Slash menu item to open Poll V3 config modal
  const insertPollV3 = (editor: typeof schema.BlockNoteEditor) => ({
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

  // Generate slash menu items for widgets
  const generateWidgetMenuItems = () => {
    if (!enableWidgets) return [];
    
    return availableWidgets.map((widget: AvailableWidget) => ({
      title: widget.name,
      subtext: widget.description || `Add ${widget.name} widget`,
      onItemClick: () => createWidgetBlock(widget),
      aliases: [
        widget.id,
        widget.name.toLowerCase(),
        widget.category || "widget",
        "widget",
      ],
      group: "Widgets",
      icon: widget.icon ? <widget.icon /> : <Layout />,
    }));
  };

  return (
    <>
      {/* Advanced BlockNote Rich Text Editor with Enhanced Widget Support */}
      <div className="border-none overflow-hidden min-h-[400px]">
        <BlockNoteView
          editor={editor}
          onChange={handleContentChange}
          theme="light"
        >
          {/* Enhanced Formatting Toolbar with Widget Support */}
          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar
                blockTypeSelectItems={[
                  // Default block type select items
                  ...blockTypeSelectItems(editor.dictionary),
                  // Add poll blocks to block type select
                  {
                    name: "Poll V3",
                    type: "pollV3",
                    icon: BarChart3,
                    isSelected: (block) => block.type === "pollV3",
                  } satisfies BlockTypeSelectItem,
                  {
                    name: "Poll V2",
                    type: "pollV2",
                    icon: BarChart3,
                    isSelected: (block) => block.type === "pollV2",
                  } satisfies BlockTypeSelectItem,
                  // Widget blocks are handled via slash menu, not toolbar
                ]}
              />
            )}
          />
          {/* Enhanced Slash Menu with Widget Support */}
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
              defaultItems.splice(lastBasicBlockIndex + 1, 0, insertPollV3(editor));
              defaultItems.splice(lastBasicBlockIndex + 2, 0, insertPollV2(editor));

              // Add widget items if enabled
              if (enableWidgets) {
                const widgetItems = generateWidgetMenuItems();
                defaultItems.push(...widgetItems);
              }

              // Return filtered items based on the query
              return filterSuggestionItems(defaultItems, query);
            }}
          />
        </BlockNoteView>
      </div>

      {/* Poll Configuration Modals */}
      {pollV3ModalOpen && (
        <PollConfigModalV3
          open={pollV3ModalOpen}
          onOpenChange={(open) => {
            setPollV3ModalOpen(open);
            if (!open) {
              setEditingPollV3Config(null);
              setEditingBlockId(null);
            }
          }}
          onConfirm={createPollV3Block}
          initialConfig={editingPollV3Config || undefined}
        />
      )}

      {pollV2ModalOpen && (
        <PollConfigModalV2
          open={pollV2ModalOpen}
          onOpenChange={(open) => {
            setPollV2ModalOpen(open);
            if (!open) {
              setEditingPollV2Config(null);
              setEditingBlockId(null);
            }
          }}
          onConfirm={createPollV2Block}
          initialConfig={editingPollV2Config || undefined}
        />
      )}
    </>
  );
} 