// Poll state types
export type PollState = "scheduled" | "open" | "voted" | "closed";

// Poll display modes
export type PollDisplayMode = "open_unvoted" | "open_results_after_vote" | "open_no_results" | "closed_results_visible" | "closed_results_hidden" | "scheduled";

// Poll data interface
export interface PollData {
  id: string;
  question: string;
  pollType: "single" | "multiple";
  options: string[];
  votes: { [key: number]: number };
  state: PollState;
  displayMode: PollDisplayMode;
  hasUserVoted: boolean;
  userVotes?: number[];
  startDate?: string;
  endDate?: string;
  totalVotes: number;
  maxVotesPerUser: number;
}

// Post data interface
export interface PostData {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  title: string;
  content: string;
  poll: PollData;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags?: string[];
}

// Voter data interface
export interface VoterData {
  id: string;
  name: string;
  avatar: string;
  role: string;
} 