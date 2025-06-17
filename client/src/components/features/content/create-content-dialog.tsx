import * as React from "react";
import { ContentTypeSelector, ContentType } from "./content-type-selector";
import { NewPostDialog } from "./new-post-dialog";
import { EventCreateForm } from "./event-create-form";
import { Post } from "@/components/dashboard/site-config/content/types";

export interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: Post | null;
  onStatusChange?: (post: Post, newStatus: string) => void;
}

export function CreateContentDialog({
  open,
  onOpenChange,
  editingPost,
  onStatusChange
}: CreateContentDialogProps) {
  const [selectedContentType, setSelectedContentType] = React.useState<ContentType | null>(null);
  const [showNewPostDialog, setShowNewPostDialog] = React.useState(false);
  const [showEventDialog, setShowEventDialog] = React.useState(false);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedContentType(null);
      setShowNewPostDialog(false);
      setShowEventDialog(false);
    }
  }, [open]);

  // If editing an existing post, skip content type selection
  React.useEffect(() => {
    if (editingPost && open) {
      setShowNewPostDialog(true);
      setSelectedContentType(null);
    }
  }, [editingPost, open]);

  const handleContentTypeSelect = (contentType: ContentType) => {
    console.log('Selected content type in CreateContentDialog:', contentType);
    setSelectedContentType(contentType);
    
    if (contentType.id === 'event') {
      setShowEventDialog(true);
    } else {
      setShowNewPostDialog(true);
    }
  };

  const handleNewPostDialogClose = () => {
    setShowNewPostDialog(false);
    setSelectedContentType(null);
    onOpenChange(false);
  };

  const handleEventDialogClose = () => {
    setShowEventDialog(false);
    setSelectedContentType(null);
    onOpenChange(false);
  };

  const handleDialogClose = () => {
    setShowNewPostDialog(false);
    setShowEventDialog(false);
    setSelectedContentType(null);
    onOpenChange(false);
  };

  const handleEventSubmit = (eventData: any) => {
    console.log('Event created:', eventData);
    // Handle event creation here
    handleEventDialogClose();
  };

  return (
    <>
      {/* Content Type Selector - Only show for new posts */}
      {!editingPost && (
        <ContentTypeSelector
          open={open && !showNewPostDialog && !showEventDialog}
          onOpenChange={handleDialogClose}
          onContentTypeSelect={handleContentTypeSelect}
        />
      )}
      
      {/* New Post Dialog */}
      <NewPostDialog
        open={showNewPostDialog}
        onOpenChange={handleNewPostDialogClose}
        editingPost={editingPost}
        onStatusChange={onStatusChange}
        selectedContentType={selectedContentType}
      />

      {/* Event Create Dialog */}
      <EventCreateForm
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onSubmit={handleEventSubmit}
      />
    </>
  );
} 