import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Heart,
  Share2,
  MoreVertical
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  Badge,
  Button
} from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { PostData } from '../types';
import { PollComponent } from './poll-component';

interface PostCardProps {
  post: PostData;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleVote = (optionIndex: number) => {
    // Mock vote handling
    console.log(`Voted for option ${optionIndex} in poll ${post.poll.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-sm transition-shadow duration-150 rounded-lg">
        <CardContent className="p-5">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {post.author.name}
                  </h3>
                  {post.author.role && (
                    <Badge variant="secondary" className="text-xs">
                      {post.author.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.createdAt}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Poll Component */}
          <div className="mb-4">
            <PollComponent poll={post.poll} onVote={handleVote} />
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors",
                  isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-400"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                <span>{likesCount}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-gray-600 dark:text-gray-400 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{post.comments}</span>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-gray-600 dark:text-gray-400 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 