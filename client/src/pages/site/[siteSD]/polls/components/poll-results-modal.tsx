import React, { useState } from 'react';
import { Shield, Users, TrendingUp } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  Badge
} from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { PollData } from '../types';
import { mockVoters } from '../mock-data';

interface PollResultsModalProps {
  poll: PollData;
  isOpen: boolean;
  onClose: () => void;
}

export const PollResultsModal: React.FC<PollResultsModalProps> = ({ 
  poll, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'voters'>('overview');

  const totalVotes = poll.totalVotes;
  const maxVotes = Math.max(...Object.values(poll.votes), 0);
  const winningOptionIndex = Object.entries(poll.votes).find(([_, votes]) => votes === maxVotes)?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Poll Results
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Admin analytics and insights
              </p>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Admin Only
            </Badge>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'overview'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('voters')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'voters'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <Users className="h-4 w-4" />
              Voters ({totalVotes})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Poll Question */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {poll.question}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Votes</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{totalVotes}</div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Poll Type</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {poll.pollType === "multiple" ? "Multiple Choice" : "Single Choice"}
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{poll.state}</div>
                  </div>

                  {poll.endDate && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ended</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(poll.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Results</h4>
                
                {poll.options.map((option, index) => {
                  const voteCount = poll.votes[index] || 0;
                  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                  const isWinning = index.toString() === winningOptionIndex && voteCount > 0;
                  
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">{option}</h5>
                            {isWinning && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                Most votes
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {voteCount} votes • {percentage.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">{voteCount}</div>
                        </div>
                      </div>
                      
                      {/* Simple Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'voters' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Voter Breakdown</h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Total participants: {totalVotes} • Showing sample voters
                </div>
              </div>

              {poll.options.map((option, index) => {
                const voteCount = poll.votes[index] || 0;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                
                if (voteCount === 0) return null;
                
                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">{option}</h5>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {voteCount} votes ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {mockVoters.slice(0, Math.min(voteCount, 8)).map((voter, voterIndex) => (
                        <div key={voter.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {voter.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {voter.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {voter.role}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            #{voterIndex + 1}
                          </div>
                        </div>
                      ))}
                      
                      {voteCount > 8 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            +{voteCount - 8} more voters
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {totalVotes === 0 && (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    No votes yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Voter details will appear here once people start voting
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 