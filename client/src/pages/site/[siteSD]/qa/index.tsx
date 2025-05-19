import React, { useState } from 'react';
import { useParams } from 'wouter';
import { SearchIcon, Filter, HelpCircle, ArrowUp, MessageSquare, Check } from 'lucide-react';

import { SiteLayout } from '@/components/layout/site/site-layout';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent,
  CardHeader, 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock Q&A data
const QA_QUESTIONS = [
  {
    id: 1,
    title: "How can I share my playlists with friends who don't have accounts?",
    content: "I've created some great playlists and want to share them with friends who don't have accounts. What's the easiest way to do this?",
    author: {
      name: "PlaylistMaker",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    answers: 4,
    views: 256,
    upvotes: 18,
    solved: true,
    tags: ["sharing", "playlists", "help"],
    createdAt: "3 days ago"
  },
  {
    id: 2,
    title: "How to transfer my playlists from another music service?",
    content: "I'm switching from another music service and want to bring all my carefully curated playlists with me. Is there an easy way to do this without manually recreating them?",
    author: {
      name: "NewUser42",
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    answers: 6,
    views: 432,
    upvotes: 26,
    solved: true,
    tags: ["transfer", "playlists", "migration"],
    createdAt: "1 week ago"
  },
  {
    id: 3,
    title: "Why can't I play specific songs on mobile in shuffle mode?",
    content: "When I'm using the mobile app in shuffle mode, it seems I can't play specific songs directly - they're grayed out. Is this normal or is there a setting I'm missing?",
    author: {
      name: "MobileFan",
      avatar: "https://i.pravatar.cc/150?img=7"
    },
    answers: 2,
    views: 187,
    upvotes: 7,
    solved: false,
    tags: ["mobile", "shuffle", "technical"],
    createdAt: "2 days ago"
  },
  {
    id: 4,
    title: "Can I use the app without creating an account?",
    content: "I'm wondering if there's a way to use the basic features without creating an account? I just want to try it out first.",
    author: {
      name: "CautiousListener",
      avatar: "https://i.pravatar.cc/150?img=8"
    },
    answers: 3,
    views: 142,
    upvotes: 5,
    solved: true,
    tags: ["account", "basics", "help"],
    createdAt: "5 days ago"
  },
  {
    id: 5,
    title: "How do I enable high quality streaming on desktop?",
    content: "I have a premium subscription and want to make sure I'm getting the highest audio quality possible when listening on my desktop. How do I check or change this setting?",
    author: {
      name: "AudioPhile",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    answers: 7,
    views: 315,
    upvotes: 32,
    solved: true,
    tags: ["quality", "audio", "settings", "premium"],
    createdAt: "1 week ago"
  }
];

export default function QAPage() {
  const { siteSD } = useParams();
  const [tab, setTab] = useState("newest");
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Questions & Answers</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Get help from the community or share your knowledge
                  </p>
                </div>
                <Button className="md:self-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD} activePage="qa" />

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search questions..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="newest" value={tab} onValueChange={setTab} className="w-full">
                  <div className="px-4 pt-1 border-b border-gray-200 dark:border-gray-700">
                    <TabsList className="h-11 bg-transparent p-0 w-full flex justify-start gap-4">
                      <TabsTrigger 
                        value="newest" 
                        className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        Newest
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
                      <TabsTrigger 
                        value="solved" 
                        className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 pt-2 text-sm font-medium data-[state=active]:border-b-2 border-primary-600 dark:border-primary-500 rounded-none text-gray-600 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        Solved
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="newest" className="p-0 m-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {QA_QUESTIONS.map((question) => (
                        <div key={question.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                          <div className="flex gap-4">
                            <div className="hidden sm:flex flex-col items-center space-y-2">
                              <div className="flex flex-col items-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">{question.upvotes}</span>
                              </div>
                              {question.solved && (
                                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded">
                                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {question.solved && (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50">
                                    Solved
                                  </Badge>
                                )}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500 transition">
                                  <a href={`/site/${siteSD}/qa/${question.id}`}>{question.title}</a>
                                </h3>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                                {question.content}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {question.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                <span className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {question.answers} answers
                                </span>
                                <span>
                                  {question.views} views
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={question.author.avatar} alt={question.author.name} />
                                    <AvatarFallback>{question.author.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{question.author.name}</span>
                                  <span>asked {question.createdAt}</span>
                                </div>
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
                        Popular questions content would appear here
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="unanswered" className="p-0 m-0">
                    <div className="flex items-center justify-center p-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        Unanswered questions content would appear here
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="solved" className="p-0 m-0">
                    <div className="flex items-center justify-center p-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        Solved questions content would appear here
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