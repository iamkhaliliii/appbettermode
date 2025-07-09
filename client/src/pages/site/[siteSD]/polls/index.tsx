import React, { useState, useMemo } from 'react';
import { Vote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/primitives';
import { mockPosts } from './mock-data';
import { PostCard } from './components/post-card';

// Main Polls Page Component
export default function PollsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'scheduled'>('all');

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return mockPosts;
    return mockPosts.filter(post => {
      switch (filter) {
        case 'open':
          return post.poll.state === 'open' || post.poll.state === 'voted';
        case 'closed':
          return post.poll.state === 'closed';
        case 'scheduled':
          return post.poll.state === 'scheduled';
        default:
          return true;
      }
    });
  }, [filter]);

  return (
              <div className="space-y-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No polls found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No polls match your current filter. Try selecting a different filter.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
  );
} 