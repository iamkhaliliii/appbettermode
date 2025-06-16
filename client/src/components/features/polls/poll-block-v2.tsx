import * as React from "react";
import { Button } from "@/components/ui/primitives";
import { 
  BarChart3, 
  Settings, 
  Trash2,
  Vote
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

  // Track last edit time to prevent double-clicks
  const lastEditTimeRef = React.useRef<number>(0);

  // Handle edit poll with debouncing
  const handleEditPoll = React.useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling and default behavior
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    const timeSinceLastEdit = now - lastEditTimeRef.current;
    
    // Debounce: ignore clicks within 1000ms of the last one  
    if (timeSinceLastEdit < 1000) {
      console.log(`[POLL-V2] Edit request debounced for block: ${block.id} (${timeSinceLastEdit}ms since last)`);
      return;
    }
    
    // Update last edit time immediately to prevent race conditions
    lastEditTimeRef.current = now;
    
    console.log(`[POLL-V2] Processing edit click for block: ${block.id}`);
    
    const eventDetail = {
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
    };
    
    console.log(`[POLL-V2] Dispatching edit poll event for block: ${block.id}`);
    
    // Dispatch the event immediately with no bubbling
    const editEvent = new CustomEvent('editPollV2', {
      detail: eventDetail,
      bubbles: false
    });
    window.dispatchEvent(editEvent);
  }, [block.id, props.question, props.pollType, options, props.maxVotesPerUser, props.allowedUsers, props.startDate, props.endDate, props.showResultsAfterVote, props.showResultsBeforeEnd, props.allowAddOptions]);

  // Handle delete poll with debouncing
  const handleDeletePoll = React.useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling and default behavior
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    const timeSinceLastEdit = now - lastEditTimeRef.current;
    
    // Debounce: ignore clicks within 1000ms of the last one  
    if (timeSinceLastEdit < 1000) {
      console.log(`[POLL-V2] Delete request debounced for block: ${block.id} (${timeSinceLastEdit}ms since last)`);
      return;
    }
    
    // Update last edit time immediately to prevent race conditions
    lastEditTimeRef.current = now;
    
    console.log(`[POLL-V2] Processing delete click for block: ${block.id}`);
    
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      console.log(`[POLL-V2] Dispatching delete poll event for block: ${block.id}`);
      
      // Dispatch the delete event
      const deleteEvent = new CustomEvent('deletePollV2', {
        detail: { blockId: block.id },
        bubbles: false
      });
      window.dispatchEvent(deleteEvent);
    }
  }, [block.id]);

  const shouldShowResults = showResults || props.showResultsBeforeEnd || pollState === "closed";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Vote className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Poll</span>
          {isEditingMode && (
            <span className="text-xs text-gray-500 dark:text-gray-400">• Preview</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditPoll}
            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeletePoll}
            className="h-7 w-7 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Question */}
        <div className="mb-3">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {props.question || "What's your question?"}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.length > 0 ? options.map((option: string, index: number) => {
            const voteCount = voteCounts[index] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isSelected = userVotes.includes(index);
            const isHighlighted = shouldShowResults && voteCount === maxVotes && maxVotes > 0;
            
            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-md border transition-colors duration-150",
                  isEditingMode 
                    ? "cursor-default border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" 
                    : "cursor-pointer",
                  !isEditingMode && isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700",
                  !isEditingMode && !isSelected && "hover:border-gray-300 dark:hover:border-gray-600",
                  !isEditingMode && isHighlighted && "border-green-500"
                )}
                onClick={() => !isEditingMode && handleVote(index)}
              >
                {/* Background bar for results */}
                {shouldShowResults && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-md transition-all duration-300",
                      isHighlighted
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-gray-100 dark:bg-gray-800"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-4 h-4 border-2 flex items-center justify-center",
                      props.pollType === "multiple" ? "rounded" : "rounded-full",
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}>
                      {isSelected && (
                        <div className={cn(
                          "bg-white",
                          props.pollType === "multiple" ? "w-1.5 h-1.5 rounded-sm" : "w-1.5 h-1.5 rounded-full"
                        )} />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {option}
                    </span>
                  </div>
                  
                  {shouldShowResults && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>{voteCount}</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-6 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">No options yet</p>
            </div>
          )}
        </div>

        {/* Submit button for multiple choice */}
        {props.pollType === "multiple" && !hasVoted && pollState === "open" && options.length > 0 && (
          <Button
            onClick={handleSubmitVote}
            disabled={isEditingMode || userVotes.length === 0}
            className={cn(
              "w-full mt-3 text-sm",
              isEditingMode 
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {isEditingMode ? "Preview Mode" : `Submit ${userVotes.length > 1 ? 'Votes' : 'Vote'}`}
          </Button>
        )}

        {/* Results footer */}
        {shouldShowResults && options.length > 0 && totalVotes > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
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