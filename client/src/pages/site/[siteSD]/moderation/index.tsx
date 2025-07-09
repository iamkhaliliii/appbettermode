import React, { useState, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { withSiteContext, WithSiteContextProps } from '@/lib/with-site-context';
import { Card } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import {
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  Users,
  UserCheck,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Send,
  UserX,
  Ban,
  ArrowLeft,
  Folder,
  CalendarClock,
  Pause
} from 'lucide-react';

// Mock data for moderation items
interface ModerationPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    username: string;
  };
  createdAt: string;
  status: 'scheduled' | 'draft' | 'pending' | 'reported';
  reportReason?: string;
  scheduledFor?: string;
  space: string;
}

interface ModerationMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'pending' | 'reported';
  joinedAt: string;
  reportReason?: string;
}

const MOCK_POSTS: ModerationPost[] = [
  {
    id: '1',
    title: 'Welcome to our community discussion',
    content: 'This is a sample post that needs moderation approval. Looking forward to engaging with everyone here!',
    author: {
      name: 'John Doe',
      username: '@johndoe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    createdAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    space: 'General Discussion'
  },
  {
    id: '2',
    title: 'Scheduled announcement for next week',
    content: 'This post is scheduled to be published next week announcing our new features and improvements...',
    author: {
      name: 'Jane Smith',
      username: '@janesmith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    createdAt: '2024-01-14T15:45:00Z',
    status: 'scheduled',
    scheduledFor: '2024-01-22T09:00:00Z',
    space: 'Announcements'
  },
  {
    id: '3',
    title: 'Draft post about community guidelines',
    content: 'This is a draft post that needs completion. Working on comprehensive guidelines for our community...',
    author: {
      name: 'Admin User',
      username: '@admin',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    createdAt: '2024-01-13T12:20:00Z',
    status: 'draft',
    space: 'Guidelines'
  },
  {
    id: '4',
    title: 'Pass CS0-003 Dumps with DumpsBoss for Top Results',
    content: 'Boost Your Confidence. Confidence plays a significant role in exam success. When you feel well-prepared, you approach the exam with a sense of assurance, which can positively impact your performance. By practicing with DumpsBoss dumps, you will be able to identify CS0-003 Exam Dumps areas where you need improvement and work on them before the actual exam.',
    author: {
      name: 'Amanda Merrifield',
      username: '@amanda_merrifield',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    createdAt: '2024-01-12T08:15:00Z',
    status: 'reported',
    reportReason: 'Spam',
    space: 'General'
  },
  {
    id: '5',
    title: 'Another suspicious post',
    content: 'This is another example of reported content that contains spam or inappropriate material...',
    author: {
      name: 'Suspect User',
      username: '@suspectuser',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    createdAt: '2024-01-11T14:20:00Z',
    status: 'reported',
    reportReason: 'Harassment or hate speech',
    space: 'Off Topic'
  },
  {
    id: '6',
    title: 'False information about recent events',
    content: 'This post contains misleading information about current events that could confuse readers...',
    author: {
      name: 'Misleading User',
      username: '@misleadinguser',
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    createdAt: '2024-01-10T16:30:00Z',
    status: 'reported',
    reportReason: 'Misinformation',
    space: 'News & Updates'
  }
];

const MOCK_MEMBERS: ModerationMember[] = [
  {
    id: '1',
    name: 'New Member 1',
    email: 'newmember1@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'pending',
    joinedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Reported Member',
    email: 'reported@example.com',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'reported',
    joinedAt: '2024-01-10T09:15:00Z',
    reportReason: 'Harmful activities'
  }
];

const CONTENT_PLANNING_ITEMS = [
  { key: 'scheduled-posts', label: 'Scheduled Posts', icon: Calendar, count: 1 },
  { key: 'drafts-posts', label: 'Draft Posts', icon: FileText, count: 1 }
];

const CONTENT_MODERATION_ITEMS = [
  { key: 'pending-posts', label: 'Pending Posts', icon: Clock, count: 1 },
  { key: 'reported-posts', label: 'Reported Posts', icon: AlertTriangle, count: 3 }
];

const MEMBER_MODERATION_ITEMS = [
  { key: 'pending-members', label: 'Pending Members', icon: UserCheck, count: 1 },
  { key: 'reported-members', label: 'Reported Members', icon: Users, count: 1 }
];

const ALL_SIDEBAR_ITEMS = [...CONTENT_PLANNING_ITEMS, ...CONTENT_MODERATION_ITEMS, ...MEMBER_MODERATION_ITEMS];

function SiteModerationPage({ siteId, siteDetails }: WithSiteContextProps) {
  const [, params] = useRoute('/site/:siteSD/moderation/:section?');
  const section = params?.section || 'pending-posts';
  const siteSD = params?.siteSD || '';

  // Get filtered data based on section
  const filteredData = useMemo(() => {
    switch (section) {
      case 'scheduled-posts':
        return MOCK_POSTS.filter(post => post.status === 'scheduled');
      case 'drafts-posts':
        return MOCK_POSTS.filter(post => post.status === 'draft');
      case 'pending-posts':
        return MOCK_POSTS.filter(post => post.status === 'pending');
      case 'reported-posts':
        return MOCK_POSTS.filter(post => post.status === 'reported');
      case 'pending-members':
        return MOCK_MEMBERS.filter(member => member.status === 'pending');
      case 'reported-members':
        return MOCK_MEMBERS.filter(member => member.status === 'reported');
      default:
        return MOCK_POSTS.filter(post => post.status === 'pending');
    }
  }, [section]);

  const isMemberSection = section.includes('members');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      scheduled: { variant: 'outline', text: 'Scheduled' },
      draft: { variant: 'secondary', text: 'Draft' },
      pending: { variant: 'outline', text: 'Pending' },
      reported: { variant: 'destructive', text: 'Reported' }
    } as const;
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPostActions = (post: ModerationPost) => {
    switch (post.status) {
      case 'scheduled':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Edit, label: 'Edit', variant: 'outline' as const, color: 'default' },
          { icon: CalendarClock, label: 'Edit Schedule', variant: 'outline' as const, color: 'default' },
          { icon: XCircle, label: 'Cancel', variant: 'outline' as const, color: 'destructive' },
          { icon: Send, label: 'Publish Now', variant: 'success' as const, color: 'default' }
        ];
      case 'draft':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Edit, label: 'Edit', variant: 'outline' as const, color: 'default' },
          { icon: Trash2, label: 'Delete', variant: 'outline' as const, color: 'destructive' },
          { icon: Send, label: 'Publish', variant: 'success' as const, color: 'default' }
        ];
      case 'pending':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Edit, label: 'Edit', variant: 'outline' as const, color: 'default' },
          { icon: XCircle, label: 'Reject', variant: 'outline' as const, color: 'destructive' },
          { icon: CheckCircle, label: 'Approve', variant: 'success' as const, color: 'default' }
        ];
      case 'reported':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Edit, label: 'Edit', variant: 'outline' as const, color: 'default' },
          { icon: CheckCircle, label: 'Keep', variant: 'outline-success' as const, color: 'default' },
          { icon: EyeOff, label: 'Hide', variant: 'outline' as const, color: 'default' },
          { icon: Trash2, label: 'Remove', variant: 'destructive' as const, color: 'destructive' }
        ];
      default:
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Edit, label: 'Edit', variant: 'outline' as const, color: 'default' }
        ];
    }
  };

  const PostCard = ({ post }: { post: ModerationPost }) => {
    const actions = getPostActions(post);
    
    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg overflow-hidden">
        {/* Status Indicator Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          post.status === 'reported' ? 'bg-red-500' :
          post.status === 'pending' ? 'bg-amber-500' :
          post.status === 'scheduled' ? 'bg-blue-500' :
          'bg-gray-500'
        }`} />
        
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {post.author.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {post.author.name}
                  </h4>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <time className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {post.author.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusBadge(post.status)}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {post.content}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <Folder className="h-3 w-3 mr-1.5" />
                  {post.space}
                </div>
              </div>
              
              {post.scheduledFor && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {formatDate(post.scheduledFor)}
                </div>
              )}
            </div>
            
            {post.reportReason && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                      Report Reason
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {post.reportReason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Left side - Secondary actions (View, Edit) - Compact */}
            <div className="flex items-center space-x-1">
              {actions.filter(action => ['View', 'Edit', 'Edit Schedule'].includes(action.label)).map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={`secondary-${index}`}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
            
            {/* Right side - Primary actions (Approve/Reject, Publish/Remove, etc.) */}
            <div className="flex items-center space-x-2">
              {actions.filter(action => !['View', 'Edit', 'Edit Schedule'].includes(action.label)).map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={`primary-${index}`}
                    variant={action.color === 'destructive' 
                      ? (action.variant === 'outline' ? 'outline-destructive' : 'destructive')
                      : action.variant
                    } 
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getMemberActions = (member: ModerationMember) => {
    switch (member.status) {
      case 'pending':
        return [
          { icon: Eye, label: 'View Profile', variant: 'outline' as const, color: 'default' },
          { icon: XCircle, label: 'Reject', variant: 'outline' as const, color: 'destructive' },
          { icon: CheckCircle, label: 'Approve', variant: 'success' as const, color: 'default' }
        ];
      case 'reported':
        return [
          { icon: Eye, label: 'View Profile', variant: 'outline' as const, color: 'default' },
          { icon: CheckCircle, label: 'Keep', variant: 'outline-success' as const, color: 'default' },
          { icon: Pause, label: 'Suspend', variant: 'warning' as const, color: 'default' },
          { icon: Trash2, label: 'Remove', variant: 'destructive' as const, color: 'destructive' }
        ];
      default:
        return [
          { icon: Eye, label: 'View Profile', variant: 'outline' as const, color: 'default' }
        ];
    }
  };

  const MemberCard = ({ member }: { member: ModerationMember }) => {
    const actions = getMemberActions(member);
    
    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg overflow-hidden">
        {/* Status Indicator Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          member.status === 'reported' ? 'bg-red-500' : 'bg-amber-500'
        }`} />
        
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-semibold text-lg">
                  {member.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {member.email}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {formatDate(member.joinedAt)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusBadge(member.status)}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Report Section */}
          {member.reportReason && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    Member Report
                  </h5>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {member.reportReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Left side - Secondary actions (View Profile) */}
            <div className="flex items-center space-x-2">
              {actions.filter(action => action.label === 'View Profile').map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={`secondary-${index}`}
                    variant="ghost"
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
            
            {/* Right side - Primary actions (Approve/Reject, Ban/Dismiss, etc.) */}
            <div className="flex items-center space-x-2">
              {actions.filter(action => action.label !== 'View Profile').map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={`primary-${index}`}
                    variant={action.variant}
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentItem = ALL_SIDEBAR_ITEMS.find(item => item.key === section);

  return (
      <div className="max-w-7xl mx-auto">
        {/* 3-Column Layout */}
        <div className="flex relative">
          {/* Left Sidebar */}
          <div className="w-64 p-4 sticky top-[4rem] self-start z-40">
            <div className="h-[calc(100vh-16rem)] overflow-y-auto ">
              <nav className="space-y-4">
              {/* Back to Site Link */}
              <Link
                href={`/site/${siteSD}`}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to site
              </Link>

              {/* Content Planning Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs text-gray-400 dark:text-gray-400 tracking-wider">
                  Content Planning
                </h3>
                {CONTENT_PLANNING_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = section === item.key;
                  
                  return (
                    <Link
                      key={item.key}
                      href={`/site/${siteSD}/moderation/${item.key}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </div>
                      {item.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Content Moderation Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs text-gray-400 dark:text-gray-400 tracking-wider">
                  Content Moderation
                </h3>
                {CONTENT_MODERATION_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = section === item.key;
                  
                  return (
                    <Link
                      key={item.key}
                      href={`/site/${siteSD}/moderation/${item.key}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </div>
                      {item.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Member Moderation Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs text-gray-400 dark:text-gray-400 tracking-wider">
                  Member Moderation
                </h3>
                {MEMBER_MODERATION_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = section === item.key;
                  
                  return (
                    <Link
                      key={item.key}
                      href={`/site/${siteSD}/moderation/${item.key}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </div>
                      {item.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
              </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentItem?.label || 'Pending Posts'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Review and moderate content that requires your attention
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {filteredData.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        item{filteredData.length !== 1 ? 's' : ''} pending
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="space-y-6">
                {filteredData.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      No items require moderation at this time. Check back later for new content to review.
                    </p>
                  </div>
                ) : (
                  filteredData.map((item: any) => (
                    isMemberSection ? (
                      <MemberCard key={item.id} member={item} />
                    ) : (
                      <PostCard key={item.id} post={item} />
                    )
                  ))
                )}
              </div>
              

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-4 sticky top-[4rem] self-start z-40">
            <div className="h-[calc(100vh-16rem)] overflow-y-auto">
              <Card className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h3>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Good evening,
                </p>
                
                <p className="text-gray-600 dark:text-gray-400">
                  Nothing to moderate here.
                </p>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="link" className="p-0 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Moderation settings
                  </Button>
                </div>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </div>
  );
}

export default withSiteContext(SiteModerationPage); 