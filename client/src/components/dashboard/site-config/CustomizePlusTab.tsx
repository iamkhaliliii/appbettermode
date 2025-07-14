import React, { useState, useCallback } from "react";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  useCreateBlockNote,
  BlockTypeSelectItem,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  SuggestionMenuProps,
  DefaultReactSuggestionItem,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { 
  BarChart3, 
  Layout, 
  Type, 
  List, 
  Image, 
  Video, 
  Volume2, 
  MousePointer,
  ChevronDown,
  Menu,
  Images,
  Monitor,
  Megaphone,
  Code,
  ExternalLink,
  Columns,
  Calendar,
  CalendarDays,
  Play,
  FileText,
  Layers,
  Crown,
  Trophy,
  Anchor,
  Navigation,
  PanelLeft,
  Heading1,
  Heading2,
  Heading3,
  Smile,
  Lock
} from "lucide-react";

// Import custom poll blocks and modal
import { PollV3 } from "@/components/features/polls/poll-block";
import { PollConfigModalV3, PollConfigV3 } from "@/components/features/polls/poll-config-modal";
import { PollV2 } from "@/components/features/polls/poll-block-v2";
import { PollConfigModalV2, PollConfigV2 } from "@/components/features/polls/poll-config-modal-v2";

// Import existing widgets system
import { availableWidgets, type AvailableWidget } from "@/components/dashboard/site-config/widgets";

// Custom component to replace the default Slash Menu
function CustomSlashMenu<T extends { title: string; subtext?: string; group?: string; icon?: any }>(
  props: SuggestionMenuProps<T>,
) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 max-h-80 overflow-y-auto min-w-72">
      {props.items.map((item, index) => {
        const isEnterprise = item.group === "Enterprise Widgets";
        
        return (
          <div
            key={index}
            className={`
              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
              ${props.selectedIndex === index 
                ? (isEnterprise 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                  : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                )
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }
              ${isEnterprise ? "opacity-60 cursor-not-allowed" : ""}
            `}
            onClick={() => {
              if (!isEnterprise) {
                props.onItemClick?.(item);
              }
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Icon */}
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  isEnterprise 
                    ? "text-gray-400 dark:text-gray-500" 
                    : "text-gray-900 dark:text-gray-100"
                }`}>
                  {item.title}
                </div>
                {item.subtext && (
                  <div className={`text-xs mt-0.5 ${
                    isEnterprise 
                      ? "text-gray-400 dark:text-gray-600" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {item.subtext}
                  </div>
                )}
              </div>
            </div>
            
            {/* Lock Icon for Enterprise */}
            {isEnterprise && (
              <div className="flex-shrink-0 ml-2">
                <Lock className="w-4 h-4" style={{ color: "#9ECBA4" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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

export interface CustomizePlusTabProps {
  initialContent?: any[];
  onContentSave?: (content: any[]) => void;
  onWidgetAdd?: (widget: AvailableWidget) => void;
  onWidgetEdit?: (widgetId: string, settings: any) => void;
}

// Individual Editor Component with Advanced Features
function SectionEditor({ 
  sectionName, 
  initialContent,
  onWidgetAdd,
  onWidgetEdit 
}: { 
  sectionName: string; 
  initialContent?: PartialBlock[];
  onWidgetAdd?: (widget: AvailableWidget) => void;
  onWidgetEdit?: (widgetId: string, settings: any) => void;
}) {
  // Create unique editor ID for isolation
  const editorId = `section-${sectionName.replace(/\s+/g, '-').toLowerCase()}`;

  // Poll modal states
  const [pollV3ModalOpen, setPollV3ModalOpen] = useState(false);
  const [pollV2ModalOpen, setPollV2ModalOpen] = useState(false);
  const [editingPollV3Config, setEditingPollV3Config] = useState<Partial<PollConfigV3> | null>(null);
  const [editingPollV2Config, setEditingPollV2Config] = useState<Partial<PollConfigV2> | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const editor = useCreateBlockNote({
    schema,
    sideMenuDetection: "editor",
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "",
      },
    ],
  });

  // Function to create widget block as a paragraph with widget info
  const createWidgetBlock = (widget: AvailableWidget) => {
    console.log('[SECTION WIDGET] Creating widget block', { widget, sectionName });
    
    insertOrUpdateBlock(editor, {
      type: "paragraph",
      content: `[Widget: ${widget.name}] - ${widget.description || 'Widget placeholder'}`,
    });
    
    if (onWidgetAdd) {
      onWidgetAdd(widget);
    }
    
    console.log('[SECTION WIDGET] Widget block created successfully');
  };

  // Function to create poll V3 block from config
  const createPollV3Block = (config: PollConfigV3) => {
    console.log('[SECTION POLL V3] Creating/updating poll block', { editingBlockId, config, sectionName });

    if (editingBlockId) {
      // Update existing block
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
      }
      setEditingBlockId(null);
      setEditingPollV3Config(null);
    } else {
      // Create new block
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
    }
  };

  // Function to create poll V2 block from config
  const createPollV2Block = (config: PollConfigV2) => {
    console.log('[SECTION POLL V2] Creating/updating poll block', { editingBlockId, config, sectionName });

    if (editingBlockId) {
      // Update existing block
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
      }
      setEditingBlockId(null);
      setEditingPollV2Config(null);
    } else {
      // Create new block
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
    }
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
    group: "Basic Widgets",
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
    group: "Basic Widgets",
    icon: <BarChart3 />,
  });



  return (
    <>
      <div className="min-h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{sectionName}</h3>
        </div>
        <BlockNoteView 
          key={editorId} // Unique key for proper isolation
          editor={editor} 
          className="flex-1"
          style={{ minHeight: "100px" }}
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
                ]}
              />
            )}
          />
          {/* Enhanced Slash Menu with Widget Support */}
          <SuggestionMenuController
            key={`slash-${editorId}`} // Unique key for isolation
            triggerCharacter={"/"}
            suggestionMenuComponent={CustomSlashMenu}
            getItems={async (query) => {
              // Get all default slash menu items
              const defaultItems = getDefaultReactSlashMenuItems(editor);
              
              // Helper function to create widget click handler
              const createWidgetHandler = (widgetId: string) => () => {
                const widget = availableWidgets.find(w => w.id === widgetId);
                if (widget) createWidgetBlock(widget);
              };

              // Create custom organized menu structure
              const organizedItems = [];

              // BASIC WIDGETS GROUP
              organizedItems.push(
                // Headings
                {
                  title: "Heading 1",
                  subtext: "Large heading",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "heading", props: { level: 1 } }),
                  aliases: ["h1", "heading1", "heading"],
                  group: "Basic Widgets",
                  icon: <Heading1 />,
                },
                {
                  title: "Heading 2", 
                  subtext: "Medium heading",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "heading", props: { level: 2 } }),
                  aliases: ["h2", "heading2"],
                  group: "Basic Widgets",
                  icon: <Heading2 />,
                },
                {
                  title: "Heading 3",
                  subtext: "Small heading", 
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "heading", props: { level: 3 } }),
                  aliases: ["h3", "heading3"],
                  group: "Basic Widgets",
                  icon: <Heading3 />,
                },
                // Basic text blocks
                {
                  title: "Paragraph",
                  subtext: "Plain text paragraph",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "paragraph" }),
                  aliases: ["p", "paragraph", "text"],
                  group: "Basic Widgets",
                  icon: <Type />,
                },
                {
                  title: "Bullet List",
                  subtext: "Unordered list with bullets",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "bulletListItem" }),
                  aliases: ["ul", "bulletlist", "unordered"],
                  group: "Basic Widgets", 
                  icon: <List />,
                },
                {
                  title: "Numbered List",
                  subtext: "Ordered list with numbers",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "numberedListItem" }),
                  aliases: ["ol", "numberedlist", "ordered"],
                  group: "Basic Widgets",
                  icon: <List />,
                },
                // Media
                {
                  title: "Image",
                  subtext: "Upload or embed images",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "image" }),
                  aliases: ["img", "image", "photo", "picture"],
                  group: "Basic Widgets",
                  icon: <Image />,
                },
                {
                  title: "Video", 
                  subtext: "Upload or embed videos",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "video" }),
                  aliases: ["video", "mp4", "movie"],
                  group: "Basic Widgets",
                  icon: <Video />,
                },
                {
                  title: "Audio",
                  subtext: "Upload or embed audio",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "audio" }),
                  aliases: ["audio", "sound", "music"],
                  group: "Basic Widgets",
                  icon: <Volume2 />,
                },
                {
                  title: "Emoji",
                  subtext: "Add emoji to your content",
                  onItemClick: () => insertOrUpdateBlock(editor, { type: "paragraph", content: "😀" }),
                  aliases: ["emoji", "smiley", "emoticon"],
                  group: "Basic Widgets",
                  icon: <Smile />,
                },
                // Custom basic widgets
                {
                  title: "Button",
                  subtext: "Add an interactive button",
                  onItemClick: createWidgetHandler("button"),
                  aliases: ["button", "btn", "link", "action"],
                  group: "Basic Widgets",
                  icon: <MousePointer />,
                },
                {
                  title: "Accordions",
                  subtext: "Collapsible content sections",
                  onItemClick: createWidgetHandler("accordions"),
                  aliases: ["accordion", "collapse", "expandable", "faq"],
                  group: "Basic Widgets", 
                  icon: <ChevronDown />,
                }
              );

                              // ADVANCE WIDGETS GROUP
              organizedItems.push(
                {
                  title: "Menu",
                  subtext: "Navigation menu component",
                  onItemClick: createWidgetHandler("menu"),
                  aliases: ["menu", "navigation", "nav"],
                  group: "Advance Widgets",
                  icon: <Menu />,
                },
                {
                  title: "Gallery",
                  subtext: "Image gallery display",
                  onItemClick: createWidgetHandler("gallery"),
                  aliases: ["gallery", "images", "photos"],
                  group: "Advance Widgets",
                  icon: <Images />,
                },
                {
                  title: "Hero Banner",
                  subtext: "Eye-catching hero section",
                  onItemClick: createWidgetHandler("hero-banner"),
                  aliases: ["hero", "banner", "header", "main"],
                  group: "Advance Widgets",
                  icon: <Monitor />,
                },
                {
                  title: "Announcement Banner",
                  subtext: "Important announcements",
                  onItemClick: createWidgetHandler("announcement-banner"),
                  aliases: ["announcement", "banner", "notice", "alert"],
                  group: "Advance Widgets",
                  icon: <Megaphone />,
                },
                {
                  title: "HTML Script",
                  subtext: "Custom HTML/JavaScript code",
                  onItemClick: createWidgetHandler("html-script"),
                  aliases: ["html", "script", "code", "custom"],
                  group: "Advance Widgets",
                  icon: <Code />,
                },
                {
                  title: "iFrame",
                  subtext: "Embed external content",
                  onItemClick: createWidgetHandler("iframe"),
                  aliases: ["iframe", "embed", "external"],
                  group: "Advance Widgets",
                  icon: <ExternalLink />,
                }
              );

              // LAYOUT GROUP
              organizedItems.push(
                {
                  title: "2 Column",
                  subtext: "Two column layout",
                  onItemClick: createWidgetHandler("2-column"),
                  aliases: ["2column", "two-column", "columns"],
                  group: "Layout",
                  icon: <Columns />,
                },
                {
                  title: "3 Column", 
                  subtext: "Three column layout",
                  onItemClick: createWidgetHandler("3-column"),
                  aliases: ["3column", "three-column", "columns"],
                  group: "Layout",
                  icon: <Columns />,
                },
                {
                  title: "4 Column",
                  subtext: "Four column layout",
                  onItemClick: createWidgetHandler("4-column"),
                  aliases: ["4column", "four-column", "columns"],
                  group: "Layout",
                  icon: <Columns />,
                }
              );

              // CONTENT BLOCK GROUP
              organizedItems.push(
                {
                  title: "Upcoming Events",
                  subtext: "Display upcoming events",
                  onItemClick: createWidgetHandler("upcoming-events"),
                  aliases: ["events", "upcoming", "calendar"],
                  group: "Content Block",
                  icon: <Calendar />,
                },
                {
                  title: "Calendar",
                  subtext: "Interactive calendar view",
                  onItemClick: createWidgetHandler("calendar"),
                  aliases: ["calendar", "dates", "schedule"],
                  group: "Content Block",
                  icon: <CalendarDays />,
                }
              );

              // EMBED GROUP
              organizedItems.push(
                {
                  title: "YouTube",
                  subtext: "Embed YouTube videos",
                  onItemClick: createWidgetHandler("youtube"),
                  aliases: ["youtube", "video", "yt"],
                  group: "Embed",
                  icon: <Play />,
                },
                {
                  title: "Typeform",
                  subtext: "Embed Typeform surveys",
                  onItemClick: createWidgetHandler("typeform"),
                  aliases: ["typeform", "form", "survey"],
                  group: "Embed",
                  icon: <FileText />,
                }
              );

              // ENTERPRISE WIDGETS GROUP
              organizedItems.push(
                {
                  title: "Advance Content Block",
                  subtext: "Advanced content management (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["advanced", "content", "block"],
                  group: "Enterprise Widgets",
                  icon: <Layers style={{ color: "#9ECBA4" }} />,
                },
                {
                  title: "Advance Space Header",
                  subtext: "Enhanced space header (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["header", "space", "advanced"],
                  group: "Enterprise Widgets",
                  icon: <Crown style={{ color: "#9ECBA4" }} />,
                },
                {
                  title: "Advance Leaderboard",
                  subtext: "Advanced leaderboard widget (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["leaderboard", "ranking", "advanced"],
                  group: "Enterprise Widgets",
                  icon: <Trophy style={{ color: "#9ECBA4" }} />,
                },
                {
                  title: "Advance Footer",
                  subtext: "Enhanced footer section (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["footer", "advanced"],
                  group: "Enterprise Widgets",
                  icon: <Anchor style={{ color: "#9ECBA4" }} />,
                },
                {
                  title: "Advance Top Navigation",
                  subtext: "Enhanced navigation bar (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["navigation", "navbar", "advanced"],
                  group: "Enterprise Widgets",
                  icon: <Navigation style={{ color: "#9ECBA4" }} />,
                },
                {
                  title: "Advance Sidebar",
                  subtext: "Enhanced sidebar component (Premium)",
                  onItemClick: () => {}, // Disabled
                  aliases: ["sidebar", "advanced"],
                  group: "Enterprise Widgets",
                  icon: <PanelLeft style={{ color: "#9ECBA4" }} />,
                }
              );

              // Add Poll items to Basic Widgets group
              organizedItems.push(
                insertPollV3(editor), 
                insertPollV2(editor)
              );

              // Return filtered items based on the query
              return filterSuggestionItems(organizedItems, query);
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

export function CustomizePlusTab({
  initialContent = [],
  onContentSave,
  onWidgetAdd,
  onWidgetEdit
}: CustomizePlusTabProps) {
  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto">
      {/* Top Section - Full Width */}
      <div className="min-h-32">
        <SectionEditor 
          sectionName="Header Section" 
          onWidgetAdd={onWidgetAdd}
          onWidgetEdit={onWidgetEdit}
        />
      </div>

      {/* Middle Section - 3 Columns */}
      <div className="min-h-80 grid grid-cols-12 gap-4">
        {/* Left Column - Fixed Width */}
        <div className="col-span-3">
          <SectionEditor 
            sectionName="Left Sidebar" 
            onWidgetAdd={onWidgetAdd}
            onWidgetEdit={onWidgetEdit}
          />
        </div>
        
        {/* Center Column - Fill Remaining Space */}
        <div className="col-span-6">
          <SectionEditor 
            sectionName="Main Content" 
            onWidgetAdd={onWidgetAdd}
            onWidgetEdit={onWidgetEdit}
          />
        </div>
        
        {/* Right Column - Fixed Width */}
        <div className="col-span-3">
          <SectionEditor 
            sectionName="Right Sidebar" 
            onWidgetAdd={onWidgetAdd}
            onWidgetEdit={onWidgetEdit}
          />
        </div>
      </div>

      {/* Bottom Section - Full Width */}
      <div className="min-h-64">
        <SectionEditor 
          sectionName="Footer Section" 
          onWidgetAdd={onWidgetAdd}
          onWidgetEdit={onWidgetEdit}
        />
      </div>
    </div>
  );
} 