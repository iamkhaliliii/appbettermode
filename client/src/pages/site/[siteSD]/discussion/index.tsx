import React, { useState } from 'react';
import { useParams } from 'wouter';
import { SearchIcon, Filter, MessageSquare, MessageSquareIcon } from 'lucide-react';

import { SiteLayout } from '@/components/layout/site/site-layout';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock discussion data
const DISCUSSIONS = [
  {
    id: 1,
    title: "How do I create a playlist with songs from different artists?",
    content: "I'm trying to create a playlist that combines songs from various artists but I'm having trouble finding an efficient way to do this. Any suggestions?",
    author: {
      name: "JaneDoe",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    replies: 12,
    views: 340,
    likes: 28,
    tags: ["playlists", "help", "music"],
    createdAt: "2 days ago"
  },
  {
    id: 2,
    title: "Feature request: Add ability to see lyrics automatically",
    content: "It would be amazing if we could automatically see lyrics synced with songs as they play. Would make singing along so much easier!",
    author: {
      name: "MusicLover42",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    replies: 25,
    views: 512,
    likes: 96,
    tags: ["feature", "lyrics", "suggestion"],
    createdAt: "5 days ago"
  },
  {
    id: 3,
    title: "What are your favorite workout playlists?",
    content: "I'm looking for some good workout playlists. What are your favorites for getting energized and staying motivated during exercise?",
    author: {
      name: "FitnessFan",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    replies: 32,
    views: 687,
    likes: 54,
    tags: ["workout", "playlists", "recommendations"],
    createdAt: "1 week ago"
  },
  {
    id: 4,
    title: "What genre is trending in your country right now?",
    content: "I'm curious about what music genres are trending around the world. In my country, electronic music is really popular right now. What about where you live?",
    author: {
      name: "GlobalTunes",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    replies: 45,
    views: 982,
    likes: 120,
    tags: ["trends", "genres", "global"],
    createdAt: "3 days ago"
  },
  {
    id: 5,
    title: "Tips for discovering new artists similar to ones I already like?",
    content: "I want to expand my music horizons but stay within genres I enjoy. What strategies do you use to find new artists similar to your favorites?",
    author: {
      name: "NewSoundHunter",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    replies: 18,
    views: 426,
    likes: 37,
    tags: ["discovery", "recommendations", "artists"],
    createdAt: "4 days ago"
  }
];

export default function DiscussionPage() {
  const { siteSD } = useParams();
  const [tab, setTab] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");

  if (!siteSD) return <div>Site identifier is missing</div>;

  return (
    <SiteLayout siteSD={siteSD}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Discussions</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Join conversations, ask questions, and share your thoughts
                  </p>
                </div>
                <Button className="md:self-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD} activePage="discussion" />

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search discussions..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="latest" value={tab} onValueChange={setTab} className="w-full">
                  <div className="px-4 pt-1 border-b border-gray-200 dark:border-gray-700">
                    <TabsList className="h-11 bg-transparent p-0 w-full flex justify-start gap-4">
                      <TabsTrigger 
                        value="latest" 
                        className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        Latest
                      </TabsTrigger>
                      <TabsTrigger 
                        value="popular" 
                        className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        Popular
                      </TabsTrigger>
                      <TabsTrigger 
                        value="unanswered" 
                        className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        Unanswered
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="latest" className="p-0 m-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {DISCUSSIONS.map((discussion) => (
                        <div key={discussion.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                          <div className="flex gap-4">
                            <div className="hidden sm:block">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={discussion.author.avatar} 
                                  alt={discussion.author.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500 transition">
                                <a href={`/site/${siteSD}/discussion/${discussion.id}`}>{discussion.title}</a>
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                                {discussion.content}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {discussion.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                <span className="flex items-center">
                                  <MessageSquareIcon className="h-3 w-3 mr-1" />
                                  {discussion.replies} replies
                                </span>
                                <span>
                                  {discussion.views} views
                                </span>
                                <span>
                                  Posted by <span className="font-medium text-gray-700 dark:text-gray-300">{discussion.author.name}</span> · {discussion.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="popular" className="p-0 m-0">
                    <div className="flex items-center justify-center p-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        Popular discussions content would appear here
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="unanswered" className="p-0 m-0">
                    <div className="flex items-center justify-center p-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        Unanswered discussions content would appear here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
} 