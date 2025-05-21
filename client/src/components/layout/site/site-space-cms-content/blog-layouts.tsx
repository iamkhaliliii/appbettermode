import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';

// Define the common BlogPost type used across layouts
export interface BlogPostForDisplay {
  id: string;
  title: string;
  content: any;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  published_at: string;
  created_at: string;
  cover_image_url?: string;
  tags?: string[];
  view_count?: number;
  excerpt?: string;
  readTime?: number;
  pinned?: boolean;
}

interface BlogLayoutProps {
  posts: BlogPostForDisplay[];
  handleViewPost: (postId: string) => void;
  onTagClick?: (tag: string) => void;
  activeTag: string | null;
  formatDate: (dateString: string) => string;
  getInitials: (name: string) => string;
}

// Add PinnedIndicator component
const PinnedIndicator: React.FC = () => (
  <div className="absolute top-2 right-2 z-20 bg-primary-500 dark:bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.828 5l-2-2H2v9h3.546l1.627 1.627A3.5 3.5 0 0 0 12.31 12.5h5.69V9l-2-2h-6.172z" />
    </svg>
    <span>Pinned</span>
  </div>
);

// Default Three-column Grid Layout (Current Design)
export const DefaultGridLayout: React.FC<BlogLayoutProps> = ({ 
  posts, 
  handleViewPost, 
  onTagClick, 
  activeTag,
  formatDate,
  getInitials
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <Card 
          key={post.id} 
          className={`overflow-hidden flex flex-col h-full border hover:shadow-md transition-shadow ${
            post.pinned
              ? 'border-primary-300 dark:border-primary-700 ring-1 ring-primary-500/20 dark:ring-primary-500/30'
              : 'border-gray-200 dark:border-gray-800'
          }`}
        >
          <div className="relative">
            {post.pinned && <PinnedIndicator />}
            {post.cover_image_url ? (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={post.cover_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-r from-primary-400/20 to-primary-600/20 dark:from-primary-800/30 dark:to-primary-600/30 flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary-500 dark:text-primary-400 opacity-60" />
              </div>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </div>
              
              <span className="text-gray-400 dark:text-gray-600">•</span>
              
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {post.readTime || 1} min read
                </span>
              </div>
            </div>
            
            <CardTitle 
              className="text-xl font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer line-clamp-2"
              onClick={() => handleViewPost(post.id)}
            >
              {post.title}
            </CardTitle>
            
            {post.author && (
              <div className="flex items-center mt-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs">
                    {getInitials(post.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {post.author.name}
                </span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pb-3 flex-grow">
            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
              {post.excerpt}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className={`text-xs cursor-pointer ${
                      activeTag === tag 
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300' 
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick && onTagClick(tag);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800/50">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <Button 
              variant="default" 
              size="sm"
              className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-800 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 dark:text-primary-400 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-800/50"
              onClick={() => handleViewPost(post.id)}
            >
              Read Article <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

// Modern Three-column Layout (Based on the first example)
export const ModernThreeColumnLayout: React.FC<BlogLayoutProps> = ({ 
  posts, 
  handleViewPost, 
  onTagClick, 
  activeTag,
  formatDate,
  getInitials
}) => {
  return (
    <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className={`flex flex-col items-start justify-between ${
          post.pinned ? 'relative ring-1 ring-primary-500/20 dark:ring-primary-500/30 rounded-2xl p-3 bg-primary-50/20 dark:bg-primary-900/10' : ''
        }`}>
          {post.pinned && <PinnedIndicator />}
          <div className="relative w-full">
            {post.cover_image_url ? (
              <img
                alt=""
                src={post.cover_image_url}
                className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2"
              />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-gradient-to-r from-primary-400/20 to-primary-600/20 dark:from-primary-800/30 dark:to-primary-600/30 flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary-500 dark:text-primary-400 opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 ring-inset" />
          </div>
          <div className="max-w-xl">
            <div className="mt-8 flex items-center gap-x-4 text-xs">
              <time dateTime={post.published_at} className="text-gray-500 dark:text-gray-400">
                {formatDate(post.published_at || post.created_at)}
              </time>
              {post.tags && post.tags.length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick && onTagClick(post.tags![0]);
                  }}
                  className={`relative z-10 rounded-full px-3 py-1.5 font-medium cursor-pointer ${
                    activeTag === post.tags[0]
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {post.tags[0]}
                </span>
              )}
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                <span onClick={() => handleViewPost(post.id)} className="cursor-pointer">
                  <span className="absolute inset-0" />
                  {post.title}
                </span>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              {post.author && (
                <>
                  <Avatar className="h-10 w-10 rounded-full bg-gray-100">
                    <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      <span>
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{post.readTime || 1} min read</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

// Single-column Layout with Images (Based on the second example)
export const SingleColumnLayout: React.FC<BlogLayoutProps> = ({ 
  posts, 
  handleViewPost, 
  onTagClick, 
  activeTag,
  formatDate,
  getInitials
}) => {
  return (
    <div className="space-y-16">
      {posts.map((post) => (
        <article key={post.id} className={`relative isolate flex flex-col gap-8 lg:flex-row ${
          post.pinned ? 'ring-1 ring-primary-500/20 dark:ring-primary-500/30 rounded-2xl p-4 bg-primary-50/20 dark:bg-primary-900/10' : ''
        }`}>
          {post.pinned && <PinnedIndicator />}
          <div className="relative aspect-video sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
            {post.cover_image_url ? (
              <img
                alt=""
                src={post.cover_image_url}
                className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 dark:bg-gray-800 object-cover"
              />
            ) : (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-primary-600/20 dark:from-primary-800/30 dark:to-primary-600/30 flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary-500 dark:text-primary-400 opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 ring-inset" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.published_at} className="text-gray-500 dark:text-gray-400">
                {formatDate(post.published_at || post.created_at)}
              </time>
              {post.tags && post.tags.length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick && onTagClick(post.tags![0]);
                  }}
                  className={`relative z-10 rounded-full px-3 py-1.5 font-medium cursor-pointer ${
                    activeTag === post.tags[0]
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {post.tags[0]}
                </span>
              )}
            </div>
            <div className="group relative max-w-xl">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                <span onClick={() => handleViewPost(post.id)} className="cursor-pointer">
                  <span className="absolute inset-0" />
                  {post.title}
                </span>
              </h3>
              <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            </div>
            {post.author && (
              <div className="mt-6 flex border-t border-gray-900/5 dark:border-gray-100/5 pt-6">
                <div className="relative flex items-center gap-x-4">
                  <Avatar className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-800">
                    <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      <span>
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{post.readTime || 1} min read</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

// Card Layout (Based on the third example)
export const CardLayout: React.FC<BlogLayoutProps> = ({ 
  posts, 
  handleViewPost, 
  onTagClick, 
  activeTag,
  formatDate,
  getInitials
}) => {
  return (
    <div className="mx-auto mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className={`flex flex-col overflow-hidden rounded-lg shadow-lg relative ${
          post.pinned ? 'ring-2 ring-primary-500/50 dark:ring-primary-500/40' : ''
        }`}>
          {post.pinned && <PinnedIndicator />}
          <div className="shrink-0">
            {post.cover_image_url ? (
              <img alt="" src={post.cover_image_url} className="h-48 w-full object-cover" />
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-primary-400/20 to-primary-600/20 dark:from-primary-800/30 dark:to-primary-600/30 flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary-500 dark:text-primary-400 opacity-60" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between bg-white dark:bg-gray-800 p-6">
            <div className="flex-1">
              {post.tags && post.tags.length > 0 && (
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  <span 
                    className="hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick && onTagClick(post.tags![0]);
                    }}
                  >
                    {post.tags[0]}
                  </span>
                </p>
              )}
              <div onClick={() => handleViewPost(post.id)} className="mt-2 block cursor-pointer">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{post.title}</p>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
              </div>
            </div>
            {post.author && (
              <div className="mt-6 flex items-center">
                <div className="shrink-0">
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {post.author.name}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at || post.created_at)}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readTime || 1} min read</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Layout switcher component
export const BLOG_LAYOUTS = [
  { id: 'default', name: 'Default Grid', component: DefaultGridLayout },
  { id: 'modern', name: 'Modern Three-column', component: ModernThreeColumnLayout },
  { id: 'single', name: 'Single Column', component: SingleColumnLayout },
  { id: 'card', name: 'Card Layout', component: CardLayout },
];

export type BlogLayoutType = 'default' | 'modern' | 'single' | 'card'; 