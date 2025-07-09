"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { AvatarGroup } from "@/components/ui/avatar";
import { PollCardProps } from "./types";

export function PollCard({ poll, onPollVote, isPreview = false }: PollCardProps) {
  const [pollVotes, setPollVotes] = useState(poll?.options || []);
  const [userPollVote, setUserPollVote] = useState(poll?.userVote || "");
  const [hasVoted, setHasVoted] = useState(poll?.hasVoted || false);

  if (!poll) return null;

  const handlePollVote = (optionId: string) => {
    if (hasVoted) return;
    
    setUserPollVote(optionId);
    setHasVoted(true);
    setPollVotes(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
    onPollVote?.(optionId);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/30 dark:bg-zinc-800/30">
      <div className="p-5">
        {/* Poll Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Poll
            </h4>
          </div>
          <Badge variant={hasVoted ? "secondary" : "default"} className="text-xs">
            {hasVoted ? 'Voted' : 'Active'}
          </Badge>
        </div>

        {/* Poll Question */}
        <h5 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-4">
          {poll.question}
        </h5>

        {/* Poll Options */}
        <div className="space-y-2.5">
          {pollVotes.map((option) => {
            const totalVotes = pollVotes.reduce((sum, opt) => sum + opt.votes, 0);
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isUserVote = userPollVote === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  if (!isPreview) {
                    e.stopPropagation();
                    handlePollVote(option.id);
                  }
                }}
                disabled={hasVoted}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group",
                  hasVoted
                    ? isUserVote
                      ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 shadow-sm"
                      : "border-zinc-200 bg-white dark:bg-zinc-800/50 dark:border-zinc-700"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-zinc-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:shadow-sm"
                )}
              >
                {hasVoted && (
                  <div 
                    className={cn(
                      "absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-l-xl",
                      isUserVote 
                        ? "bg-blue-100 dark:bg-blue-900/20" 
                        : "bg-zinc-100 dark:bg-zinc-700/20"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                      isUserVote && hasVoted
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-300 dark:border-zinc-600"
                    )}>
                      {isUserVote && hasVoted && (
                        <Check className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isUserVote && hasVoted 
                        ? "text-blue-700 dark:text-blue-300" 
                        : "text-zinc-700 dark:text-zinc-300"
                    )}>
                      {option.text}
                    </span>
                  </div>
                  {hasVoted && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {percentage}%
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        {option.votes} votes
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Poll Footer */}
        {hasVoted && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AvatarGroup 
                  members={[
                    { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face", username: "Alex" },
                    { src: "https://images.unsplash.com/photo-1494790108755-2616b25205e5?w=32&h=32&fit=crop&crop=face", username: "Sarah" },
                    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face", username: "Mike" },
                    { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face", username: "Emma" },
                    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face", username: "David" }
                  ]}
                  size={24}
                  limit={4}
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Recent voters
                </span>
              </div>
              {poll.timeLeft && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {poll.timeLeft} remaining
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 