import React from 'react';
import { motion } from 'framer-motion';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/primitives";
import { Input } from '@/components/ui/primitives';
import { Label } from '@/components/ui/primitives';
import { Checkbox } from '@/components/ui/primitives';
import { Switch } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { 
  Loader2,
  ArrowLeft, 
  AlertCircle,
  User,
  Clock,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  CheckCircle,
  Star,
  Tag 
} from 'lucide-react';
import { SpaceConfig } from './use-space-config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives";

// Space permission options
const permissionOptions = [
  { value: "all", label: "All members" },
  { value: "members", label: "Space members, space admins, and staff" },
  { value: "admins", label: "Space admins and staff" },
  { value: "nobody", label: "Nobody" },
];

// ContentType interface
interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
}

interface ConfigureSpaceStepProps {
  exitDirection: "left" | "right";
  slideVariants: any;
  selectedType: string | null;
  selectedContent: ContentType | undefined;
  spaceConfig: SpaceConfig;
  setSpaceConfig: React.Dispatch<React.SetStateAction<SpaceConfig>>;
  isCreating: boolean;
  error: string | null;
  handleBack: () => void;
  handleAddContent: () => void;
}

export function ConfigureSpaceStep({
  exitDirection,
  slideVariants,
  selectedType,
  selectedContent,
  spaceConfig,
  setSpaceConfig,
  isCreating,
  error,
  handleBack,
  handleAddContent
}: ConfigureSpaceStepProps) {
  // Generate a slug when the name changes
  React.useEffect(() => {
    if (spaceConfig.name && !spaceConfig.slug) {
      setSpaceConfig(prev => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  }, [spaceConfig.name, spaceConfig.slug, setSpaceConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpaceConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setSpaceConfig(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <motion.div
      key="spaceConfiguration"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideVariants}
      custom={exitDirection}
      className="flex flex-col md:flex-row h-[90vh] max-h-[800px]"
    >
      {/* Left panel - Form */}
      <div className="md:w-1/2 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
        <div className="px-16 pt-16 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">2/2</span>
            </div>
          </div>
          <h1 className="text-l font-semibold text-gray-900 dark:text-white mt-8 mb-1">
            Configure your space
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Set up how your {selectedType?.toLowerCase()} space will work
          </p>
        </div>
        
        <div className="flex-1 items-center justify-center px-16 overflow-y-auto 
        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
          <div className="space-y-5">
            {error && (
              <div className="mb-6 p-4 border border-red-200 text-red-700 bg-red-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="space-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Space Name
                </Label>
                <Input
                  id="space-name"
                  name="name"
                  placeholder="My Space"
                  value={spaceConfig.name}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="space-slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Space Slug
                </Label>
                <div className="flex items-center mt-1">
                  <div className="px-3 h-10 flex items-center rounded-l-md border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                    bettermode.com/
                  </div>
                  <Input
                    id="space-slug"
                    name="slug"
                    placeholder="my-space"
                    value={spaceConfig.slug}
                    onChange={handleChange}
                    disabled={isCreating}
                    className="rounded-l-none flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
              
              <Accordion type="single" collapsible className="mt-6 w-full">
                <AccordionItem value="advanced-settings" className="border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                    Advanced Settings
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Space Settings</h3>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="make-private" className="text-sm text-gray-600 dark:text-gray-400">
                            Make private
                          </Label>
                          <Switch
                            id="make-private"
                            checked={spaceConfig.isPrivate}
                            onCheckedChange={(checked) => handleCheckboxChange('isPrivate', checked)}
                            disabled={isCreating}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="invite-only" className="text-sm text-gray-600 dark:text-gray-400">
                            Make invite-only
                          </Label>
                          <Switch
                            id="invite-only"
                            checked={spaceConfig.isInviteOnly}
                            onCheckedChange={(checked) => handleCheckboxChange('isInviteOnly', checked)}
                            disabled={isCreating}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="anyone-invite" className="text-sm text-gray-600 dark:text-gray-400">
                            Anyone can invite
                          </Label>
                          <Switch
                            id="anyone-invite"
                            checked={spaceConfig.anyoneCanInvite}
                            onCheckedChange={(checked) => handleCheckboxChange('anyoneCanInvite', checked)}
                            disabled={isCreating}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="who-can-post" className="text-sm text-gray-600 dark:text-gray-400">
                            Who can post?
                          </Label>
                          <Select
                            value={spaceConfig.whoCanPost}
                            onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanPost: value})}
                            disabled={isCreating}
                          >
                            <SelectTrigger id="who-can-post" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                              {permissionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="who-can-reply" className="text-sm text-gray-600 dark:text-gray-400">
                            Who can reply?
                          </Label>
                          <Select
                            value={spaceConfig.whoCanReply}
                            onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanReply: value})}
                            disabled={isCreating}
                          >
                            <SelectTrigger id="who-can-reply" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                              {permissionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="who-can-react" className="text-sm text-gray-600 dark:text-gray-400">
                            Who can react?
                          </Label>
                          <Select
                            value={spaceConfig.whoCanReact}
                            onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanReact: value})}
                            disabled={isCreating}
                          >
                            <SelectTrigger id="who-can-react" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                              {permissionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        
        {/* Fixed buttons at bottom */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-end">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isCreating}
              className="text-sm min-w-20"
            >
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAddContent}
              disabled={!spaceConfig.name || !spaceConfig.slug || isCreating}
              className="text-sm bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 min-w-24"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Space'
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right panel - Preview */}
      <div className="hidden md:block md:w-1/2 py-12 pl-20 bg-gradient-to-br from-gray-100/80 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-900/80">
        <div className="flex-1 flex items-center justify-center">
          {selectedContent && (
            <div 
              className={`w-full max-w-md h-[550px] bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden relative`}
            >
              {/* Header with space name and icon */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
                <div className={`p-2 rounded-lg bg-${selectedContent.color}-100/60 dark:bg-${selectedContent.color}-900/20 mr-3`}>
                  {selectedContent.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {spaceConfig.name || "Your Space"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    bettermode.com/{spaceConfig.slug || "your-space"}
                  </p>
                </div>
              </div>
              
              {/* Content preview based on selected type */}
              <div className="p-5 h-[calc(100%-64px)] overflow-y-auto">
                <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h4 className={`text-${selectedContent.color}-600 dark:text-${selectedContent.color}-400 font-medium text-sm`}>
                    {selectedType} Space
                  </h4>
                </div>
                
                {/* Dynamic preview based on content type */}
                <div className="flex-1">
                  {selectedType === "Event" && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Event Title</h3>
                          <div className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs">Upcoming</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Jul 21, 2023 • 2:00 PM</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Event description would appear here with all the details about the upcoming event.</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <span>12 attendees</span>
                          </div>
                          <button className="px-3 py-1 text-xs rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">Register</button>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Workshop Session</h3>
                          <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">Next Week</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Jul 28, 2023 • 3:30 PM</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedType === "Discussion" && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">Discussion Topic Title</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This is where the discussion content would appear. Members can respond and engage with this topic.</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                <span>24 replies</span>
                              </div>
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span>8 likes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">Another Discussion</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                <span>5 replies</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedType === "Q&A" && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">How do I set up my account?</h3>
                          <div className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs">Answered</div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">I'm new to the platform and need help setting up my profile and preferences...</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            <span>2 answers</span>
                          </div>
                          <div className="flex items-center">
                            <button className="p-1 text-gray-400 hover:text-violet-500">
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <span className="text-sm">12</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">What are the system requirements?</h3>
                          <div className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs">Open</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center">
                            <HelpCircle className="h-4 w-4 mr-1" />
                            <span>Needs answer</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedType === "Wishlist" && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Add dark mode support</h3>
                          <div className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs">In Progress</div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">We need a dark mode option for better night-time viewing...</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-xs text-gray-500">UI Enhancement</span>
                          </div>
                          <div className="flex items-center">
                            <button className="p-1 text-gray-400 hover:text-amber-500">
                              <Star className="h-4 w-4" />
                            </button>
                            <span className="text-sm">28</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Mobile app for iOS and Android</h3>
                          <div className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">Under Review</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-amber-400" />
                          <span className="text-sm">42 votes</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Default preview for other content types */}
                  {(selectedType !== "Event" && selectedType !== "Discussion" && selectedType !== "Q&A" && selectedType !== "Wishlist") && (
                    <div className="flex items-center justify-center h-full">
                      {selectedContent.preview}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 