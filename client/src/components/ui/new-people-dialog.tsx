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
  Send,
  Edit,
  ChevronDown,
  Link
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewPeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPeopleDialog({ open, onOpenChange }: NewPeopleDialogProps) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [inviteLink, setInviteLink] = React.useState("https://bettermode.com/hub/auth/join/MW3EIYLbLsGImkbibhJQy");
  const [selectedRole, setSelectedRole] = React.useState("Member");

  const handleSendInvites = () => {
    // TODO: Implement send invites functionality
    console.log("Send invites:", { email, name, message });
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // TODO: Show toast notification
    console.log("Invite link copied");
  };

  const handleCancel = () => {
    setEmail("");
    setName("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl h-[85vh] p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between p-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="ml-2 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
              Invite members to Bettermode Community
            </DialogTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              
              {/* Share invite link Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Share invite link
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Anyone with this link can join as a member.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="px-4"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                    Or invite manually
                  </span>
                </div>
              </div>

              {/* Manual Invite Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Or invite manually
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                      </label>
                      <Input
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name (optional)
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Name (optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-gray-200 dark:border-gray-700 pr-8"
                        />
                        {name && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                            onClick={() => setName("")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-600 dark:text-gray-400"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add another or multiple at once
                  </Button>
                </div>
              </div>

              {/* Spaces to join Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Spaces to join
                  </h3>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm"
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Newly invited members will automatically join these spaces:
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="font-medium">Knowledge Base</span>, <span className="font-medium">Product Updates</span>, <span className="font-medium">Getting Started</span>, <span className="font-medium">Intros & Networking</span>, <span className="font-medium">Events</span>, <span className="font-medium">Ask the Community</span>, <span className="font-medium">Content Management</span>, <span className="font-medium">Wishlist</span>, <span className="font-medium">Member Management</span>, <span className="font-medium">Appearance & Design</span>, <span className="font-medium">Reports & Analytics</span>, <span className="font-medium">Apps & Integrations</span>, <span className="font-medium">API & Webhooks</span>, and <span className="font-medium">Feed</span>
                  </p>
                </div>
              </div>

              {/* Role Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Role
                  </h3>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm"
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New members will automatically become{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedRole}
                  </span>
                </p>
              </div>

              {/* Custom Message Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Custom message
                </h3>
                <Button
                  variant="link"
                  className="p-0 h-auto text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm justify-start"
                >
                  Add a custom message to the invitation
                </Button>
              </div>
        </div>
        </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-end p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
              disabled={!email.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 