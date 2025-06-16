import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Undo2
} from 'lucide-react';
import { Button } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { PollData, PollDisplayMode } from '../types';
import { PollResultsModal } from './poll-results-modal';
import { CountdownTimer } from './countdown-timer';
import { PollSkeleton } from './poll-skeleton';
import { toast } from 'sonner';

interface PollComponentProps {
  poll: PollData;
  onVote?: (optionIndex: number) => void;
}

export const PollComponent: React.FC<PollComponentProps> = ({ 
  poll, 
  onVote 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(poll.userVotes || []);
  const [currentDisplayMode, setCurrentDisplayMode] = useState<PollDisplayMode>(poll.displayMode);
  const [showAdminView, setShowAdminView] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);
  
  const canVote = currentDisplayMode === "open_unvoted" || currentDisplayMode === "open_no_results";
  const isDisabled = currentDisplayMode === "closed_results_hidden";
  const showResults = (currentDisplayMode === "open_results_after_vote" || 
                     currentDisplayMode === "closed_results_visible" ||
                     showAdminView) && !isDisabled;

  // Return skeleton for scheduled polls
  if (poll.displayMode === "scheduled") {
    return <PollSkeleton startDate={poll.startDate} />;
  }

  const startCountdown = () => {
    setCountdown(5);
    
    // Show sonner toast with countdown and undo button
    const id = toast(`Auto-saving in 5s`, {
      duration: 6000,
      action: {
        label: <div className="flex items-center gap-1"><Undo2 className="h-3 w-3" />Undo</div>,
        onClick: () => handleUndoVote()
      }
    });
    
    setToastId(id);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.dismiss(id);
          toast.success("Vote saved", { duration: 2000 });
          console.log("Vote saved automatically");
          setToastId(null);
          return 0;
        }
        
        // Update toast message with new countdown
        toast(`Auto-saving in ${prev - 1}s`, {
          id: id,
          duration: 6000,
          action: {
            label: <div className="flex items-center gap-1"><Undo2 className="h-3 w-3" />Undo</div>,
            onClick: () => handleUndoVote()
          }
        });
        
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  const handleOptionClick = (optionIndex: number) => {
    if (!canVote || isTransitioning) return;

    setSelectedOptions([optionIndex]);
    setIsTransitioning(true);
    
    if (poll.displayMode === "open_unvoted") {
      setTimeout(() => {
        setCurrentDisplayMode("open_results_after_vote");
        setIsTransitioning(false);
        startCountdown();
      }, 500);
    } else if (poll.displayMode === "open_no_results") {
      setTimeout(() => {
        setCurrentDisplayMode("open_no_results");
        setIsTransitioning(false);
        startCountdown();
      }, 500);
    }
    
    onVote?.(optionIndex);
  };



  const handleUndoVote = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
    
    setCurrentDisplayMode("open_unvoted");
    setSelectedOptions([]);
    setCountdown(5);
    setIsTransitioning(false);
  };

  const handleShowResults = () => {
    setShowResultsModal(true);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownInterval]);

  return (
    <>
      <PollResultsModal 
        poll={poll} 
        isOpen={showResultsModal} 
        onClose={() => setShowResultsModal(false)} 
      />
      
      <div className="rounded-lg p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

        {/* Poll Question */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight flex-1">
            {poll.question}
          </h3>
          
          {/* Admin Results Button */}
          <button
            onClick={handleShowResults}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors ml-4"
          >
            <Shield className="h-3 w-3" />
            Results
          </button>
        </div>

        {/* Poll Status Message for closed polls */}
        {(currentDisplayMode === "closed_results_hidden" || currentDisplayMode === "closed_results_visible") && !showAdminView && (
          <div className="py-3 px-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  This poll has ended
                </p>
                {poll.endDate && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    Closed on {new Date(poll.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric', 
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Poll Options */}
        <div className="space-y-2 mb-4">
          {currentDisplayMode === "scheduled" ? (
            poll.startDate ? (
              <CountdownTimer startDate={poll.startDate} />
            ) : (
              <div className="py-4 px-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Poll not started yet
                  </p>
                </div>
              </div>
            )
          ) : (
                      poll.options.map((option, index) => {
            const voteCount = poll.votes[index] || 0;
            const percentage = poll.totalVotes > 0 ? (voteCount / poll.totalVotes) * 100 : 0;
            const isSelected = selectedOptions.includes(index);
            const userVoted = poll.userVotes?.includes(index) || (currentDisplayMode === "open_results_after_vote" && selectedOptions.includes(index));

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 2 }}
                animate={{ 
                  opacity: 1, 
                  y: 0
                }}
                transition={{ 
                  duration: 0.15, 
                  delay: index * 0.02
                }}
                className={cn(
                  "relative rounded-lg border transition-all duration-200 ease-out",
                  (canVote && !isTransitioning) ? "cursor-pointer hover:border-blue-300 dark:hover:border-blue-600" : "cursor-default",
                  isSelected && (canVote || isTransitioning)
                    ? "border-blue-400 bg-blue-50/50 dark:bg-blue-500/5" 
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                  userVoted && "border-blue-500 bg-blue-50 dark:bg-blue-500/10",
                  (isTransitioning || isDisabled) && "pointer-events-none",
                  isDisabled && "opacity-60"
                )}
                onClick={() => !isDisabled && handleOptionClick(index)}
              >
                {/* Results Background */}
                {(showResults || isTransitioning) && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: showResults ? `${percentage}%` : "0%"
                    }}
                    transition={{ 
                      duration: showResults ? 0.8 : 0.2, 
                      ease: "easeOut",
                      delay: showResults ? (userVoted ? 0.1 : index * 0.08) : 0
                    }}
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-lg",
                      userVoted ? "bg-blue-100 dark:bg-blue-500/20" : 
                      "bg-gray-100 dark:bg-gray-700/30"
                    )}
                  />
                )}
                
                <div className="relative px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Radio Button */}
                    <div className="flex-shrink-0">
                      <div 
                        className={cn(
                          "w-4 h-4 border-2 transition-all duration-200 flex items-center justify-center rounded-full",
                          userVoted 
                            ? "border-blue-500 bg-blue-500" 
                            : isSelected && (canVote || isTransitioning)
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10"
                            : isDisabled
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        )}
                      >
                        {userVoted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                        {(isSelected && (canVote || isTransitioning) && !userVoted) && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                              "bg-blue-400",
                              poll.pollType === "multiple" ? "w-2 h-2 rounded-sm" : "w-2 h-2 rounded-full"
                            )} 
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Option Text and Label */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span 
                        className={cn(
                          "text-sm transition-all duration-200",
                          userVoted 
                            ? "text-blue-700 dark:text-blue-300 font-medium" 
                            : isDisabled
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {option}
                      </span>
                      {userVoted && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full"
                        >
                          Your choice
                        </motion.span>
                      )}
                    </div>
                  </div>
                  
                  {/* Results */}
                  <div className="w-14 flex-shrink-0 text-right">
                    {showResults ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                      >
                        <div 
                          className={cn(
                            "text-sm font-medium",
                            userVoted ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {voteCount}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage.toFixed(0)}%
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-8"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
                  )}
      </div>

        {/* Poll Footer */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}
            {poll.pollType === "multiple" && ` • Max ${poll.maxVotesPerUser}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {poll.state === "scheduled" && poll.startDate && (
              <span>Starts {new Date(poll.startDate).toLocaleDateString()}</span>
            )}
            {poll.endDate && poll.state === "closed" && (
              <span>Ended {new Date(poll.endDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 