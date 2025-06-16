import { PostData, VoterData } from './types';

// Mock data for posts with polls
export const mockPosts: PostData[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Community Manager"
    },
    title: "What's your favorite music genre for working out?",
    content: "I'm putting together a community playlist and want to know what gets everyone pumped up during their workouts!",
    poll: {
      id: "poll-1",
      question: "What's your favorite music genre for working out?",
      pollType: "single",
      options: ["Electronic/EDM", "Hip-Hop/Rap", "Rock/Metal", "Pop", "Classical"],
      votes: { 0: 45, 1: 67, 2: 32, 3: 28, 4: 8 },
      state: "open",
      displayMode: "open_unvoted",
      hasUserVoted: false,
      totalVotes: 180,
      maxVotesPerUser: 1
    },
    createdAt: "2h ago",
    likes: 24,
    comments: 12,
    isLiked: false,
    tags: ["Music", "Fitness"]
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "Member"
    },
    title: "Best time for community events?",
    content: "We're planning our next virtual listening party. When would be the best time for most people to join?",
    poll: {
      id: "poll-2",
      question: "What time works best for community events?",
      pollType: "single",
      options: ["Weekday Evening (7-9 PM)", "Weekend Morning (10 AM-12 PM)", "Weekend Evening (7-9 PM)", "Weekend Afternoon (2-4 PM)"],
      votes: { 0: 23, 1: 15, 2: 41, 3: 28 },
      state: "open",
      displayMode: "open_no_results",
      hasUserVoted: false,
      totalVotes: 107,
      maxVotesPerUser: 1
    },
    createdAt: "5h ago",
    likes: 18,
    comments: 8,
    isLiked: true,
    tags: ["Events", "Community"]
  },
  {
    id: "3",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "Moderator"
    },
    title: "New Feature Poll - What should we prioritize?",
    content: "Help us decide which features to work on next! Vote for the most important feature.",
    poll: {
      id: "poll-3",
      question: "Which feature should we prioritize first?",
      pollType: "single",
      options: ["Dark Mode Improvements", "Mobile App Updates", "Social Features", "AI Recommendations", "Offline Mode"],
      votes: { 0: 89, 1: 76, 2: 134, 3: 92, 4: 45 },
      state: "closed",
      displayMode: "closed_results_visible",
      hasUserVoted: true,
      userVotes: [2],
      endDate: "2024-01-15T23:59:59Z",
      totalVotes: 436,
      maxVotesPerUser: 1
    },
    createdAt: "1d ago",
    likes: 56,
    comments: 23,
    isLiked: false,
    tags: ["Features", "Development"]
  },
  {
    id: "4",
    author: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "Member"
    },
    title: "Upcoming Beta Testing Program",
    content: "We're launching a new beta testing program next month. This poll will help us gauge interest and preferred testing areas.",
    poll: {
      id: "poll-4",
      question: "Would you be interested in joining our beta testing program?",
      pollType: "single",
      options: ["Yes, very interested", "Maybe, depends on features", "No, not interested"],
      votes: {},
      state: "scheduled",
      displayMode: "scheduled",
      hasUserVoted: false,
      startDate: "2025-01-15T15:30:00Z",
      totalVotes: 0,
      maxVotesPerUser: 1
    },
    createdAt: "3h ago",
    likes: 12,
    comments: 5,
    isLiked: false,
    tags: ["Beta", "Testing"]
  },
  {
    id: "5",
    author: {
      name: "David Park",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "Power User"
    },
    title: "Content moderation feedback",
    content: "We want your input on our community guidelines. This poll ended yesterday, but you can still see the results.",
    poll: {
      id: "poll-5",
      question: "How would you rate our current content moderation?",
      pollType: "single",
      options: ["Too strict", "Just right", "Too lenient", "Needs improvement"],
      votes: { 0: 12, 1: 89, 2: 23, 3: 34 },
      state: "closed",
      displayMode: "closed_results_hidden",
      hasUserVoted: false,
      endDate: "2024-01-20T23:59:59Z",
      totalVotes: 158,
      maxVotesPerUser: 1
    },
    createdAt: "2d ago",
    likes: 31,
    comments: 17,
    isLiked: true,
    tags: ["Moderation", "Feedback"]
  },
  {
    id: "6",
    author: {
      name: "Lisa Chen",
      avatar: "https://i.pravatar.cc/150?img=6",
      role: "Community Manager"
    },
    title: "Favorite programming languages for 2024",
    content: "Our annual tech survey is complete! Thanks to everyone who participated. Here are the final results from our developer community.",
    poll: {
      id: "poll-6",
      question: "What's your primary programming language for 2024?",
      pollType: "single",
      options: ["JavaScript/TypeScript", "Python", "Java", "Go", "Rust", "Other"],
      votes: { 0: 156, 1: 134, 2: 89, 3: 67, 4: 45, 5: 23 },
      state: "closed",
      displayMode: "closed_results_visible",
      hasUserVoted: false,
      endDate: "2024-01-21T23:59:59Z",
      totalVotes: 514,
      maxVotesPerUser: 1
    },
    createdAt: "1d ago",
    likes: 89,
    comments: 34,
    isLiked: false,
    tags: ["Programming", "Survey", "Tech"]
  }
];

// Mock detailed voter data for demonstration
export const mockVoters: VoterData[] = [
  { id: '1', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Admin' },
  { id: '2', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Member' },
  { id: '3', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?img=3', role: 'Moderator' },
  { id: '4', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=4', role: 'Member' },
  { id: '5', name: 'David Park', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Power User' },
]; 