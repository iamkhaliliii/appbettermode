import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, ChevronDown, Plus, Calendar, MessageSquare, HelpCircle, Star, Layout, BookOpen, Briefcase, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/utils";

import { SelectContentStep } from "./select-content-step";
import { ConfigureSpaceStep } from "./configure-space-step";
import { useSpaceConfig } from "./use-space-config";
import { getPreviewComponent } from "./content-types";

export interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// CMS Type from database
interface CmsType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon_name: string;
  favorite: boolean;
  type: string;
  fields: any[];
}

// Content type for UI
interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
}

// Map icon name to Lucide icon
const getIconComponent = (iconName: string) => {
  if (!iconName) return <Plus className="h-5 w-5" />;
  
  switch (iconName) {
    case 'calendar':
    case 'Calendar':
      return <Calendar className="h-5 w-5" />;
    case 'message-circle':
    case 'MessageSquare':
    case 'messagesquare':
      return <MessageSquare className="h-5 w-5" />;
    case 'help-circle':
    case 'HelpCircle':
    case 'helpcircle':
      return <HelpCircle className="h-5 w-5" />;
    case 'star':
    case 'Star':
    case 'lightbulb':
      return <Star className="h-5 w-5" />;
    case 'layout':
    case 'Layout':
      return <Layout className="h-5 w-5" />;
    case 'book-open':
    case 'BookOpen':
    case 'bookopen':
      return <BookOpen className="h-5 w-5" />;
    case 'briefcase':
    case 'Briefcase':
      return <Briefcase className="h-5 w-5" />;
    case 'file-text':
    case 'FileText':
    case 'filetext':
    case 'feather':
      return <FileText className="h-5 w-5" />;
    default:
      return <Plus className="h-5 w-5" />;
  }
};

// Map db color to tailwind color class
const getColorClass = (color: string) => {
  if (!color) return "blue";
  if (color.startsWith('#')) {
    // Convert hex to approximate tailwind color
    if (color.includes('3b82f6')) return "blue";
    if (color.includes('f97316')) return "orange";
    if (color.includes('8b5cf6')) return "purple";
    if (color.includes('f59e0b')) return "amber";
    if (color.includes('ef4444')) return "red";
    if (color.includes('22c55e')) return "green";
    if (color.includes('6366f1')) return "indigo";
    if (color.includes('0ea5e9')) return "sky";
    if (color.includes('14b8a6')) return "teal";
    if (color.includes('ec4899')) return "pink";
    return "gray";
  }
  return color;
};

// Animation variants
const slideVariants = {
  initial: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? 20 : -20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  },
  exit: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -20 : 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  })
};

export function AddContentDialog({
  open,
  onOpenChange,
}: AddContentDialogProps) {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"selection" | "spaceConfiguration">("selection");
  const [exitDirection, setExitDirection] = React.useState<"left" | "right">("left");
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [contentTypes, setContentTypes] = React.useState<ContentType[]>([]);
  const [favoriteTypes, setFavoriteTypes] = React.useState<ContentType[]>([]);
  const [otherTypes, setOtherTypes] = React.useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showMore, setShowMore] = React.useState(false);

  const { spaceConfig, setSpaceConfig } = useSpaceConfig();

  // Fetch content types from API
  React.useEffect(() => {
    if (open) {
      fetchContentTypes();
    }
  }, [open]);

  const fetchContentTypes = async () => {
    setIsLoading(true);
    try {
      const API_BASE = getApiBaseUrl();
      let favorites: ContentType[] = [];
      let others: ContentType[] = [];
      
      try {
        // First fetch favorites
        console.log(`Fetching favorites from: ${API_BASE}/api/v1/cms-types/favorites`);
        const favoritesResponse = await fetch(`${API_BASE}/api/v1/cms-types/favorites`);
        console.log('Response status:', favoritesResponse.status);
        console.log('Response URL:', favoritesResponse.url);
        
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          console.log('Favorites data:', favoritesData);
          
          // Check if the response is an array
          if (Array.isArray(favoritesData)) {
            // Transform data to ContentType format
            favorites = favoritesData.map((item: CmsType) => ({
              id: item.id,
              title: item.name.charAt(0).toUpperCase() + item.name.slice(1).replace(/_/g, ' '),
              description: item.description || `Create ${item.name} content`,
              icon: getIconComponent(item.icon_name),
              color: getColorClass(item.color),
              preview: getPreviewComponent(item.name)
            }));
          } else {
            console.error('Favorites data is not an array:', favoritesData);
          }
        } else {
          const responseText = await favoritesResponse.text();
          console.error('Failed to fetch favorites:', responseText);
        }
      } catch (favError) {
        console.error('Error fetching favorites:', favError);
      }
      
      try {
        // Fetch official types for "more" section
        console.log(`Fetching official types from: ${API_BASE}/api/v1/cms-types/category/official`);
        const officialResponse = await fetch(`${API_BASE}/api/v1/cms-types/category/official`);
        console.log('Response status:', officialResponse.status);
        console.log('Response URL:', officialResponse.url);
        
        if (officialResponse.ok) {
          const officialData = await officialResponse.json();
          console.log('Official types data:', officialData);
          
          // Check if the response is an array
          if (Array.isArray(officialData)) {
            // Filter out favorites and transform
            others = officialData
              .filter((item: CmsType) => !item.favorite)
              .map((item: CmsType) => ({
                id: item.id,
                title: item.name.charAt(0).toUpperCase() + item.name.slice(1).replace(/_/g, ' '),
                description: item.description || `Create ${item.name} content`,
                icon: getIconComponent(item.icon_name),
                color: getColorClass(item.color),
                preview: getPreviewComponent(item.name)
              }));
          } else {
            console.error('Official data is not an array:', officialData);
          }
        } else {
          const responseText = await officialResponse.text();
          console.error('Failed to fetch official types:', responseText);
        }
      } catch (officialError) {
        console.error('Error fetching official types:', officialError);
      }
      
      // If we couldn't get any data from the API, use default content types
      if (favorites.length === 0 && others.length === 0) {
        console.log('Using default content types...');
        
        // Default content types
        const defaultTypes: ContentType[] = [
          {
            id: 'discussion',
            title: 'Discussion',
            description: 'Start conversations with community members.',
            icon: getIconComponent('message-circle'),
            color: 'blue',
            preview: getPreviewComponent('discussion')
          },
          {
            id: 'event',
            title: 'Event',
            description: 'Organize events with scheduling and registrations.',
            icon: getIconComponent('calendar'),
            color: 'emerald',
            preview: getPreviewComponent('event')
          },
          {
            id: 'qa',
            title: 'Q&A',
            description: 'Enable community Q&A with voting system.',
            icon: getIconComponent('help-circle'),
            color: 'violet',
            preview: getPreviewComponent('qa')
          },
          {
            id: 'blog',
            title: 'Blog',
            description: 'Share updates and stories.',
            icon: getIconComponent('file-text'),
            color: 'purple',
            preview: getPreviewComponent('blog')
          }
        ];
        
        // Set first two as favorites
        favorites = defaultTypes.slice(0, 2);
        others = defaultTypes.slice(2);
      }
      
      setFavoriteTypes(favorites);
      setOtherTypes(others);
      
      // Initial content types to show are just favorites
      setContentTypes(favorites);
      
    } catch (error) {
      console.error("Error fetching content types:", error);
      setError("Failed to load content types");
      
      // Use default content types
      const defaultTypes: ContentType[] = [
        {
          id: 'discussion',
          title: 'Discussion',
          description: 'Start conversations with community members.',
          icon: getIconComponent('message-circle'),
          color: 'blue',
          preview: getPreviewComponent('discussion')
        },
        {
          id: 'event',
          title: 'Event',
          description: 'Organize events with scheduling and registrations.',
          icon: getIconComponent('calendar'),
          color: 'emerald',
          preview: getPreviewComponent('event')
        }
      ];
      
      setFavoriteTypes(defaultTypes);
      setContentTypes(defaultTypes);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMoreTypes = () => {
    if (showMore) {
      // Hide other types
      setContentTypes([...favoriteTypes]);
    } else {
      // Show all types
      setContentTypes([...favoriteTypes, ...otherTypes]);
    }
    setShowMore(!showMore);
  };

  const selectedContent = React.useMemo(() => {
    return contentTypes.find(content => content.title === selectedType);
  }, [selectedType, contentTypes]);

  const handleContentClick = (title: string) => {
    setExitDirection("left");
    setSelectedType(title);
    setStep("spaceConfiguration");
  };

  const handleBack = () => {
    setExitDirection("right");
    setStep("selection");
  };

  const handleAddContent = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      const API_BASE = getApiBaseUrl();
      
      // Get the site ID from the URL path
      const pathname = window.location.pathname;
      const matches = pathname.match(/\/dashboard\/site\/([^\/]+)/);
      const siteIdentifier = matches ? matches[1] : '';
      
      console.log("Site identifier from URL:", siteIdentifier);
      
      if (!siteIdentifier) {
        setError("Could not determine the site identifier. Please try again.");
        setIsCreating(false);
        return;
      }
      
      // First fetch the site to get its actual UUID
      const siteResponse = await fetch(`${API_BASE}/api/v1/sites/${siteIdentifier}`);
      
      if (!siteResponse.ok) {
        setError("Failed to fetch site information. Please try again.");
        setIsCreating(false);
        return;
      }
      
      const siteData = await siteResponse.json();
      const siteId = siteData.id; // This is the actual UUID
      
      console.log("Actual site ID (UUID):", siteId);
      console.log("Current site content types:", siteData.content_types);
      
      // Ensure slug is valid and doesn't contain special characters
      const cleanSlug = spaceConfig.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // If the cms_type is not already in the site's content_types, add it
      const cmsType = selectedType?.toLowerCase() || 'custom';
      let updatedContentTypes = [...(siteData.content_types || [])];
      
      if (!updatedContentTypes.includes(cmsType)) {
        console.log(`Adding ${cmsType} to site content types`);
        updatedContentTypes.push(cmsType);
      }
      
      // Simple description for the space
      const description = `${spaceConfig.name} space`;
      
      // Use the correct API endpoint with the UUID
      const response = await fetch(`${API_BASE}/api/v1/sites/${siteId}/spaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: spaceConfig.name,
          slug: cleanSlug,
          cms_type: cmsType,
          description: description,
          visibility: spaceConfig.isPrivate ? 'private' : 'public',
          hidden: spaceConfig.hide_from_search || false
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Space created successfully:", data);
        
        // Verify space was added to site's space_ids
        const updatedSiteResponse = await fetch(`${API_BASE}/api/v1/sites/${siteId}`);
        const updatedSiteData = await updatedSiteResponse.json();
        console.log("Updated site data:", updatedSiteData);
        console.log("Space IDs in site:", updatedSiteData.space_ids);
        
        // If the site's space_ids doesn't include our new space, try to update it manually
        if (updatedSiteData.space_ids && !updatedSiteData.space_ids.includes(data.id)) {
          console.log("Space ID not found in site's space_ids, attempting manual update");
          // This part would require a PUT endpoint for updating sites, which isn't implemented yet
        }
        
        // Close the dialog after creating
        onOpenChange(false);
        
        // Reload the page to show the new space
        window.location.reload();
      } else {
        console.log("Error status:", response.status);
        let errorMessage = "Failed to create space. Please try again.";
        
        try {
          const errorData = await response.json();
          console.error("Error from server:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error creating space:", error);
      setError("An error occurred while creating the space. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="sm:max-w-[90vw] md:max-w-[1100px] p-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-xl"
          >
            <AnimatePresence mode="wait" custom={exitDirection}>
              {step === "selection" ? (
                isLoading ? (
                  <motion.div
                    key="loading"
                    className="p-6 w-full min-h-[50vh] flex items-center justify-center"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={slideVariants}
                    custom={exitDirection}
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    className="p-6 w-full"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={slideVariants}
                    custom={exitDirection}
                  >
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Choose a content type
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Select the type of content you want to create
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex items-center gap-2 text-red-500 p-4 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <SelectContentStep
                      exitDirection={exitDirection}
                      slideVariants={slideVariants}
                      contentTypes={contentTypes}
                      handleContentClick={handleContentClick}
                    />
                    
                    {otherTypes.length > 0 && (
                      <div className="px-10 pb-10 text-center">
                        <Button 
                          variant="outline" 
                          onClick={toggleMoreTypes}
                          className="flex items-center gap-2"
                        >
                          {showMore ? 'Show Less' : 'Show More'}
                          <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    )}
                  </>
                )
              ) : (
                <ConfigureSpaceStep
                  exitDirection={exitDirection}
                  slideVariants={slideVariants}
                  selectedType={selectedType}
                  selectedContent={selectedContent}
                  spaceConfig={spaceConfig}
                  setSpaceConfig={setSpaceConfig}
                  isCreating={isCreating}
                  error={error}
                  handleBack={handleBack}
                  handleAddContent={handleAddContent}
                />
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 