import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Hash
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
  const [options, setOptions] = React.useState<string[]>(initialConfig?.options || ["Option 1", "Option 2"]);
  const [newOption, setNewOption] = React.useState("");
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

  const handleAddOption = () => {
    if (newOption.trim() && options.length < 10) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
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
    setOptions(["Option 1", "Option 2"]);
    setNewOption("");
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 p-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {initialConfig ? "Edit Poll" : "Create Poll"}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create an interactive poll for your community
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
                <ChevronRight className={cn("h-3 w-3 transition-transform", showSettings && "rotate-180")} />
              </Button>
            </div>
          </DialogHeader>

          {/* Content with Sliding Drawer */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <div className={cn(
              "flex-1 flex flex-col transition-all duration-300 ease-in-out",
              showSettings && "mr-96"
            )}>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Poll Question */}
                <div className="space-y-3">
                  <Label htmlFor="question" className="text-base font-medium text-gray-900 dark:text-white">
                    Poll Question
                  </Label>
                  <Input
                    id="question"
                    placeholder="What would you like to ask your community?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="text-base py-3 focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-700"
                  />
                </div>

                {/* Poll Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      Answer Options
                    </Label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {options.length}/10 options
                    </span>
                  </div>

                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="flex items-center gap-3 flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                          <div className={cn(
                            "w-4 h-4 border-2 border-gray-400 dark:border-gray-500 flex-shrink-0",
                            pollType === "single" ? "rounded-full" : "rounded-sm"
                          )} />
                          <Input
                            value={option}
                            onChange={(e) => handleUpdateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                          />
                        </div>
                        {options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Option */}
                  {options.length < 10 && (
                    <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <div className={cn(
                        "w-4 h-4 border-2 border-gray-400 dark:border-gray-500 flex-shrink-0",
                        pollType === "single" ? "rounded-full" : "rounded-sm"
                      )} />
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add a new option..."
                        className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddOption();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddOption}
                        disabled={!newOption.trim()}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 2 options required • {pollType === "single" ? "Single choice" : "Multiple choice"} poll
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isValid ? "Ready to create your poll" : "Complete the required fields"}
                </p>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
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
              <div className="flex-shrink-0 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Poll Settings
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure advanced options
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Drawer Content - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {/* General Settings */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
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
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
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
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
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