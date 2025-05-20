import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Plus,
  Clock,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  Filter,
  Search,
  BookmarkPlus,
  ArrowUp,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Interfaces
interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: string;
  site_id: string;
}

interface QAQuestion {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  votes: number;
  answers: number;
  views: number;
  isVoted: boolean;
  isSolved: boolean;
  tags: string[];
}

interface QaContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

export function QaContent({ siteSD, space, site }: QaContentProps) {
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate fetching questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      
      try {
        // This would be replaced with a real API call
        // const data = await fetch(`/api/v1/sites/${site.id}/spaces/${space.id}/questions`).then(res => res.json());
        
        // Simulate API response
        setTimeout(() => {
          const mockQuestions: QAQuestion[] = [
            {
              id: '1',
              title: 'How do I set up two-factor authentication?',
              excerpt: "I want to secure my account better. What's the process for enabling 2FA?",
              author: {
                id: 'user1',
                name: 'Alex Morgan',
                avatar: 'https://i.pravatar.cc/150?img=4'
              },
              createdAt: '2025-05-15T14:30:00Z',
              updatedAt: '2025-05-15T14:30:00Z',
              votes: 18,
              answers: 3,
              views: 124,
              isVoted: false,
              isSolved: true,
              tags: ['Security', 'Authentication']
            },
            {
              id: '2',
              title: 'What are the hardware requirements for the desktop app?',
              excerpt: "I'm trying to run the desktop app but it's very slow. What specs do I need?",
              author: {
                id: 'user2',
                name: 'Jamie Rodriguez',
                avatar: 'https://i.pravatar.cc/150?img=5'
              },
              createdAt: '2025-05-14T11:45:00Z',
              updatedAt: '2025-05-15T13:15:00Z',
              votes: 12,
              answers: 2,
              views: 89,
              isVoted: true,
              isSolved: false,
              tags: ['Desktop App', 'Performance', 'Hardware']
            },
            {
              id: '3',
              title: 'Can I migrate data from my old account?',
              excerpt: "I have a legacy account and want to move everything to the new platform. Is there a migration tool?",
              author: {
                id: 'user3',
                name: 'Taylor Kim',
                avatar: 'https://i.pravatar.cc/150?img=6'
              },
              createdAt: '2025-05-13T09:20:00Z',
              updatedAt: '2025-05-13T09:20:00Z',
              votes: 24,
              answers: 4,
              views: 235,
              isVoted: false,
              isSolved: true,
              tags: ['Migration', 'Data', 'Account']
            }
          ];
          
          setQuestions(mockQuestions);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [site.id, space.id]);

  // Handle ask new question
  const handleAskQuestion = () => {
    setLocation(`/site/${siteSD}/${space.slug}/ask`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="qa-container">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1 flex-1 md:flex-none">
            <Button
              variant={filterOption === 'latest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('latest')}
              className="text-xs"
            >
              Latest
            </Button>
            <Button
              variant={filterOption === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('popular')}
              className="text-xs"
            >
              Popular
            </Button>
            <Button
              variant={filterOption === 'unsolved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('unsolved')}
              className="text-xs"
            >
              Unsolved
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="border border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={handleAskQuestion} className="md:w-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>
      </div>
      
      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No questions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to ask a question in this space.
              </p>
              <Button onClick={handleAskQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className={question.isSolved ? 'border-green-200 dark:border-green-900' : ''}>
              {question.isSolved && (
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-1 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Solved Question
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center space-y-2 w-14">
                    <button 
                      className={`flex flex-col items-center ${
                        question.isVoted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                      } hover:text-primary-600 dark:hover:text-primary-400`}
                    >
                      <ArrowUp className="h-5 w-5" />
                      <span className="font-medium mt-1">{question.votes}</span>
                    </button>
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 text-xs">
                      <Eye className="h-4 w-4 mb-1" />
                      <span>{question.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={question.author.avatar} />
                        <AvatarFallback>{question.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {question.author.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(question.createdAt)}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-xl font-medium mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => setLocation(`/site/${siteSD}/${space.slug}/question/${question.id}`)}
                    >
                      {question.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {question.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>
                          {question.answers} {question.answers === 1 ? 'answer' : 'answers'}
                        </span>
                      </div>
                      
                      <button 
                        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => setLocation(`/site/${siteSD}/${space.slug}/question/${question.id}`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Answer
                      </button>
                      
                      <button className="flex items-center hover:text-primary-600 dark:hover:text-primary-400">
                        <BookmarkPlus className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {questions.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="text-sm">
            Load More
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
} 