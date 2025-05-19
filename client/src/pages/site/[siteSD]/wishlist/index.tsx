import React, { useState } from 'react';
import { useParams } from 'wouter';
import { SearchIcon, Filter, Star, ThumbsUp, Clock, ArrowUp, MessageSquare } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Mock wishlist data
const WISHLIST_ITEMS = [
  {
    id: 1,
    title: "Add lyrics sync for karaoke mode",
    description: "Would love to see a karaoke mode where lyrics are highlighted in real-time as the song plays. This would make sing-alongs much more fun!",
    author: {
      name: "KaraokeFan",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    status: "Under review",
    upvotes: 285,
    comments: 32,
    tags: ["feature", "lyrics", "playback", "popular"],
    createdAt: "2 months ago"
  },
  {
    id: 2,
    title: "Sleep timer with gradual volume decrease",
    description: "Add a sleep timer that gradually lowers the volume before stopping, rather than just cutting off abruptly. Perfect for falling asleep to music.",
    author: {
      name: "NightOwl",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    status: "Planned",
    upvotes: 217,
    comments: 28,
    tags: ["feature", "mobile", "settings"],
    createdAt: "3 months ago"
  },
  {
    id: 3,
    title: "Support for importing and playing local music files",
    description: "Would be great to have the ability to upload and play local music files alongside streaming content, especially for rare tracks or personal recordings.",
    author: {
      name: "MusicCollector",
      avatar: "https://i.pravatar.cc/150?img=13"
    },
    status: "Considering",
    upvotes: 176,
    comments: 42,
    tags: ["feature", "library", "files"],
    createdAt: "1 month ago"
  },
  {
    id: 4,
    title: "Advanced equalizer with custom presets",
    description: "Enhanced equalizer options with the ability to create, save, and share custom sound profiles for different music genres or headphones.",
    author: {
      name: "AudiophileMax",
      avatar: "https://i.pravatar.cc/150?img=14"
    },
    status: "Implemented",
    upvotes: 321,
    comments: 56,
    tags: ["feature", "audio", "settings", "implemented"],
    createdAt: "5 months ago"
  },
  {
    id: 5,
    title: "Collaborative playlist editing in real-time",
    description: "Allow multiple people to edit a playlist at the same time with real-time updates, great for parties or group projects!",
    author: {
      name: "TeamPlayer",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    status: "Planned",
    upvotes: 198,
    comments: 24,
    tags: ["feature", "playlists", "collaboration"],
    createdAt: "2 months ago"
  }
];

// Status colors for badges
const STATUS_COLORS = {
  "Under review": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
  "Planned": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
  "Considering": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
  "Implemented": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50"
};

// Mock roadmap data
const ROADMAP_DATA = {
  "Planned": 14,
  "Under review": 36,
  "Considering": 27,
  "Implemented": 58
};

export default function WishlistPage() {
  const { siteSD } = useParams();
  const [tab, setTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Feature Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vote for features you want to see and suggest new ideas
          </p>
        </div>
        <Button className="md:self-start">
          <Star className="h-4 w-4 mr-2" />
          Submit Idea
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content area */}
        <div className="lg:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search ideas..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="trending" value={tab} onValueChange={setTab} className="w-full">
              <div className="px-4 pt-1 border-b border-gray-200 dark:border-gray-700">
                <TabsList className="h-11 bg-transparent p-0 w-full flex justify-start gap-4">
                  <TabsTrigger 
                    value="trending" 
                    className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                  >
                    Trending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="top" 
                    className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                  >
                    Top Voted
                  </TabsTrigger>
                  <TabsTrigger 
                    value="new" 
                    className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                  >
                    New
                  </TabsTrigger>
                  <TabsTrigger 
                    value="implemented" 
                    className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                  >
                    Implemented
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="trending" className="p-0 m-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {WISHLIST_ITEMS.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <div className="flex gap-4">
                        <div className="hidden sm:flex flex-col items-center space-y-1 min-w-16">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{item.upvotes}</span>
                          <span className="text-xs text-gray-500">votes</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge className={STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]}>
                              {item.status}
                            </Badge>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500 transition">
                              <a href={`/site/${siteSD}/wishlist/${item.id}`}>{item.title}</a>
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {item.comments} comments
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={item.author.avatar} alt={item.author.name} />
                                <AvatarFallback>{item.author.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-700 dark:text-gray-300">{item.author.name}</span>
                              <span>submitted {item.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="top" className="p-0 m-0">
                <div className="flex items-center justify-center p-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Top voted content would appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="new" className="p-0 m-0">
                <div className="flex items-center justify-center p-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Newest ideas would appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="implemented" className="p-0 m-0">
                <div className="flex items-center justify-center p-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Implemented features would appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">About the Wishlist</CardTitle>
              <CardDescription>
                Help shape the future of our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Vote for features you want to see implemented, or suggest new ideas. We prioritize development based on community feedback.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4 pb-2">
              <Button variant="outline" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Submit Your Idea
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Roadmap Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Planned</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{ROADMAP_DATA["Planned"]}</span>
                </div>
                <Progress value={Math.round((ROADMAP_DATA["Planned"] / (ROADMAP_DATA["Planned"] + ROADMAP_DATA["Under review"] + ROADMAP_DATA["Considering"] + ROADMAP_DATA["Implemented"])) * 100)} className="h-2 bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-purple-500 rounded-full"></div>
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Under Review</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{ROADMAP_DATA["Under review"]}</span>
                </div>
                <Progress value={Math.round((ROADMAP_DATA["Under review"] / (ROADMAP_DATA["Planned"] + ROADMAP_DATA["Under review"] + ROADMAP_DATA["Considering"] + ROADMAP_DATA["Implemented"])) * 100)} className="h-2 bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-blue-500 rounded-full"></div>
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Considering</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{ROADMAP_DATA["Considering"]}</span>
                </div>
                <Progress value={Math.round((ROADMAP_DATA["Considering"] / (ROADMAP_DATA["Planned"] + ROADMAP_DATA["Under review"] + ROADMAP_DATA["Considering"] + ROADMAP_DATA["Implemented"])) * 100)} className="h-2 bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-yellow-500 rounded-full"></div>
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Implemented</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{ROADMAP_DATA["Implemented"]}</span>
                </div>
                <Progress value={Math.round((ROADMAP_DATA["Implemented"] / (ROADMAP_DATA["Planned"] + ROADMAP_DATA["Under review"] + ROADMAP_DATA["Considering"] + ROADMAP_DATA["Implemented"])) * 100)} className="h-2 bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-green-500 rounded-full"></div>
                </Progress>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>feature</Badge>
              <Badge>mobile</Badge>
              <Badge>playlists</Badge>
              <Badge>audio</Badge>
              <Badge>settings</Badge>
              <Badge>collaboration</Badge>
              <Badge>lyrics</Badge>
              <Badge>library</Badge>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
} 