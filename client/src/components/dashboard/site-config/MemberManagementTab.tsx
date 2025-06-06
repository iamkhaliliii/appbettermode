import { useState } from "react";
import {
  Users,
  UserPlus,
  UserX,
  Shield,
  Crown,
  Eye,
  EyeOff,
  Search,
  Mail,
  MoreHorizontal
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function MemberManagementTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [allowInvitations, setAllowInvitations] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [memberVisibility, setMemberVisibility] = useState('public');
  const [autoAcceptMembers, setAutoAcceptMembers] = useState(true);
  const [notifyNewMembers, setNotifyNewMembers] = useState(true);
  const [maxMembers, setMaxMembers] = useState('unlimited');

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <h3 className="text-lg font-medium mb-2">Member Management</h3>
        <p className="text-sm">Control who can join your space and manage member permissions and visibility settings.</p>
      </div>

      {/* Member Settings */}
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        {/* Invitation Settings */}
        <PropertyRow
          label="Allow invitations"
          value={allowInvitations}
          fieldName="allowInvitations"
          type="checkbox"
          onValueChange={setAllowInvitations}
          icon={UserPlus}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="Allow existing members to invite new members to this space"
        />

        <PropertyRow
          label="Require approval"
          value={requireApproval}
          fieldName="requireApproval"
          type="checkbox"
          onValueChange={setRequireApproval}
          icon={Shield}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="New member requests require admin approval before joining"
        />

        <PropertyRow
          label="Auto-accept members"
          value={autoAcceptMembers}
          fieldName="autoAcceptMembers"
          type="checkbox"
          onValueChange={setAutoAcceptMembers}
          icon={UserPlus}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="Automatically accept new members without manual review"
        />

        <PropertyRow
          label="Member visibility"
          value={memberVisibility}
          fieldName="memberVisibility"
          type="select"
          options={[
            { 
              value: 'public', 
              label: 'Public',
              description: 'Member list is visible to everyone',
              icon: Eye
            },
            { 
              value: 'members_only', 
              label: 'Members only',
              description: 'Member list is only visible to space members',
              icon: Users
            },
            { 
              value: 'admins_only', 
              label: 'Admins only',
              description: 'Member list is only visible to space admins',
              icon: Shield
            },
            { 
              value: 'hidden', 
              label: 'Hidden',
              description: 'Member list is completely hidden',
              icon: EyeOff
            }
          ]}
          onValueChange={setMemberVisibility}
          icon={Eye}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="Control who can see the list of space members"
        />

        <PropertyRow
          label="Maximum members"
          value={maxMembers}
          fieldName="maxMembers"
          type="select"
          options={[
            { 
              value: 'unlimited', 
              label: 'Unlimited',
              description: 'No limit on the number of members',
              icon: Users
            },
            { 
              value: '50', 
              label: '50 members',
              description: 'Limit space to 50 members',
              icon: Users
            },
            { 
              value: '100', 
              label: '100 members',
              description: 'Limit space to 100 members',
              icon: Users
            },
            { 
              value: '500', 
              label: '500 members',
              description: 'Limit space to 500 members',
              icon: Users
            },
            { 
              value: '1000', 
              label: '1000 members',
              description: 'Limit space to 1000 members',
              icon: Users
            }
          ]}
          onValueChange={setMaxMembers}
          icon={Users}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="Set the maximum number of members allowed in this space"
        />

        <PropertyRow
          label="Notify new members"
          value={notifyNewMembers}
          fieldName="notifyNewMembers"
          type="checkbox"
          onValueChange={setNotifyNewMembers}
          icon={Mail}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          description="Send welcome email to new members when they join"
        />
      </div>

      {/* Current Members Section */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Current Members</h4>
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Sample member list */}
          {[
            { name: 'John Doe', role: 'Admin', avatar: '👤' },
            { name: 'Jane Smith', role: 'Member', avatar: '👤' },
            { name: 'Mike Johnson', role: 'Member', avatar: '👤' }
          ].map((member, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
                  {member.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                </div>
              </div>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 