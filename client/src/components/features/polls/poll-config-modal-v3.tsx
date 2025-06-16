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
import { Label } from "@/components/ui/primitives";
import { Textarea } from "@/components/ui/primitives";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives";
import { 
  Plus, 
  X, 
  BarChart3,
  Users,
  Trash2,
  Check,
  Clock,
  Shield,
  Eye,
  UserCheck,
  Calendar,
  Hash,
  Settings,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PollConfigV3 {
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

export interface PollConfigModalV3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: PollConfigV3) => void;
  initialConfig?: Partial<PollConfigV3>;
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

export function PollConfigModalV3({ open, onOpenChange, onConfirm, initialConfig }: PollConfigModalV3Props) {
  const [activeTab, setActiveTab] = React.useState<"main" | "settings">("main");
  const [question, setQuestion] = React.useState(initialConfig?.question || "");
  const [pollType, setPollType] = React.useState<"single" | "multiple">(initialConfig?.pollType || "single");
  const [options, setOptions] = React.useState<string[]>(
    initialConfig?.options || ["", ""] // Empty strings for new polls
  );

  // Configuration state
  const [maxVotesPerUser, setMaxVotesPerUser] = React.useState(initialConfig?.maxVotesPerUser || 1);
  const [allowedUsers, setAllowedUsers] = React.useState<"all" | "members" | "staff">(initialConfig?.allowedUsers || "all");
  const [startDate, setStartDate] = React.useState(initialConfig?.startDate || "");
  const [endDate, setEndDate] = React.useState(initialConfig?.endDate || "");
  const [showResultsAfterVote, setShowResultsAfterVote] = React.useState(initialConfig?.showResultsAfterVote ?? true);
  const [showResultsBeforeEnd, setShowResultsBeforeEnd] = React.useState(initialConfig?.showResultsBeforeEnd ?? false);
  const [allowAddOptions, setAllowAddOptions] = React.useState(initialConfig?.allowAddOptions ?? true);

  // Form validation
  const isValid = question.trim().length > 0 && options.length >= 2 && options.every(opt => opt.trim().length > 0);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
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
    setActiveTab("main");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0 [&>button]:hidden">
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                {initialConfig ? "Edit Poll" : "Create Poll"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                {initialConfig ? "Edit your poll settings and options" : "Create a new poll with questions and voting options"}
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "main"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
              onClick={() => setActiveTab("main")}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              Main
            </button>
            <button
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Settings
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "main" ? (
            <div className="p-6 space-y-6">
              {/* Poll Question */}
              <div className="space-y-3">
                <Label htmlFor="question" className="text-sm font-medium text-gray-900 dark:text-white">
                  Poll Question
                </Label>
                <Textarea
                  id="question"
                  placeholder="What would you like to ask your community?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ask a clear and engaging question for your community
                </p>
              </div>

              {/* Poll Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900 dark:text-white">
                  Poll Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {pollTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "p-4 border-2 rounded-lg cursor-pointer transition-all",
                        pollType === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      onClick={() => setPollType(option.value as "single" | "multiple")}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Poll Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">
                    Answer Options
                  </Label>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {options.length}/10
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex items-center gap-3 flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800">
                        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 min-w-[2rem]">
                          {index + 1}.
                        </span>
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
                          size="sm"
                          onClick={() => handleRemoveOption(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Option */}
                {options.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={handleAddOption}
                    className="w-full justify-start text-gray-600 dark:text-gray-400 border-dashed hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 py-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add another option
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Voting Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Voting Settings
                </h3>
                
                {/* Max Votes per User */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">
                    Maximum votes per user
                  </Label>
                  <Select
                    value={maxVotesPerUser.toString()}
                    onValueChange={(value) => setMaxVotesPerUser(parseInt(value))}
                    disabled={pollType === "single"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pollType === "single" ? (
                        <SelectItem value="1">1 vote</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="1">1 vote</SelectItem>
                          <SelectItem value="2">2 votes</SelectItem>
                          <SelectItem value="3">3 votes</SelectItem>
                          <SelectItem value="5">5 votes</SelectItem>
                          <SelectItem value="-1">Unlimited</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum number of options each user can vote for
                  </p>
                </div>

                {/* User Permissions */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">
                    Who can vote
                  </Label>
                  <div className="space-y-2">
                    {userPermissionOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all",
                          allowedUsers === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                        onClick={() => setAllowedUsers(option.value as "all" | "members" | "staff")}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {option.label}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Schedule
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      Start Date
                    </Label>
                    <Input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      End Date
                    </Label>
                    <Input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Privacy & Results
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Show results after vote
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Users can see results immediately after voting
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showResultsAfterVote}
                      onChange={(e) => setShowResultsAfterVote(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Show live results
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Display real-time results before poll ends
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showResultsBeforeEnd}
                      onChange={(e) => setShowResultsBeforeEnd(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Allow user options
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Users can add new options to the poll
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowAddOptions}
                      onChange={(e) => setAllowAddOptions(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
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
      </DialogContent>
    </Dialog>
  );
} 