import * as React from "react";
import { Button } from "@/components/ui/primitives";
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Trash2,
  Timer,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createReactBlockSpec } from "@blocknote/react";

// Poll state types
type PollState = "scheduled" | "open" | "voted" | "closed";

interface PollVote {
  optionIndex: number;
  userId: string;
  timestamp: number;
}

interface PollProps {
  question: string;
  pollType: "single" | "multiple";
  optionsJson: string;
  votesJson: string;
  maxVotesPerUser: number;
  allowedUsers: "all" | "members" | "staff";
  startDate?: string;
  endDate?: string;
  showResultsAfterVote: boolean;
  showResultsBeforeEnd: boolean;
  allowAddOptions: boolean;
  // V2 specific props
  state?: PollState;
  totalParticipants?: number;
}

function PollBlockV2({ block }: { block: any }) {
  const [votes, setVotes] = React.useState<PollVote[]>([]);
  const [userVotes, setUserVotes] = React.useState<number[]>([]);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  const props = block.props as PollProps;
  const options = JSON.parse(props.optionsJson || "[]");
  const votesData = JSON.parse(props.votesJson || "{}");
  
  // Check if we're in editing mode (composer) by looking for BlockNote editor context
  const isEditingMode = true; // In composer, always disable voting
  
  // Calculate poll state
  const getPollState = (): PollState => {
    if (props.state) return props.state;
    
    const now = new Date();
    const startDate = props.startDate ? new Date(props.startDate) : null;
    const endDate = props.endDate ? new Date(props.endDate) : null;
    
    if (startDate && now < startDate) return "scheduled";
    if (endDate && now > endDate) return "closed";
    if (hasVoted) return "voted";
    return "open";
  };

  const pollState = getPollState();

  // Calculate vote counts
  const getVoteCounts = () => {
    const counts: { [key: number]: number } = {};
    options.forEach((_: string, index: number) => {
      counts[index] = votesData[index] || 0;
    });
    return counts;
  };

  const voteCounts = getVoteCounts();
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  const maxVotes = Math.max(...Object.values(voteCounts));

  // Handle voting
  const handleVote = (optionIndex: number) => {
    // Disable voting in editing mode (composer)
    if (isEditingMode) return;
    
    if (pollState !== "open") return;

    if (props.pollType === "single") {
      setUserVotes([optionIndex]);
      setHasVoted(true);
      if (props.showResultsAfterVote) {
        setShowResults(true);
      }
    } else {
      const newVotes = userVotes.includes(optionIndex)
        ? userVotes.filter(v => v !== optionIndex)
        : [...userVotes, optionIndex];
      
      if (newVotes.length <= props.maxVotesPerUser || props.maxVotesPerUser === -1) {
        setUserVotes(newVotes);
      }
    }
  };

  const handleSubmitVote = () => {
    // Disable voting in editing mode (composer)
    if (isEditingMode) return;
    
    if (userVotes.length === 0) return;
    
    setHasVoted(true);
    if (props.showResultsAfterVote) {
      setShowResults(true);
    }
    
    // TODO: Submit votes to backend
    console.log("Submitting votes:", userVotes);
  };

  // Handle edit poll
  const handleEditPoll = () => {
    console.log("Editing poll V2 block:", block.id);
    const editEvent = new CustomEvent('editPollV2', {
      detail: {
        blockId: block.id,
        currentConfig: {
          question: props.question,
          pollType: props.pollType,
          options: options,
          maxVotesPerUser: props.maxVotesPerUser,
          allowedUsers: props.allowedUsers,
          startDate: props.startDate,
          endDate: props.endDate,
          showResultsAfterVote: props.showResultsAfterVote,
          showResultsBeforeEnd: props.showResultsBeforeEnd,
          allowAddOptions: props.allowAddOptions,
        }
      }
    });
    window.dispatchEvent(editEvent);
  };

  // Handle delete poll
  const handleDeletePoll = () => {
    console.log("Deleting poll V2 block:", block.id);
    const deleteEvent = new CustomEvent('deletePollV2', {
      detail: { blockId: block.id }
    });
    window.dispatchEvent(deleteEvent);
  };

  const getStateIcon = () => {
    switch (pollState) {
      case "scheduled":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "open":
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case "voted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStateText = () => {
    switch (pollState) {
      case "scheduled":
        return `Starts ${props.startDate ? new Date(props.startDate).toLocaleDateString() : "soon"}`;
      case "open":
        return "Open for voting";
      case "voted":
        return "You voted";
      case "closed":
        return `Closed ${props.endDate ? new Date(props.endDate).toLocaleDateString() : ""}`;
      default:
        return "Open for voting";
    }
  };

  const shouldShowResults = showResults || props.showResultsBeforeEnd || pollState === "closed";

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {getStateIcon()}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Poll V2 {isEditingMode && <span className="text-xs text-gray-500">• Preview</span>}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditPoll}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeletePoll}
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Question */}
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {props.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option: string, index: number) => {
            const voteCount = voteCounts[index] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isSelected = userVotes.includes(index);
            const isHighlighted = shouldShowResults && voteCount === maxVotes && maxVotes > 0;
            
            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-lg border-2 transition-all duration-200",
                  isEditingMode 
                    ? "cursor-default border-gray-200 dark:border-gray-700" 
                    : "cursor-pointer",
                  !isEditingMode && isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700",
                  !isEditingMode && !isSelected && "hover:border-gray-300 dark:hover:border-gray-600",
                  !isEditingMode && isHighlighted && "ring-2 ring-green-500 ring-opacity-50",
                  pollState === "scheduled" && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isEditingMode && handleVote(index)}
              >
                {/* Background bar for results */}
                {shouldShowResults && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-500",
                      isHighlighted
                        ? "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600",
                      props.pollType === "multiple" && "rounded-sm"
                    )}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {option}
                    </span>
                  </div>
                  
                  {shouldShowResults && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {voteCount}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit button for multiple choice */}
        {props.pollType === "multiple" && !hasVoted && pollState === "open" && (
          <Button
            onClick={handleSubmitVote}
            disabled={isEditingMode || userVotes.length === 0}
            className={cn(
              "w-full mt-4 text-white",
              isEditingMode 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            Submit Vote{userVotes.length > 1 ? 's' : ''}
            {userVotes.length > 0 && (
              <span className="ml-2 text-xs">
                ({userVotes.length}/{props.maxVotesPerUser === -1 ? '∞' : props.maxVotesPerUser})
              </span>
            )}
          </Button>
        )}

        {/* Results footer */}
        {shouldShowResults && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Total votes: {totalVotes}</span>
              {props.totalParticipants && (
                <span>{props.totalParticipants} participants</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the V2 poll block spec
export const PollV2 = createReactBlockSpec(
  {
    type: "pollV2",
    propSchema: {
      question: { default: "" },
      pollType: { default: "single" },
      optionsJson: { default: "[]" },
      votesJson: { default: "{}" },
      maxVotesPerUser: { default: 1 },
      allowedUsers: { default: "all" },
      startDate: { default: "" },
      endDate: { default: "" },
      showResultsAfterVote: { default: true },
      showResultsBeforeEnd: { default: false },
      allowAddOptions: { default: true },
      state: { default: "open" },
      totalParticipants: { default: 0 },
    },
    content: "none",
  },
  {
    render: (props) => <PollBlockV2 block={props.block} />,
  }
); 