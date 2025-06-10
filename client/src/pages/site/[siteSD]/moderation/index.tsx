import React, { useState, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { SiteLayout } from '@/components/layout/site';
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
  Edit,
  Trash2,
  Send,
  UserX,
  Ban,
  ArrowLeft
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
    reportReason: 'Spam content',
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
    reportReason: 'Akismet',
    space: 'Off Topic'
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
    reportReason: 'Suspicious activity'
  }
];

const CONTENT_MODERATION_ITEMS = [
  { key: 'scheduled-posts', label: 'Scheduled Posts', icon: Calendar, count: 1 },
  { key: 'drafts-posts', label: 'Draft Posts', icon: FileText, count: 1 },
  { key: 'pending-posts', label: 'Pending Posts', icon: Clock, count: 1 },
  { key: 'reported-posts', label: 'Reported Posts', icon: AlertTriangle, count: 2 }
];

const MEMBER_MODERATION_ITEMS = [
  { key: 'pending-members', label: 'Pending Members', icon: UserCheck, count: 1 },
  { key: 'reported-members', label: 'Reported Members', icon: Users, count: 1 }
];

const ALL_SIDEBAR_ITEMS = [...CONTENT_MODERATION_ITEMS, ...MEMBER_MODERATION_ITEMS];

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
          { icon: Edit, label: 'Edit Schedule', variant: 'outline' as const, color: 'default' },
          { icon: XCircle, label: 'Cancel', variant: 'outline' as const, color: 'destructive' }
        ];
      case 'draft':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Send, label: 'Publish', variant: 'default' as const, color: 'default' },
          { icon: Trash2, label: 'Delete', variant: 'outline' as const, color: 'destructive' }
        ];
      case 'pending':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: CheckCircle, label: 'Approve', variant: 'default' as const, color: 'default' },
          { icon: XCircle, label: 'Reject', variant: 'outline' as const, color: 'destructive' }
        ];
      case 'reported':
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' },
          { icon: Trash2, label: 'Remove', variant: 'destructive' as const, color: 'destructive' },
          { icon: CheckCircle, label: 'Keep', variant: 'outline' as const, color: 'default' },
          { icon: UserX, label: 'Ban User', variant: 'outline' as const, color: 'destructive' }
        ];
      default:
        return [
          { icon: Eye, label: 'View', variant: 'outline' as const, color: 'default' }
        ];
    }
  };

  const PostCard = ({ post }: { post: ModerationPost }) => {
    const actions = getPostActions(post);
    
    return (
      <Card className="p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {post.author.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {post.author.username} • {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(post.status)}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Enhanced metadata section */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
              Space: {post.space}
            </span>
            {post.scheduledFor && (
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                📅 {formatDate(post.scheduledFor)}
              </span>
            )}
          </div>
          {post.reportReason && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Report: {post.reportReason}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic action buttons */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button 
                key={index}
                variant={action.variant} 
                size="sm"
                className={action.color === 'destructive' ? 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300' : ''}
              >
                <Icon className="h-4 w-4 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </Card>
    );
  };

  const getMemberActions = (member: ModerationMember) => {
    switch (member.status) {
      case 'pending':
        return [
          { icon: Eye, label: 'View Profile', variant: 'outline' as const, color: 'default' },
          { icon: CheckCircle, label: 'Approve', variant: 'default' as const, color: 'default' },
          { icon: XCircle, label: 'Reject', variant: 'outline' as const, color: 'destructive' }
        ];
      case 'reported':
        return [
          { icon: Eye, label: 'View Profile', variant: 'outline' as const, color: 'default' },
          { icon: Ban, label: 'Ban User', variant: 'destructive' as const, color: 'destructive' },
          { icon: CheckCircle, label: 'Dismiss Report', variant: 'outline' as const, color: 'default' },
          { icon: AlertTriangle, label: 'Warn User', variant: 'outline' as const, color: 'destructive' }
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
      <Card className="p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {member.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {member.email}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {formatDate(member.joinedAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(member.status)}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {member.reportReason && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                Report: {member.reportReason}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button 
                key={index}
                variant={action.variant} 
                size="sm"
                className={action.color === 'destructive' ? 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300' : ''}
              >
                <Icon className="h-4 w-4 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </Card>
    );
  };

  const currentItem = ALL_SIDEBAR_ITEMS.find(item => item.key === section);

  return (
    <SiteLayout siteSD={siteSD} site={siteDetails}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}

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

              {/* Content Moderation Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
          <div className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentItem?.label || 'Pending Posts'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filteredData.length} item{filteredData.length !== 1 ? 's' : ''} to review
                </p>
              </div>

              <div className="space-y-4">
                {filteredData.length === 0 ? (
                  <Card className="p-8 text-center bg-white dark:bg-gray-800">
                    <div className="text-gray-500 dark:text-gray-400">
                      No items to moderate at this time
                    </div>
                  </Card>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Pending Posts
                  </span>
                  <Badge variant="outline">
                    {MOCK_POSTS.filter(p => p.status === 'pending').length}
                  </Badge>
                </div>
                
                                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">
                     Reported Posts
                   </span>
                   <Badge variant="destructive">
                     {MOCK_POSTS.filter(p => p.status === 'reported').length}
                   </Badge>
                 </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Pending Members
                  </span>
                  <Badge variant="outline">
                    {MOCK_MEMBERS.filter(m => m.status === 'pending').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Reported Members
                  </span>
                  <Badge variant="destructive">
                    {MOCK_MEMBERS.filter(m => m.status === 'reported').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Scheduled Posts
                  </span>
                  <Badge variant="secondary">
                    {MOCK_POSTS.filter(p => p.status === 'scheduled').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Draft Posts
                  </span>
                  <Badge variant="secondary">
                    {MOCK_POSTS.filter(p => p.status === 'draft').length}
                  </Badge>
                </div>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

export default withSiteContext(SiteModerationPage); 