import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users,
  Mail,
  X,
  Plus,
  UserPlus,
  Copy,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewPeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPeopleDialog({ open, onOpenChange }: NewPeopleDialogProps) {
  const [emails, setEmails] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [inviteLink, setInviteLink] = React.useState("https://community.example.com/invite/abc123");

  const handleSendInvites = () => {
    // TODO: Implement send invites functionality
    console.log("Send invites:", { emails, message });
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // TODO: Show toast notification
    console.log("Invite link copied");
  };

  const handleCancel = () => {
    setEmails("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite People
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Email Invites Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Addresses
              </label>
              <Textarea
                placeholder="Enter email addresses separated by commas or new lines:
john@example.com
jane@example.com, bob@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="min-h-[100px] border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate multiple email addresses with commas or new lines
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal Message (Optional)
              </label>
              <Textarea
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or share invite link
              </span>
            </div>
          </div>

          {/* Invite Link Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invite Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Anyone with this link can join your community
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>Invites will be sent from your community</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvites}
              disabled={!emails.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Invites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 