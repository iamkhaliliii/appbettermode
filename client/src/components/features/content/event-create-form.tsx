import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Textarea } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
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
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Globe,
  Building,
  Video,
  Hash,
  Search,
  Eye,
  Shield,
  Smartphone,
  Mail,
  Bell,
  Tag,
  UserCheck,
  X,
  Check,
  Youtube,
  Repeat,
  Save,
  ChevronUp,
  SquarePen
} from "lucide-react";
import { PropertyRow } from "@/components/dashboard/site-config";
import { EventPreviewXL } from "./add-content-dialog/content-types";
import { SchedulePopover } from "./schedule-popover";

const drawerAnimationClasses = `
  .main-content-shift {
    transition: margin-right 300ms ease-in-out;
  }
`;

export interface EventFormData {
  title: string;
  content: string;
  space: string;
  hosts: string[]; // Array of user IDs
  dateFrom: string;
  dateTo: string;
  timezone: string;
  repeat: any; // RepeatConfig type
  locationType: 'address' | 'virtual' | 'tbd';
  address: string;
  virtualUrl: string;
  virtualProvider: 'url' | 'youtube' | 'streamyard' | 'zoom' | 'meet';
  registrationProvider: 'bettermode' | 'luma' | 'eventbrite' | 'bevy' | 'other';
  registrationUrl: string;
  coverImage: string;
  tags: string[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  hideFromSearch: boolean;
  hideAddress: boolean;
  hideAttendees: boolean;
  capacity: number;
  sendInAppConfirmation: boolean;
  sendEmailConfirmation: boolean;
  sendInAppReminder: boolean;
  sendEmailReminder: boolean;
}

export interface EventCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

export function EventCreateForm({ open, onOpenChange, onSubmit, initialData }: EventCreateFormProps) {
  // Main form state
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [content, setContent] = React.useState<any[]>([]);
  const [space, setSpace] = React.useState(initialData?.space || "");
  const [hosts, setHosts] = React.useState<string[]>(initialData?.hosts || []);
  const [dateFrom, setDateFrom] = React.useState(initialData?.dateFrom || "");
  const [dateTo, setDateTo] = React.useState(initialData?.dateTo || "");
  const [timezone, setTimezone] = React.useState(initialData?.timezone || "UTC");
  const [repeat, setRepeat] = React.useState(initialData?.repeat || null);
  const [locationType, setLocationType] = React.useState<'address' | 'virtual' | 'tbd'>(initialData?.locationType || 'tbd');
  const [address, setAddress] = React.useState(initialData?.address || "");
  const [virtualUrl, setVirtualUrl] = React.useState(initialData?.virtualUrl || "");
  const [virtualProvider, setVirtualProvider] = React.useState<'url' | 'youtube' | 'streamyard' | 'zoom' | 'meet'>(initialData?.virtualProvider || 'url');
  const [registrationProvider, setRegistrationProvider] = React.useState<'bettermode' | 'luma' | 'eventbrite' | 'bevy' | 'other'>(initialData?.registrationProvider || 'bettermode');
  const [registrationUrl, setRegistrationUrl] = React.useState(initialData?.registrationUrl || "");
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [metaTitle, setMetaTitle] = React.useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = React.useState(initialData?.metaDescription || "");
  const [hideFromSearch, setHideFromSearch] = React.useState(initialData?.hideFromSearch || false);
  const [hideAddress, setHideAddress] = React.useState(initialData?.hideAddress || false);
  const [hideAttendees, setHideAttendees] = React.useState(initialData?.hideAttendees || false);
  const [capacity, setCapacity] = React.useState(initialData?.capacity || 0);
  const [sendInAppConfirmation, setSendInAppConfirmation] = React.useState(initialData?.sendInAppConfirmation || true);
  const [sendEmailConfirmation, setSendEmailConfirmation] = React.useState(initialData?.sendEmailConfirmation || true);
  const [sendInAppReminder, setSendInAppReminder] = React.useState(initialData?.sendInAppReminder || true);
  const [sendEmailReminder, setSendEmailReminder] = React.useState(initialData?.sendEmailReminder || true);

  // UI state for PropertyRow editing
  const [editingField, setEditingField] = React.useState<string | null>(null);

  // Status and scheduling state
  const [currentStatus, setCurrentStatus] = React.useState<string>("Draft");
  const [isSchedulePopoverOpen, setIsSchedulePopoverOpen] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
    if (!open) return;

    const handleEditPollV3 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const { blockId, currentConfig } = event.detail;
      console.log(`[V3] Processing edit event for block: ${blockId}`);

      if (pollV3ModalOpen || pollV2ModalOpen) {
        console.log(`[V3] Modal already open, ignoring edit event`);
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
  }, [open, pollV3ModalOpen, pollV2ModalOpen]);

  // Listen for poll V2 edit events
  React.useEffect(() => {
    if (!open) return;

    const handleEditPollV2 = (event: CustomEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const { blockId, currentConfig } = event.detail;
      console.log(`[V2] Processing edit event for block: ${blockId}`);

      if (pollV3ModalOpen || pollV2ModalOpen) {
        console.log(`[V2] Modal already open, ignoring edit event`);
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
  }, [open, pollV3ModalOpen, pollV2ModalOpen]);

  // Listen for poll delete events
  React.useEffect(() => {
    if (!open) return;

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
  }, [open, editor]);

  // Field editing handlers
  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingField(null);
    }
  };

  // Validation
  const isValid = title.trim().length > 0 && dateFrom.length > 0;

  const handleConfirm = () => {
    if (isValid) {
      onSubmit({
        title: title.trim(),
        content: JSON.stringify(content),
        space,
        hosts,
        dateFrom,
        dateTo,
        timezone,
        repeat,
        locationType,
        address,
        virtualUrl,
        virtualProvider,
        registrationProvider,
        registrationUrl,
        coverImage: '',
        tags,
        slug,
        metaTitle,
        metaDescription,
        canonicalUrl: '',
        ogImage: '',
        hideFromSearch,
        hideAddress,
        hideAttendees,
        capacity,
        sendInAppConfirmation,
        sendEmailConfirmation,
        sendInAppReminder,
        sendEmailReminder,
      });
      onOpenChange(false);
    }
  };

  // Handle draft saving
  const handleSaveDraft = () => {
    console.log("Save event draft:", { title, content });
    // TODO: Implement save draft functionality
  };

  // Handle schedule confirmation
  const handleScheduleConfirm = (scheduledDateTime: Date) => {
    setScheduledDate(scheduledDateTime);
    setCurrentStatus("Schedule");
    console.log("Event scheduled for:", scheduledDateTime.toLocaleString());
  };

  // Handle schedule removal
  const handleRemoveSchedule = () => {
    setScheduledDate(null);
    setCurrentStatus("Draft");
    console.log("Schedule removed");
  };

  // Handle schedule editing
  const handleEditSchedule = (newScheduledDateTime: Date) => {
    setScheduledDate(newScheduledDateTime);
    console.log("Schedule updated to:", newScheduledDateTime.toLocaleString());
  };

  // Handle publish
  const handlePublish = () => {
    console.log("Publishing new event:", { title, content });
    alert(`Published new event: "${title}"`);
    onOpenChange(false);
  };

  // Handle content change from BlockNote editor
  const handleContentChange = () => {
    setContent(editor.document as any);
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

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Options for dropdowns
  const spaceOptions = [
    { value: 'general', label: 'General' },
    { value: 'events', label: 'Events' },
    { value: 'announcements', label: 'Announcements' },
  ];



  const locationTypeOptions = [
    { 
      value: 'address', 
      label: 'Physical Address',
      description: 'Event will be held at a specific physical location',
      icon: Building
    },
    { 
      value: 'virtual', 
      label: 'Virtual Event',
      description: 'Online event accessible via internet link',
      icon: Video
    },
    { 
      value: 'tbd', 
      label: 'To Be Determined',
      description: 'Location will be announced later',
      icon: MapPin
    },
  ];

  const virtualProviderOptions = [
    { 
      value: 'url', 
      label: 'Custom URL',
      description: 'Any custom meeting or streaming link',
      icon: Globe
    },
    { 
      value: 'zoom', 
      label: 'Zoom',
      description: 'Zoom video conferencing platform',
      icon: Video
    },
    { 
      value: 'meet', 
      label: 'Google Meet',
      description: 'Google Meet video calls',
      icon: Video
    },
    { 
      value: 'youtube', 
      label: 'YouTube Live',
      description: 'YouTube live streaming platform',
      icon: Youtube
    },
    { 
      value: 'streamyard', 
      label: 'StreamYard',
      description: 'Professional live streaming studio',
      icon: Video
    },
  ];

  const registrationProviderOptions = [
    { 
      value: 'bettermode', 
      label: 'Bettermode',
      description: 'Built-in registration system',
      icon: Users
    },
    { 
      value: 'luma', 
      label: 'Luma',
      description: 'Event discovery and ticketing platform',
      icon: Calendar
    },
    { 
      value: 'eventbrite', 
      label: 'Eventbrite',
      description: 'Popular event ticketing service',
      icon: Calendar
    },
    { 
      value: 'bevy', 
      label: 'Bevy',
      description: 'Community event platform',
      icon: Users
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'External registration platform',
      icon: Globe
    },
  ];

  return (
    <>
      <style>{drawerAnimationClasses}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] gap-0 max-w-4xl h-[80vh] overflow-hidden flex flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0">
          {/* Left Side - Content */}
          <div className="w-2/4 flex flex-col h-full">
            {/* Header - Fixed */}
            <DialogHeader className="flex-shrink-0 px-7 pt-6 pb-6">
              <div>
                <DialogTitle className="text-sm text-gray-500 dark:text-gray-400">
                  Add new event
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Content Area - Full width without sidebar */}
            <div className="flex-1 overflow-y-auto relative pb-20 scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
              <div className="">
                {/* Event Title */}
                <div className="px-8 pb-2">
                  <Input
                    id="title"
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-semibold border-0 border-transparent bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-0 focus:border-transparent focus:outline-none outline-none px-0 py-2 placeholder:text-gray-300 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 hover:bg-transparent focus:bg-transparent shadow-none focus:shadow-none ring-0 ring-offset-0 [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:outline-none [&:focus]:border-0 [&:focus]:shadow-none"
                    style={{
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.border = 'none';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                                 <div className="px-6 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <PropertyRow
                          label="Start Date & Time"
                          value={dateFrom}
                          fieldName="dateFrom"
                          type="datetime"
                          onValueChange={setDateFrom}
                          icon={Clock}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="When the event starts"
                        />

                        <PropertyRow
                          label="End Date & Time"
                          value={dateTo}
                          fieldName="dateTo"
                          type="datetime"
                          onValueChange={setDateTo}
                          icon={Clock}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="When the event ends"
                        />

                        <PropertyRow
                          label="Repeat"
                          value={repeat}
                          fieldName="repeat"
                          type="repeat"
                          onValueChange={setRepeat}
                          icon={Repeat}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="How often this event repeats"
                          startDate={dateFrom}
                        />

                        <PropertyRow
                          label="Timezone"
                          value={timezone}
                          fieldName="timezone"
                          type="timezone"
                          onValueChange={setTimezone}
                          icon={Globe}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="Event timezone"
                        />

                        <PropertyRow
                          label="Hosts"
                          value={hosts}
                          fieldName="hosts"
                          type="users"
                          onValueChange={setHosts}
                          icon={UserCheck}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="Select event hosts"
                        />
                      <PropertyRow
                        label="Location Type"
                        value={locationType}
                        fieldName="locationType"
                        type="select"
                        options={locationTypeOptions}
                        onValueChange={setLocationType as any}
                        icon={MapPin}
                        editingField={editingField}
                        onFieldClick={handleFieldClick}
                        onFieldBlur={handleFieldBlur}
                        onKeyDown={handleKeyDown}
                        description="Where the event takes place"
                      />

                      {locationType === 'address' && (
                        <PropertyRow
                          label="Address"
                          value={address}
                          fieldName="address"
                          type="text"
                          onValueChange={setAddress}
                          icon={Building}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="Physical address of the event"
                          placeholder="Enter full address"
                          isChild={true}
                        />
                      )}

                      {locationType === 'virtual' && (
                        <>
                          <PropertyRow
                            label="Virtual Provider"
                            value={virtualProvider}
                            fieldName="virtualProvider"
                            type="select"
                            options={virtualProviderOptions}
                            onValueChange={setVirtualProvider as any}
                            icon={Video}
                            editingField={editingField}
                            onFieldClick={handleFieldClick}
                            onFieldBlur={handleFieldBlur}
                            onKeyDown={handleKeyDown}
                            description="Virtual meeting platform"
                            isChild={true}
                          />

                          <PropertyRow
                            label="Meeting URL"
                            value={virtualUrl}
                            fieldName="virtualUrl"
                            type="text"
                            onValueChange={setVirtualUrl}
                            icon={Globe}
                            editingField={editingField}
                            onFieldClick={handleFieldClick}
                            onFieldBlur={handleFieldBlur}
                            onKeyDown={handleKeyDown}
                            description="Link to join the virtual event"
                            placeholder="https://..."
                            isChild={true}
                          />
                        </>
                      )}
                      <PropertyRow
                        label="Registration Provider"
                        value={registrationProvider}
                        fieldName="registrationProvider"
                        type="select"
                        options={registrationProviderOptions}
                        onValueChange={setRegistrationProvider as any}
                        icon={Users}
                        editingField={editingField}
                        onFieldClick={handleFieldClick}
                        onFieldBlur={handleFieldBlur}
                        onKeyDown={handleKeyDown}
                        description="How people register for the event"
                      />

                      {registrationProvider !== 'bettermode' && (
                        <PropertyRow
                          label="Registration URL"
                          value={registrationUrl}
                          fieldName="registrationUrl"
                          type="text"
                          onValueChange={setRegistrationUrl}
                          icon={Globe}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="External registration page URL"
                          placeholder="https://..."
                          isChild={true}
                        />
                      )}

                      <PropertyRow
                        label="Capacity"
                        value={capacity}
                        fieldName="capacity"
                        type="number"
                        onValueChange={setCapacity}
                        icon={Users}
                        editingField={editingField}
                        onFieldClick={handleFieldClick}
                        onFieldBlur={handleFieldBlur}
                        onKeyDown={handleKeyDown}
                        description="Maximum number of attendees (0 = unlimited)"
                        placeholder="0"
                        min={0}
                        max={10000}
                        step={1}
                      />
                                              <PropertyRow
                          label="Event Tags"
                          value={tags}
                          fieldName="tags"
                          type="tags"
                          onValueChange={setTags}
                          icon={Tag}
                          editingField={editingField}
                          onFieldClick={handleFieldClick}
                          onFieldBlur={handleFieldBlur}
                          onKeyDown={handleKeyDown}
                          description="Tags for categorizing this event"
                        />
                    </div>
                  </div>

                </div>
                {/* Advanced Settings Accordion */}
                <div className="px-8 space-y-3 pt-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-settings" className="pb-2 border-gray-100 dark:border-gray-700">
                      <AccordionTrigger className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 px-0">
                        Advanced Settings
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-2">
                        {/* SEO Settings */}
                        <div className="space-y-3">
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            SEO & URL
                          </h4>
                          <div>
                            <PropertyRow
                              label="URL Slug"
                              value={slug}
                              fieldName="slug"
                              type="text"
                              onValueChange={setSlug}
                              icon={Hash}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Custom URL for this event"
                              placeholder="my-awesome-event"
                            />

                            <PropertyRow
                              label="Meta Title"
                              value={metaTitle}
                              fieldName="metaTitle"
                              type="text"
                              onValueChange={setMetaTitle}
                              icon={Search}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="SEO title for search engines"
                              placeholder="SEO title"
                            />

                            <PropertyRow
                              label="Meta Description"
                              value={metaDescription}
                              fieldName="metaDescription"
                              type="text"
                              onValueChange={setMetaDescription}
                              icon={Search}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="SEO description for search engines"
                              placeholder="SEO description"
                            />

                            <PropertyRow
                              label="Hide from Search"
                              value={hideFromSearch}
                              fieldName="hideFromSearch"
                              type="checkbox"
                              onValueChange={setHideFromSearch}
                              icon={Eye}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Hide this event from search results"
                            />
                          </div>
                        </div>

                        {/* Privacy Settings */}
                        <div className="space-y-3">
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            Privacy Settings
                          </h4>
                          <div>
                            <PropertyRow
                              label="Hide Address"
                              value={hideAddress}
                              fieldName="hideAddress"
                              type="checkbox"
                              onValueChange={setHideAddress}
                              icon={Shield}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Hide address from non-attendees"
                            />

                            <PropertyRow
                              label="Hide Attendees"
                              value={hideAttendees}
                              fieldName="hideAttendees"
                              type="checkbox"
                              onValueChange={setHideAttendees}
                              icon={Eye}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Hide attendees list from other users"
                            />
                          </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="space-y-3">
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            Notifications
                          </h4>
                          <div>
                            <PropertyRow
                              label="In-App Confirmation"
                              value={sendInAppConfirmation}
                              fieldName="sendInAppConfirmation"
                              type="checkbox"
                              onValueChange={setSendInAppConfirmation}
                              icon={Smartphone}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Send in-app notification upon registration"
                            />

                            <PropertyRow
                              label="Email Confirmation"
                              value={sendEmailConfirmation}
                              fieldName="sendEmailConfirmation"
                              type="checkbox"
                              onValueChange={setSendEmailConfirmation}
                              icon={Mail}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Send email confirmation upon registration"
                            />

                            <PropertyRow
                              label="In-App Reminder"
                              value={sendInAppReminder}
                              fieldName="sendInAppReminder"
                              type="checkbox"
                              onValueChange={setSendInAppReminder}
                              icon={Bell}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Send in-app reminder before event"
                            />

                            <PropertyRow
                              label="Email Reminder"
                              value={sendEmailReminder}
                              fieldName="sendEmailReminder"
                              type="checkbox"
                              onValueChange={setSendEmailReminder}
                              icon={Mail}
                              editingField={editingField}
                              onFieldClick={handleFieldClick}
                              onFieldBlur={handleFieldBlur}
                              onKeyDown={handleKeyDown}
                              description="Send email reminder before event"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>


                {/* Event Content */}
                <div className="mt-6">
                  {/* BlockNote Rich Text Editor with Poll Support */}
                  <div className="border-none overflow-hidden ">
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
                          defaultItems.splice(lastBasicBlockIndex + 1, 0, insertPollV3(editor));
                          defaultItems.splice(lastBasicBlockIndex + 2, 0, insertPollV2(editor));

                          // Return filtered items based on the query
                          return filterSuggestionItems(defaultItems, query);
                        }}
                      />
                    </BlockNoteView>
                  </div>
                </div>


              </div>
            </div>

            {/* Footer Actions - Fixed and Full Width */}
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
              
              {/* Normal Footer */}
              <div className="flex items-center justify-end p-6 pt-4">
                
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-7 px-2.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  
                  <div className="flex items-center">
                    <Button
                      onClick={scheduledDate ? handleConfirm : handlePublish}
                      disabled={!isValid}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 h-7 text-xs rounded-r-none"
                    >
                      {scheduledDate ? 'Schedule Event' : 'Create Event'}
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
                          disabled={!isValid}
                          className="bg-green-600 hover:bg-green-700 text-white px-1.5 h-7 rounded-l-none border-l border-green-500"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="top" className="w-48">
                        <DropdownMenuItem onClick={handleSaveDraft} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save draft
                          <span className="ml-auto text-xs text-gray-400">⌘D</span>
                        </DropdownMenuItem>
                        {!scheduledDate && (
                          <SchedulePopover
                            onConfirm={handleScheduleConfirm}
                            title="Schedule Event"
                            side="top"
                            align="end"
                            onOpenChange={setIsSchedulePopoverOpen}
                            keepDropdownOpen={true}
                          >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Schedule event
                              <span className="ml-auto text-xs text-gray-400">⌘S</span>
                            </DropdownMenuItem>
                          </SchedulePopover>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Event Card Preview */}
          <div className="w-1/2 h-full bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
            <div className="w-[120%] h-[120%] bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5 backdrop-blur-sm rounded-xl border border-emerald-200/30 dark:border-emerald-800/20 relative">
              {/* Header */}
              {/* Framed preview area */}
              <div className="absolute bottom-0 right-0 left-16 top-16 rounded-xl border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-4 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]">
                <div className="w-full">
                  <EventPreviewXL />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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