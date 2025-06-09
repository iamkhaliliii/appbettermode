import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  X, 
  BarChart3,
  Users,
  Trash2,
  Settings,
  Check,
  Clock,
  Shield,
  Eye,
  UserCheck,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Palette,
  Hash,
  ArrowLeftToLine
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import PropertyRow from site-config
import { PropertyRow } from "@/components/dashboard/site-config/PropertyRow";

// CSS classes for smooth animations
const drawerAnimationClasses = `
  .drawer-slide-enter {
    transform: translateX(100%);
  }
  .drawer-slide-enter-active {
    transform: translateX(0);
    transition: transform 300ms ease-in-out;
  }
  .drawer-slide-exit {
    transform: translateX(0);
  }
  .drawer-slide-exit-active {
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;
  }
  .main-content-shift {
    transition: margin-right 300ms ease-in-out;
  }
`;

export interface PollConfig {
  question: string;
  pollType: "single" | "multiple";
  options: string[];
  // Configuration settings
  maxVotesPerUser: number;
  allowedUsers: "all" | "members" | "staff";
  startDate?: string;
  endDate?: string;
  showResultsAfterVote: boolean;
  showResultsBeforeEnd: boolean;
  allowAddOptions: boolean;
}

export interface PollConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: PollConfig) => void;
  initialConfig?: Partial<PollConfig>;
}

const pollTypeOptions = [
  {
    value: "single",
    label: "Single Choice",
    description: "Users select one option",
    icon: BarChart3,
  },
  {
    value: "multiple", 
    label: "Multiple Choice",
    description: "Users select multiple options",
    icon: Users,
  }
];

const userPermissionOptions = [
  {
    value: "all",
    label: "All Users",
    description: "Anyone can vote",
    icon: Users,
  },
  {
    value: "members",
    label: "Members Only", 
    description: "Only registered members",
    icon: UserCheck,
  },
  {
    value: "staff",
    label: "Staff Only",
    description: "Only staff members",
    icon: Shield,
  }
];

export function PollConfigModal({ open, onOpenChange, onConfirm, initialConfig }: PollConfigModalProps) {
  const [question, setQuestion] = React.useState(initialConfig?.question || "");
  const [pollType, setPollType] = React.useState<"single" | "multiple">(initialConfig?.pollType || "single");
  const [options, setOptions] = React.useState<string[]>(
    initialConfig?.options || ["", ""] // Empty strings for new polls
  );
  const [showSettings, setShowSettings] = React.useState(false);

  // Configuration state
  const [maxVotesPerUser, setMaxVotesPerUser] = React.useState(initialConfig?.maxVotesPerUser || 1);
  const [allowedUsers, setAllowedUsers] = React.useState<"all" | "members" | "staff">(initialConfig?.allowedUsers || "all");
  const [startDate, setStartDate] = React.useState(initialConfig?.startDate || "");
  const [endDate, setEndDate] = React.useState(initialConfig?.endDate || "");
  const [showResultsAfterVote, setShowResultsAfterVote] = React.useState(initialConfig?.showResultsAfterVote ?? true);
  const [showResultsBeforeEnd, setShowResultsBeforeEnd] = React.useState(initialConfig?.showResultsBeforeEnd ?? false);
  const [allowAddOptions, setAllowAddOptions] = React.useState(initialConfig?.allowAddOptions ?? true);

  // PropertyRow state management
  const [editingField, setEditingField] = React.useState<string | null>(null);

  // Form validation
  const isValid = question.trim().length > 0 && options.length >= 2 && options.every(opt => opt.trim().length > 0);

  const handleAddOption = (optionText: string) => {
    if (optionText.trim() && options.length < 10) {
      setOptions([...options, optionText.trim()]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleConfirm = () => {
    if (isValid) {
      onConfirm({
        question: question.trim(),
        pollType,
        options: options.filter(opt => opt.trim()),
        maxVotesPerUser,
        allowedUsers,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        showResultsAfterVote,
        showResultsBeforeEnd,
        allowAddOptions,
      });
      handleReset();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setQuestion("");
    setPollType("single");
    setOptions(["", ""]);
    setMaxVotesPerUser(1);
    setAllowedUsers("all");
    setStartDate("");
    setEndDate("");
    setShowResultsAfterVote(true);
    setShowResultsBeforeEnd(false);
    setAllowAddOptions(true);
    setShowSettings(false);
    setEditingField(null);
  };

  // Update state when initialConfig changes
  React.useEffect(() => {
    if (initialConfig) {
      setQuestion(initialConfig.question || "");
      setPollType(initialConfig.pollType || "single");
      setOptions(initialConfig.options || ["", ""]);
      setMaxVotesPerUser(initialConfig.maxVotesPerUser || 1);
      setAllowedUsers(initialConfig.allowedUsers || "all");
      setStartDate(initialConfig.startDate || "");
      setEndDate(initialConfig.endDate || "");
      setShowResultsAfterVote(initialConfig.showResultsAfterVote ?? true);
      setShowResultsBeforeEnd(initialConfig.showResultsBeforeEnd ?? false);
      setAllowAddOptions(initialConfig.allowAddOptions ?? true);
    }
  }, [initialConfig]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  // Auto-adjust max votes when poll type changes
  React.useEffect(() => {
    if (pollType === "single") {
      setMaxVotesPerUser(1);
    }
  }, [pollType]);

  // PropertyRow handlers
  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <>
      <style>{drawerAnimationClasses}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0 [&>button]:hidden">
          {/* Header - Fixed */}
          <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="ml-2 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  {initialConfig ? "Edit Poll" : "Create Poll"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {initialConfig ? "Edit your poll settings and options" : "Create a new poll with questions and voting options"}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="h-4 w-4" />
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
          </DialogHeader>

          {/* Content with Sliding Drawer */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <div className={cn(
              "flex-1 flex flex-col main-content-shift",
              showSettings && "mr-96"
            )}>
              <div className="flex-1">
                {/* Content */}
                <div className="px-16 pt-8 pb-6 space-y-6">
                {/* Poll Question */}
                <div className="space-y-4">
                  <div className="space-y-0">
                    <Label htmlFor="question" className="text-sm font-medium text-gray-900 dark:text-white">
                      Poll Question
                    </Label>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      Ask a clear and engaging question for your community
                    </p>
                  </div>
                  <Input
                    id="question"
                    placeholder="What would you like to ask your community?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="py-4 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  />
                </div>

                {/* Poll Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Answer Options
                      </Label>
                      <p className="text-xs text-gray-400 dark:text-gray-400">
                        Add up to 10 options for users to choose from
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {options.length}/10
                    </span>
                  </div>

                  {/* Options List - Scrollable when many items */}
                  <div className={cn(
                    "space-y-2",
                    options.length > 6 && "max-h-64 overflow-y-auto pr-1"
                  )}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgb(156, 163, 175) transparent'
                  }}>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 group">
                        <div className="flex items-center gap-2 flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800">
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 min-w-[1.5rem] text-center">
                            {index + 1}.
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => handleUpdateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent text-sm"
                          />
                        </div>
                        {options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 w-8 h-8 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Option - Minimal */}
                  {options.length < 10 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Add empty option for user to fill in
                        setOptions([...options, ""]);
                      }}
                      className="w-full justify-start text-gray-600 dark:text-gray-400 border-dashed hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 h-9"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add option
                    </Button>
                  )}
                  
                  {/* Status Footer - Minimal */}
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {pollType === "single" ? "Single choice" : "Multiple choice"} • Min 2 options
                    </span>
                  </div>
                </div>
                </div>
              </div>

              {/* Footer Actions - Fixed */}
              <div className="flex-shrink-0 flex items-center justify-between p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isValid ? "Ready to create your poll" : "Complete the required fields"}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {initialConfig ? "Update Poll" : "Create Poll"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Drawer - Internal to Modal */}
            <div className={cn(
              "absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-10 flex flex-col",
              showSettings ? "translate-x-0" : "translate-x-full"
            )}>
              {/* Drawer Header - Fixed */}
              <div className="flex-shrink-0 flex flex-row items-center justify-between p-[0.68rem] border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Poll Settings
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ArrowLeftToLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Drawer Content - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {/* General Settings */}
                <div className="p-4 pt-4">
                  <h4 className="text-xs text-gray-500 dark:text-white mb-3 flex items-center gap-2">
                    General Settings
                  </h4>
                  <div>
                    <PropertyRow
                      label="Poll Type"
                      value={pollType}
                      fieldName="pollType"
                      type="select"
                      options={pollTypeOptions}
                      onValueChange={setPollType}
                      icon={Hash}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="How users can respond to the poll"
                    />

                    <PropertyRow
                      label="Max Votes per User"
                      value={maxVotesPerUser.toString()}
                      fieldName="maxVotesPerUser"
                      type="select"
                      options={pollType === "single" ? [
                        { value: "1", label: "1 vote", icon: BarChart3 }
                      ] : [
                        { value: "1", label: "1 vote", icon: BarChart3 },
                        { value: "2", label: "2 votes", icon: BarChart3 },
                        { value: "3", label: "3 votes", icon: BarChart3 },
                        { value: "5", label: "5 votes", icon: BarChart3 },
                        { value: "-1", label: "Unlimited", icon: BarChart3 }
                      ]}
                      onValueChange={(value) => setMaxVotesPerUser(parseInt(value))}
                      icon={BarChart3}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Maximum number of options each user can vote for"
                      disabled={pollType === "single"}
                    />

                    <PropertyRow
                      label="User Permissions"
                      value={allowedUsers}
                      fieldName="allowedUsers"
                      type="select"
                      options={userPermissionOptions}
                      onValueChange={setAllowedUsers}
                      icon={UserCheck}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Who is allowed to participate in this poll"
                    />
                  </div>
                </div>

                {/* Schedule Settings */}
                <div className="p-4 pt-0">
                  <h4 className="text-xs text-gray-500 dark:text-white mb-3 flex items-center gap-2">
                    Schedule
                  </h4>
                  <div>
                    <PropertyRow
                      label="Start Date"
                      value={startDate}
                      fieldName="startDate"
                      type="text"
                      onValueChange={setStartDate}
                      icon={Clock}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="When the poll becomes active (leave empty for immediate)"
                      placeholder="YYYY-MM-DD HH:MM"
                    />

                    <PropertyRow
                      label="End Date"
                      value={endDate}
                      fieldName="endDate"
                      type="text"
                      onValueChange={setEndDate}
                      icon={Clock}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="When the poll closes (leave empty for no end date)"
                      placeholder="YYYY-MM-DD HH:MM"
                    />
                  </div>
                </div>

                {/* Privacy & Results */}
                <div className="p-4 pt-0">
                  <h4 className="text-xs text-gray-500 dark:text-white mb-3 flex items-center gap-2">
                    Privacy & Results
                  </h4>
                  <div>
                    <PropertyRow
                      label="Show Results After Vote"
                      value={showResultsAfterVote}
                      fieldName="showResultsAfterVote"
                      type="checkbox"
                      onValueChange={setShowResultsAfterVote}
                      icon={Eye}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Users can see poll results immediately after voting"
                    />

                    <PropertyRow
                      label="Show Live Results"
                      value={showResultsBeforeEnd}
                      fieldName="showResultsBeforeEnd"
                      type="checkbox"
                      onValueChange={setShowResultsBeforeEnd}
                      icon={BarChart3}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Display real-time results to all users before poll ends"
                    />

                    <PropertyRow
                      label="Allow User Options"
                      value={allowAddOptions}
                      fieldName="allowAddOptions"
                      type="checkbox"
                      onValueChange={setAllowAddOptions}
                      icon={Plus}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Users can add new options to the poll"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 