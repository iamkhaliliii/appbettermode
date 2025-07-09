export interface SocialCardProps {
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
    postCategory?: string;
    badge?: {
      text: string;
      emoji?: string;
    };
    emoji?: string;
  };
  content?: {
    text?: string;
    link?: {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    };
    images?: {
      src: string;
      alt: string;
      aspectRatio?: "square" | "landscape" | "portrait";
    }[];
    poll?: {
      question: string;
      options: Array<{
        id: string;
        text: string;
        votes: number;
      }>;
      totalVotes: number;
      hasVoted: boolean;
      userVote?: string;
      timeLeft?: string;
    };
    event?: {
      title: string;
      date: string;
      time: string;
      location: string;
      attendees: number;
      category: string;
      status: "upcoming" | "ongoing" | "completed";
      host?: {
        name: string;
        avatar: string;
      };
      image?: string;
    };
    video?: {
      embedUrl: string;
      title: string;
      description: string;
      platform: string;
      duration: string;
    };
    form?: {
      title: string;
      description: string;
      fields: Array<{
        id: string;
        label: string;
        type: "text" | "textarea" | "select" | "radio";
        options?: string[];
        placeholder?: string;
        required: boolean;
      }>;
      submitText: string;
      responses: number;
    };
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    upvotes?: number;
    downvotes?: number;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
    reactions?: {
      heart?: number;
      clap?: number;
      fire?: number;
      [key: string]: number | undefined;
    };
    userReaction?: string;
    rsvp?: {
      yes?: number;
      no?: number;
      maybe?: number;
    };
    userRSVP?: "yes" | "no" | "maybe" | null;
  };
  engagementStyle?: "default" | "reactions" | "upvote" | "event";
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReaction?: (reaction: string) => void;
  onRSVP?: (response: "yes" | "no" | "maybe") => void;
  onPollVote?: (optionId: string) => void;
  className?: string;
}

export interface PollCardProps {
  poll: NonNullable<SocialCardProps['content']>['poll'];
  onPollVote?: (optionId: string) => void;
  isPreview?: boolean;
}

export interface EventCardProps {
  event: NonNullable<SocialCardProps['content']>['event'];
  isPreview?: boolean;
}

export interface FormCardProps {
  form: NonNullable<SocialCardProps['content']>['form'];
  isPreview?: boolean;
}

export interface VideoCardProps {
  video: NonNullable<SocialCardProps['content']>['video'];
  isPreview?: boolean;
}

export interface LinkPreviewCardProps {
  link: NonNullable<SocialCardProps['content']>['link'];
  isPreview?: boolean;
}

export interface ImagesGridProps {
  images: NonNullable<SocialCardProps['content']>['images'];
  isPreview?: boolean;
}

export interface EngagementSectionProps {
  engagement?: SocialCardProps['engagement'];
  engagementStyle?: SocialCardProps['engagementStyle'];
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReaction?: (reaction: string) => void;
  onRSVP?: (response: "yes" | "no" | "maybe") => void;
}

export interface CommentsSectionProps {
  postId?: string;
  comments?: Comment[];
  onAddComment?: (comment: string) => void;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
  isPinned?: boolean;
}

export interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  author?: SocialCardProps['author'];
  content?: SocialCardProps['content'];
  engagement?: SocialCardProps['engagement'];
  engagementStyle?: SocialCardProps['engagementStyle'];
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReaction?: (reaction: string) => void;
  onRSVP?: (response: "yes" | "no" | "maybe") => void;
  onPollVote?: (optionId: string) => void;
}

export interface ReactionEmoji {
  emoji: string;
  label: string;
} 