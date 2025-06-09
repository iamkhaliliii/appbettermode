import * as React from "react";
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Button } from "@/components/ui/primitives";
import { 
  BarChart3, 
  Users,
  Edit,
  Clock,
  User,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import "./poll-block.css";

// Poll types that users can choose from
export const pollTypes = [
  {
    title: "Single Choice",
    value: "single",
    icon: BarChart3,
    description: "Users can select one option"
  },
  {
    title: "Multiple Choice", 
    value: "multiple",
    icon: Users,
    description: "Users can select multiple options"
  }
] as const;

// Helper functions for JSON parsing
const parseOptions = (optionsJson: string): string[] => {
  try {
    const parsed = JSON.parse(optionsJson);
    return Array.isArray(parsed) ? parsed : ["Option 1", "Option 2"];
  } catch {
    return ["Option 1", "Option 2"];
  }
};

const parseVotes = (votesJson: string): Record<string, number | number[]> => {
  try {
    const parsed = JSON.parse(votesJson);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const parseConfigValue = (value: any, defaultValue: any) => {
  return value !== undefined ? value : defaultValue;
};

// Poll component
const PollComponent = (props: any) => {
  const { block, contentRef } = props;
  
  const pollType = pollTypes.find(
    (p) => p.value === block.props.pollType,
  )!;
  
  const options = parseOptions(block.props.optionsJson as string);
  const votes = parseVotes(block.props.votesJson as string);
  
  // Parse configuration
  const maxVotesPerUser = parseConfigValue(block.props.maxVotesPerUser, 1);
  const allowedUsers = parseConfigValue(block.props.allowedUsers, "all");
  const startDate = parseConfigValue(block.props.startDate, "");
  const endDate = parseConfigValue(block.props.endDate, "");
  const showResultsAfterVote = parseConfigValue(block.props.showResultsAfterVote, true);
  const showResultsBeforeEnd = parseConfigValue(block.props.showResultsBeforeEnd, false);
  const allowAddOptions = parseConfigValue(block.props.allowAddOptions, true);
  
  // Calculate vote counts for display
  const voteCounts: Record<number, number> = options.reduce((acc, _, index) => {
    acc[index] = Object.values(votes).filter(vote => 
      Array.isArray(vote) ? vote.includes(index) : vote === index
    ).length;
    return acc;
  }, {} as Record<number, number>);
  
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  
  // Check if poll is active based on dates
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const isActive = (!start || now >= start) && (!end || now <= end);
  
  // Determine user permission labels
  const userPermissionLabel = {
    all: "All users",
    members: "Members only", 
    staff: "Staff only"
  }[allowedUsers as string] || "All users";
  
  // Track last edit time to prevent double-clicks
  const lastEditTimeRef = React.useRef<number>(0);
  
  // Handle edit functionality with debouncing
  const handleEdit = React.useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling and default behavior
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    const timeSinceLastEdit = now - lastEditTimeRef.current;
    
    // Debounce: ignore clicks within 1000ms of the last one  
    if (timeSinceLastEdit < 1000) {
      console.log(`[POLL-BLOCK] Edit request debounced for block: ${block.id} (${timeSinceLastEdit}ms since last)`);
      return;
    }
    
    // Update last edit time immediately to prevent race conditions
    lastEditTimeRef.current = now;
    
    console.log(`[POLL-BLOCK] Processing edit click for block: ${block.id}`);
    
    // Get the question from block props
    const questionText = block.props.question as string || "";
    
    const eventDetail = {
      blockId: block.id,
      currentConfig: {
        question: questionText,
        pollType: block.props.pollType,
        options,
        maxVotesPerUser,
        allowedUsers,
        startDate,
        endDate,
        showResultsAfterVote,
        showResultsBeforeEnd,
        allowAddOptions,
      }
    };
    
    console.log(`[POLL-BLOCK] Dispatching edit poll event for block: ${block.id}`);
    
    // Dispatch the event immediately (no setTimeout needed)
    const editEvent = new CustomEvent('editPoll', {
      detail: eventDetail,
      bubbles: false
    });
    window.dispatchEvent(editEvent);
    
  }, [block.id, block.props.question, block.props.pollType, options, maxVotesPerUser, allowedUsers, startDate, endDate, showResultsAfterVote, showResultsBeforeEnd, allowAddOptions]);
  
  // Handle delete functionality with debouncing
  const handleDelete = React.useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling and default behavior
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    const timeSinceLastEdit = now - lastEditTimeRef.current;
    
    // Debounce: ignore clicks within 1000ms of the last one  
    if (timeSinceLastEdit < 1000) {
      console.log(`[POLL-BLOCK] Delete request debounced for block: ${block.id} (${timeSinceLastEdit}ms since last)`);
      return;
    }
    
    // Update last edit time immediately to prevent race conditions
    lastEditTimeRef.current = now;
    
    console.log(`[POLL-BLOCK] Processing delete click for block: ${block.id}`);
    
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      console.log(`[POLL-BLOCK] Dispatching delete poll event for block: ${block.id}`);
      
      // Dispatch the delete event
      const deleteEvent = new CustomEvent('deletePoll', {
        detail: { blockId: block.id },
        bubbles: false
      });
      window.dispatchEvent(deleteEvent);
    }
    
  }, [block.id]);
  
  return (
    <div ref={contentRef} className="poll-block border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-2 bg-white dark:bg-gray-900">
      {/* Poll Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Poll • {pollType.title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
            {!isActive && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {end && now > end ? 'Ended' : 'Not Started'}
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-1 text-xs"
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600"
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Poll Question */}
      <div className="mb-4">
        <div className="text-lg font-medium text-gray-900 dark:text-white min-h-[1.5rem]">
          {block.props.question as string || "Poll Question"}
        </div>
      </div>
      
      {/* Poll Options - Read Only Display */}
      <div className="space-y-2 mb-4">
        {options.map((option, index) => {
          const voteCount = voteCounts[index] || 0;
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          
          return (
            <div key={index} className="relative">
              <div className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
                {/* Vote percentage background */}
                <div 
                  className="absolute left-0 top-0 h-full bg-blue-100 dark:bg-blue-900/30 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 border-2 border-gray-400 dark:border-gray-500",
                      block.props.pollType === "single" ? "rounded-full" : "rounded-sm"
                    )} />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {voteCount} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Poll Configuration Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{userPermissionLabel}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>
              {maxVotesPerUser === -1 
                ? "Unlimited votes" 
                : `${maxVotesPerUser} vote${maxVotesPerUser !== 1 ? 's' : ''} per user`
              }
            </span>
          </div>
          
          {(startDate || endDate) && (
            <div className="flex items-center gap-1 col-span-2">
              <Clock className="h-3 w-3" />
              <span>
                {startDate && endDate 
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                  : startDate 
                    ? `Starts: ${new Date(startDate).toLocaleDateString()}`
                    : `Ends: ${new Date(endDate).toLocaleDateString()}`
                }
              </span>
            </div>
          )}
          
          {allowAddOptions && (
            <div className="text-blue-600 dark:text-blue-400 col-span-2">
              Users can add options
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// The Poll block (Read-only display version)
export const Poll = createReactBlockSpec(
  {
    type: "poll",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      question: {
        default: "",
      },
      pollType: {
        default: "single",
        values: ["single", "multiple"],
      },
      optionsJson: {
        default: '["Option 1", "Option 2"]',
      },
      votesJson: {
        default: '{}',
      },
      // Configuration props
      maxVotesPerUser: {
        default: 1,
      },
      allowedUsers: {
        default: "all",
        values: ["all", "members", "staff"],
      },
      startDate: {
        default: "",
      },
      endDate: {
        default: "",
      },
      showResultsAfterVote: {
        default: true,
      },
      showResultsBeforeEnd: {
        default: false,
      },
      allowAddOptions: {
        default: true,
      },
    },
    content: "none",
  },
  {
    render: PollComponent,
  },
); 