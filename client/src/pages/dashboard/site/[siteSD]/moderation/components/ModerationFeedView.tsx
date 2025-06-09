import React from "react";
import { Badge, Button, Card, CardContent } from "@/components/ui/primitives";
import { 
  Eye, 
  Trash2, 
  CheckCircle, 
  Flag, 
  Hash, 
  Clock,
  User,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  UserX,
  Ban
} from "lucide-react";
import { ModerationItem } from "./ModerationData";

interface ModerationFeedViewProps {
  data: ModerationItem[];
  getAlertBadgeColor: (alert: string) => string;
  getStatusBadge: (status: string) => string;
}

export const ModerationFeedView: React.FC<ModerationFeedViewProps> = ({
  data,
  getAlertBadgeColor,
  getStatusBadge
}) => {
  // Render member card for member moderation
  const renderMemberCard = (item: ModerationItem) => (
    <Card key={item.id} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header with status and alerts */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Status badge */}
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-1 rounded-full border ${getStatusBadge(item.status)}`}
            >
              {item.status === 'pending' ? (
                <Clock className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {item.status === 'pending' ? 'Pending Approval' : 'Reported User'}
            </Badge>
          </div>
          
          {/* Alerts/Flags */}
          <div className="flex items-center gap-1">
            {item.alerts.map((alert, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs px-2 py-0.5 rounded-full border ${getAlertBadgeColor(alert)}`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {alert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Member Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
            />
            {item.status === 'reported' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <Flag className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {item.author.name}
              </h3>
              <User className="h-4 w-4 text-gray-400" />
            </div>
            
            {item.author.email && (
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {item.author.email}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{item.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Reason/Description */}
        {(item.reportReason || item.title) && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {item.status === 'pending' ? 'Registration Details' : 'Report Reason'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.reportReason || item.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {item.status === 'reported' && (
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <Ban className="h-4 w-4 mr-1" />
                Ban User
              </Button>
            )}
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              {item.status === 'pending' ? 'Approve' : 'Dismiss Report'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render post card for post moderation
  const renderPostCard = (item: ModerationItem) => (
    <Card key={item.id} className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        {/* Header with space and alerts */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Space badge - more prominent */}
            {item.space && (
              <Badge variant="outline" className="text-xs px-2.5 py-1 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700">
                <Hash className="h-3 w-3 mr-1" />
                {item.space.name}
              </Badge>
            )}
            
            {/* Status badge */}
            <Badge
              variant="outline"
              className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(item.status)}`}
            >
              <Flag className="h-3 w-3 mr-1" />
              {item.status}
            </Badge>
          </div>
          
          {/* Alerts on the right */}
          <div className="flex items-center gap-1">
            {item.alerts.map((alert, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs px-2 py-0.5 rounded-full border ${getAlertBadgeColor(alert)}`}
              >
                {alert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Author info */}
        <div className="flex items-center mb-3">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {item.author.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{item.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {item.title}
          </h2>
          {item.content && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {item.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {data.map((item) => 
        item.type === 'member' ? renderMemberCard(item) : renderPostCard(item)
      )}
    </div>
  );
}; 