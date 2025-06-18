import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { BaseFormData, ComposerModalProps, LayoutMode } from "./types";
import { ContentEditor } from "./ContentEditor";
import { ComposerFooter } from "./ComposerFooter";

const drawerAnimationClasses = `
  .main-content-shift {
    transition: margin-right 300ms ease-in-out;
  }
`;

export function ComposerModal<T extends BaseFormData>({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  FormFieldsComponent,
  SidebarComponent,
  PreviewComponent,
  createButtonText = "Create Post",
  scheduleButtonText = "Schedule Post",
  scheduleMenuText = "Schedule post",
  titlePlaceholder = "Post title",
  defaultLayoutMode = LayoutMode.NORMAL,
  allowLayoutModeSwitch = true,
}: ComposerModalProps<T>) {
  // UI state
  const [layoutMode, setLayoutMode] = React.useState<LayoutMode>(defaultLayoutMode);
  const [editingField, setEditingField] = React.useState<string | null>(null);

  // Form data state - starts with base form data and extends as needed
  const [formData, setFormData] = React.useState<T>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    space: initialData?.space || "",
    ...initialData,
  } as T);

  // Status and scheduling state
  const [currentStatus, setCurrentStatus] = React.useState<string>("Draft");
  const [isSchedulePopoverOpen, setIsSchedulePopoverOpen] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Content state for editor
  const [content, setContent] = React.useState<any[]>([]);

  // Update form field helper
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Field editing handlers
  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingField(null);
    }
  };

  // Content change handler
  const handleContentChange = (newContent: any[]) => {
    setContent(newContent);
    updateField('content' as keyof T, JSON.stringify(newContent) as T[keyof T]);
  };

  // Layout mode cycling handler
  const toggleLayoutMode = () => {
    if (!allowLayoutModeSwitch) return;
    
    setLayoutMode(current => {
      switch (current) {
        case LayoutMode.NORMAL:
          return LayoutMode.SIDEBAR;
        case LayoutMode.SIDEBAR:
          return LayoutMode.FULLSCREEN;
        case LayoutMode.FULLSCREEN:
          return LayoutMode.NORMAL;
        default:
          return LayoutMode.NORMAL;
      }
    });
  };

  // Validation
  const isValid = formData.title.trim().length > 0;

  // Action handlers
  const handleConfirm = () => {
    if (isValid) {
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        content: JSON.stringify(content),
      } as T);
      onOpenChange(false);
    }
  };

  const handleSaveDraft = () => {
    console.log("Save draft:", { formData, content });
    // TODO: Implement save draft functionality
  };

  const handleScheduleConfirm = (scheduledDateTime: Date) => {
    setScheduledDate(scheduledDateTime);
    setCurrentStatus("Schedule");
    console.log("Post scheduled for:", scheduledDateTime.toLocaleString());
  };

  const handleRemoveSchedule = () => {
    setScheduledDate(null);
    setCurrentStatus("Draft");
    console.log("Schedule removed");
  };

  const handleEditSchedule = (newScheduledDateTime: Date) => {
    setScheduledDate(newScheduledDateTime);
    console.log("Schedule updated to:", newScheduledDateTime.toLocaleString());
  };

  const handlePublish = () => {
    console.log("Publishing new post:", { formData, content });
    alert(`Published new post: "${formData.title}"`);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Common props for form fields and sidebar
  const commonProps = {
    formData,
    onUpdateField: updateField,
    editingField,
    onFieldClick: handleFieldClick,
    onFieldBlur: handleFieldBlur,
    onKeyDown: handleKeyDown,
  };

  return (
    <>
      <style>{drawerAnimationClasses}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent           className={cn(
            "p-0 overflow-hidden gap-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col [&>button]:hidden",
            layoutMode === LayoutMode.FULLSCREEN 
              ? "w-[95vw] h-[95vh] max-w-none max-h-none" 
              : "w-[90vw] max-w-4xl h-[80vh]"
          )}>
          {/* Top Right Control Buttons */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-1">
            {allowLayoutModeSwitch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLayoutMode}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
                title={`Switch to ${layoutMode === LayoutMode.NORMAL ? 'sidebar' : layoutMode === LayoutMode.SIDEBAR ? 'fullscreen' : 'normal'} mode`}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content Area - Takes available space */}
          <div className="flex-1 flex flex-row overflow-hidden">
            {/* Content Layout - Different modes: normal (form+preview), sidebar (main+sidebar), fullscreen (main+sidebar full) */}
            {layoutMode === LayoutMode.NORMAL ? (
              // Normal Layout: Form fields + Preview (2:1 ratio)
              <>
                {/* Left Side - Content (2/3) */}
                <div className="w-2/3 flex flex-col h-full">
                  {/* Content Area - Full width without sidebar */}
                  <div className="flex-1 pt-8 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                    <div className="">
                      {/* Title */}
                      <div className="px-8 pb-4">
                        <Input
                          id="title"
                          placeholder={titlePlaceholder}
                          value={formData.title}
                          onChange={(e) => updateField('title' as keyof T, e.target.value as T[keyof T])}
                          className="text-3xl font-semibold border-0 border-transparent bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-0 focus:border-transparent focus:outline-none outline-none px-0 py-2 placeholder:text-gray-300 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 hover:bg-transparent focus:bg-transparent shadow-none focus:shadow-none ring-0 ring-offset-0 [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:outline-none [&:focus]:border-0 [&:focus]:shadow-none"
                          style={{
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none'
                          }}
                          onFocus={(e) => {
                            e.target.style.outline = 'none';
                            e.target.style.border = 'none';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      {/* Form Fields */}
                      <FormFieldsComponent {...commonProps} />

                      {/* Content Editor */}
                      <div className="mt-6 pb-6">
                        <ContentEditor 
                          content={content}
                          onContentChange={handleContentChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Preview (1/3) */}
                <div className="w-1/3 h-full bg-white dark:bg-gray-800 overflow-hidden relative">
                  <div className="w-[120%] h-[120%] bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5 backdrop-blur-sm rounded-xl border border-emerald-200/30 dark:border-emerald-800/20 relative">
                    {/* Framed preview area */}
                    <div className="absolute bottom-0 right-0 left-16 top-16 rounded-xl border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-4 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]">
                      <div className="w-full">
                        <PreviewComponent />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Sidebar or Fullscreen Layout: Main content + Sidebar (no preview)
              <>
                {/* Left Content Area */}
                <div className={cn(
                  "flex flex-col h-full border-r border-gray-100 dark:border-gray-700",
                  layoutMode === LayoutMode.FULLSCREEN ? "w-3/4" : "w-[60%]"
                )}>
                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                    <div className="">
                      {/* Title */}
                      <div className="px-14 pt-12 pb-4">
                        <Input
                          id="title"
                          placeholder={titlePlaceholder}
                          value={formData.title}
                          onChange={(e) => updateField('title' as keyof T, e.target.value as T[keyof T])}
                          className="text-3xl font-semibold border-0 border-transparent bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-0 focus:border-transparent focus:outline-none outline-none px-0 py-2 placeholder:text-gray-300 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 hover:bg-transparent focus:bg-transparent shadow-none focus:shadow-none ring-0 ring-offset-0 [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:outline-none [&:focus]:border-0 [&:focus]:shadow-none"
                          style={{
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none'
                          }}
                          onFocus={(e) => {
                            e.target.style.outline = 'none';
                            e.target.style.border = 'none';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      {/* Content Editor */}
                      <div className="px-0 pb-6">
                        <ContentEditor 
                          content={content}
                          onContentChange={handleContentChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <SidebarComponent 
                  {...commonProps} 
                  className={cn(
                    layoutMode === LayoutMode.FULLSCREEN ? "w-1/4" : "w-[40%]"
                  )}
                />
              </>
            )}
          </div>

          {/* Footer Actions - Fixed at Bottom */}
          <ComposerFooter
            isValid={isValid}
            scheduledDate={scheduledDate}
            currentStatus={currentStatus}
            isSchedulePopoverOpen={isSchedulePopoverOpen}
            isDropdownOpen={isDropdownOpen}
            onCancel={handleCancel}
            onPublish={handlePublish}
            onConfirm={handleConfirm}
            onSaveDraft={handleSaveDraft}
            onScheduleConfirm={handleScheduleConfirm}
            onEditSchedule={handleEditSchedule}
            onRemoveSchedule={handleRemoveSchedule}
            onSchedulePopoverOpenChange={setIsSchedulePopoverOpen}
            onDropdownOpenChange={setIsDropdownOpen}
            createButtonText={createButtonText}
            scheduleButtonText={scheduleButtonText}
            scheduleMenuText={scheduleMenuText}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 