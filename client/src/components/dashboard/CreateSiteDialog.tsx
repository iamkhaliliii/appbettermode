import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Input } from '@/components/ui/primitives';
import { Label } from '@/components/ui/primitives';
import { useToast } from '@/hooks/use-toast';
import { MultiStepLoader } from '@/components/shared/loaders';
import {
  Globe,
  X,
  Loader2,
  Download,
  Plus,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  PenLine,
  Check,
  ArrowLeft,
  Calendar,
  MessageSquare,
  HelpCircle,
  Star,
  Layout,
  BookOpen,
  Briefcase,
  FileText,
} from 'lucide-react';
import { sitesApi } from '@/lib/api';
import { z } from 'zod';
import { BrandLogo, BrandColor, CompanyInfo } from '@/pages/sites/types';
import { cn } from '@/lib/utils';
import { SitePreview } from './SitePreview';
import { getPreviewComponent } from '@/components/features/content/add-content-dialog/content-types';
import { getApiUrl } from '@/lib/utils';

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
  label: string;
}

// --- Validation Schema (for create site form) ---
export const siteCreationSchema = z.object({
  name: z.string()
    .min(2, 'Site name must be at least 2 characters.')
    .max(50, 'Site name cannot exceed 50 characters.'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters.')
    .max(30, 'Subdomain cannot exceed 30 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid subdomain format (lowercase letters, numbers, and hyphens).')
    .optional()
    .or(z.literal('')),
  domain: z.string()
    .optional()
    .or(z.literal('')),
  selectedLogo: z.string().optional().or(z.literal('')),
  selectedColor: z.string().optional().or(z.literal('')),
  selectedContentTypes: z.array(z.string()).default([]),
});

export type SiteCreationFormInputs = z.infer<typeof siteCreationSchema>;

// Map icon name to Lucide icon
const getIconComponent = (iconName: string) => {
  if (!iconName) return <Plus className="h-5 w-5" />;
  
  const normalizedIcon = iconName?.toLowerCase().trim();
  
  // Knowledge Base icons
  if (normalizedIcon === 'book-open' || normalizedIcon?.includes('knowledge') || normalizedIcon === 'kb' || 
      normalizedIcon === 'book' || normalizedIcon?.includes('doc')) {
    return <BookOpen className="h-4 w-4 text-rose-500" />;
  }
  
  // Job List icons
  if (normalizedIcon?.includes('job') || normalizedIcon?.includes('career') || 
      normalizedIcon === 'work' || normalizedIcon === 'briefcase') {
    return <Briefcase className="h-4 w-4 text-cyan-500" />;
  }
  
  // Event icons
  if (normalizedIcon?.includes('calendar') || normalizedIcon?.includes('event')) {
    return <Calendar className="h-4 w-4 text-emerald-500" />;
  }
  
  // Discussion icons
  if (normalizedIcon?.includes('message') || normalizedIcon?.includes('discussion') || 
      normalizedIcon?.includes('chat') || normalizedIcon?.includes('forum')) {
    return <MessageSquare className="h-4 w-4 text-blue-500" />;
  }
  
  // Q&A icons
  if (normalizedIcon?.includes('help') || normalizedIcon?.includes('qa') || 
      normalizedIcon?.includes('q&a') || normalizedIcon?.includes('question')) {
    return <HelpCircle className="h-4 w-4 text-violet-500" />;
  }
  
  // Wishlist icons
  if (normalizedIcon?.includes('star') || normalizedIcon?.includes('wishlist') || 
      normalizedIcon?.includes('idea') || normalizedIcon?.includes('lightbulb')) {
    return <Star className="h-4 w-4 text-amber-500" />;
  }
  
  // Landing page icons
  if (normalizedIcon?.includes('layout') || normalizedIcon?.includes('landing') || 
      normalizedIcon?.includes('home')) {
    return <Layout className="h-4 w-4 text-indigo-500" />;
  }
  
  // Blog icons
  if (normalizedIcon?.includes('file') || normalizedIcon?.includes('blog') || 
      normalizedIcon?.includes('post') || normalizedIcon?.includes('feather')) {
    return <FileText className="h-4 w-4 text-purple-500" />;
  }
  
  // Default icon
  console.log(`Unknown icon name: ${iconName}, using default icon`);
  return <Plus className="h-4 w-4" />;
};

// Get color class from color name
const getColorClass = (color: string) => {
  if (!color) return 'gray';
  
  const normalizedColor = color?.toLowerCase().trim();
  
  // Knowledge Base related colors (typically rose/red)
  if (normalizedColor?.includes('knowledge') || normalizedColor?.includes('book') || 
      normalizedColor?.includes('doc')) {
    return 'rose';
  }
  
  // Job List related colors (typically cyan/blue)
  if (normalizedColor?.includes('job') || normalizedColor?.includes('career') || 
      normalizedColor?.includes('work')) {
    return 'cyan';
  }
  
  // Map common color names to Tailwind color classes
  const colorMap: Record<string, string> = {
    'green': 'emerald',
    'emerald': 'emerald',
    'blue': 'blue',
    'azure': 'blue',
    'purple': 'violet',
    'violet': 'violet',
    'yellow': 'amber',
    'amber': 'amber',
    'orange': 'amber',
    'indigo': 'indigo',
    'red': 'rose',
    'rose': 'rose',
    'pink': 'rose',
    'cyan': 'cyan',
    'teal': 'cyan',
    'fuchsia': 'purple',
    'magenta': 'purple',
    'gray': 'gray',
    'grey': 'gray',
    'black': 'gray',
    'white': 'gray'
  };
  
  return colorMap[normalizedColor] || normalizedColor || 'gray';
};

// Content type for UI (ensure this is accessible or redefined in SitePreview.tsx if not imported)
interface ContentTypeUIData {
  id: string;
  title: string; // This is the label
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
  name: string; // This is the slug/name
}

// نام شرکت‌های معروف برای ایجاد لیست Dropdown
const companies = [
  "Apple", "Google", "Microsoft", "Amazon", "Facebook", "Tesla", "Netflix", 
  "Twitter", "LinkedIn", "Adobe", "Salesforce", "Oracle", "IBM", "Intel",
  "Samsung", "Sony", "Nintendo", "Spotify", "Uber", "Airbnb", "PayPal"
];

// API base URL
const API_BASE = getApiUrl();

// Loading states for the creation process
const siteCreationSteps = [
  { text: "Creating Site Structure" },
  { text: "Setting Up Content Types" },
  { text: "Configuring Brand Assets" },
  { text: "Establishing Permissions" },
  { text: "Initializing Community" },
  { text: "Finalizing Setup" },
];

// --- API Functions ---
const createNewSite = async (data: SiteCreationFormInputs) => {
  console.log("Creating site with data:", {
    name: data.name,
    subdomain: data.subdomain,
    domain: data.domain,
    selectedLogo: data.selectedLogo ? "Has logo" : "No logo",
    selectedColor: data.selectedColor,
    selectedContentTypes: data.selectedContentTypes
  });
  
  return sitesApi.createSite({
    name: data.name,
    subdomain: data.subdomain?.trim().toLowerCase() || undefined,
    domain: data.domain?.trim().toLowerCase() || undefined,
    selectedLogo: data.selectedLogo,
    selectedColor: data.selectedColor,
    selectedContentTypes: data.selectedContentTypes
  });
};

interface CreateSiteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSiteDialog: React.FC<CreateSiteDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Wizard step tracking - 1: Domain entry, 2: Site details and brand, 3: Content types
  const [wizardStep, setWizardStep] = useState(1);
  
  // Site creation process state
  const [isCreatingProcess, setIsCreatingProcess] = useState(false);
  
  // Brand data state
  const [brandData, setBrandData] = useState<{
    name?: string;
    description?: string;
    longDescription?: string;
    logos: BrandLogo[];
    colors: BrandColor[];
    companyInfo?: CompanyInfo;
    links?: Array<{ name: string; url: string }>;
    fonts?: Array<{ name: string; type: string; origin?: string }>;
    images?: Array<{ type: string; url: string; format: string; width?: number; height?: number }>;
    qualityScore?: number;
    loading: boolean;
    error: string | null;
  }>({
    logos: [],
    colors: [],
    loading: false,
    error: null
  });
  
  // No manual upload options needed - only show brand fetch results
  
  // Content types state
  const [contentTypes, setContentTypes] = useState<ContentTypeUIData[]>([]);
  const [loadingContentTypes, setLoadingContentTypes] = useState(false);
  
  // Fetch content types from API
  useEffect(() => {
    const fetchContentTypes = async () => {
      if (wizardStep !== 3) return; // Only fetch when reaching step 3
      
      setLoadingContentTypes(true);
      try {
        // Fetch all official content types
        const response = await fetch(`${API_BASE}/api/v1/cms-types/category/official`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            // Transform CMS types to ContentType format
            const transformedTypes = data.map((item: CmsType) => {
              // Get a normalized name for display purposes
              let normalizedName = item.name.toLowerCase().trim();
              
              // For debugging
              console.log(`CMS Type: ${item.name} (ID: ${item.id}), Label: ${item.label}`);
              
              return {
                id: item.id, // Use the actual UUID from the cms_types table
                title: item.label, // CHANGED: Use label for display title
                description: item.description || `Create ${item.name} content`,
                icon: getIconComponent(item.icon_name),
                color: getColorClass(item.color),
                preview: getPreviewComponent(item.name),
                name: normalizedName // Keep normalized name for internal use / keying if needed
              };
            });
            
            setContentTypes(transformedTypes);
          } else {
            console.error('CMS types data is not an array:', data);
            toast({
              title: "Error Loading Content Types",
              description: "Failed to load content types from server",
              variant: "destructive",
            });
          }
        } else {
          console.error('Failed to fetch content types:', response.statusText);
          toast({
            title: "Error Loading Content Types",
            description: `Failed to load content types: ${response.statusText}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching content types:', error);
        toast({
          title: "Error Loading Content Types",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoadingContentTypes(false);
      }
    };
    
    fetchContentTypes();
  }, [wizardStep, toast]);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid, touchedFields },
    watch,
  } = useForm<SiteCreationFormInputs>({
    resolver: zodResolver(siteCreationSchema),
    defaultValues: { 
      name: '', 
      subdomain: '', 
      domain: '',
      selectedLogo: '',
      selectedColor: '',
      selectedContentTypes: [] 
    },
    mode: 'onChange'
  });

  const nameValue = watch('name');
  const subdomainValue = watch('subdomain');
  const domainValue = watch('domain');
  const selectedLogo = watch('selectedLogo');
  const selectedColor = watch('selectedColor') || '#6366f1';
  const selectedContentTypes = watch('selectedContentTypes') || [];
  
  // Derive selected content type objects for preview
  const selectedContentTypeObjects = React.useMemo(() => {
    if (!contentTypes || contentTypes.length === 0 || !selectedContentTypes || selectedContentTypes.length === 0) {
      return [];
    }
    return selectedContentTypes
      .map(id => contentTypes.find(ct => ct.id === id))
      .filter(Boolean) as ContentTypeUIData[]; // Asserting as ContentTypeUIData defined above or imported
  }, [selectedContentTypes, contentTypes]);

  // Function to fetch brand data
  const fetchBrandData = async () => {
    if (!domainValue) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain name to fetch brand info.",
        variant: "destructive",
      });
      return;
    }
    
    setBrandData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Import dynamically to avoid issues
      const { fetchBrandInfo } = await import('@/lib/brand-fetcher');
      const data = await fetchBrandInfo(domainValue);
      
      setBrandData({
        name: data.name,
        description: data.description,
        logos: data.logos,
        colors: data.colors,
        companyInfo: data.companyInfo,
        loading: false,
        error: data.error
      });
      
      // Auto-select first primary/logo type with light theme if available
      if (data.logos.length > 0) {
        // Try to find a primary logo with light theme
        const primaryLightLogo = data.logos.find(logo => 
          logo.type === 'logo' && logo.theme === 'light'
        );
        // Or any logo with light theme
        const lightLogo = data.logos.find(logo => 
          logo.theme === 'light'
        );
        // Or just the first logo
        const logoToUse = primaryLightLogo || lightLogo || data.logos[0];
        
        setValue('selectedLogo', logoToUse.url);
      }
      
      // Auto-select primary or accent color if available
      if (data.colors.length > 0) {
        const primaryColor = data.colors.find(color => 
          color.type === 'primary'
        );
        const accentColor = data.colors.find(color => 
          color.type === 'accent'
        );
        const colorToUse = primaryColor || accentColor || data.colors[0];
        
        setValue('selectedColor', colorToUse.hex);
      }
      
      // If brand name is found and site name is empty, set it
      if (data.name && !nameValue) {
        setValue('name', data.name);
      }
      
      // Auto-generate subdomain suggestion based on domain if subdomain field is empty
      if (!touchedFields.subdomain) {
        const domainParts = domainValue.split('.');
        if (domainParts.length > 0) {
          const suggestedSubdomain = domainParts[0]
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          setValue('subdomain', suggestedSubdomain);
        }
      }
      
      // Show toast for success or error
      if (data.error) {
        toast({
          title: "Brand Fetch Warning",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.logos.length === 0 && data.colors.length === 0) {
        toast({
          title: "No Brand Assets Found",
          description: "We couldn't find any logos or colors for this domain.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Brand Assets Found",
          description: `Found ${data.logos.length} logos and ${data.colors.length} colors${data.companyInfo ? ' and company info' : ''}.`,
          variant: "default",
        });
      }
      
      // Move to step 2 after successful fetch (even if no assets found)
      setWizardStep(2);
      
    } catch (error) {
      setBrandData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch brand data'
      }));
      
      toast({
        title: "Brand Fetch Error",
        description: error instanceof Error ? error.message : 'Failed to fetch brand data',
        variant: "destructive",
      });
    }
  };

  const onSubmitHandler: SubmitHandler<SiteCreationFormInputs> = (data) => {
    console.log("Submit handler called, current step:", wizardStep);
    console.log("Form data to be submitted:", JSON.stringify(data, null, 2));
    console.log("Selected content types:", data.selectedContentTypes);
    
    // Make sure we're in step 3 before proceeding with site creation
    if (wizardStep !== 3) {
      console.log("Prevented submission - not in step 3");
      return;
    }
    
    // Show creation process overlay only after form submission
    setIsCreatingProcess(true);
    console.log("Starting site creation process...");
    
    // Call the API after a delay to allow for loading animation
    setTimeout(() => {
      createSiteMutation.mutate(data);
    }, siteCreationSteps.length * 2000); // Allow enough time for all steps to complete
  };

  const createSiteMutation = useMutation({
    mutationFn: createNewSite,
    onSuccess: (newSite) => {
      queryClient.invalidateQueries({ queryKey: ['userSites'] });
      handleDialogReset();
      onOpenChange(false);
      toast({
        title: "Site Created!",
        description: `The site "${newSite.name}" has been successfully created with brand assets.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsCreatingProcess(false); // Hide loader on error
      toast({
        title: "Creation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  // Reset form and state when dialog closes
  const handleDialogReset = () => {
    reset();
    setBrandData({
      name: undefined,
      description: undefined,
      logos: [],
      colors: [],
      companyInfo: undefined,
      loading: false,
      error: null
    });
    setWizardStep(1);
    // Manual input options removed - only brand fetch data
    setIsCreatingProcess(false);
  };

  // Helper function to adjust color brightness
  function adjustColor(hex: string, percent: number) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex color to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust brightness
    const adjustR = Math.max(0, Math.min(255, r + percent));
    const adjustG = Math.max(0, Math.min(255, g + percent));
    const adjustB = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return `#${Math.round(adjustR).toString(16).padStart(2, '0')}${Math.round(adjustG).toString(16).padStart(2, '0')}${Math.round(adjustB).toString(16).padStart(2, '0')}`;
  }

  // Function to toggle content type selection
  const toggleContentType = (id: string) => {
    const currentSelection = [...(selectedContentTypes || [])];
    const index = currentSelection.indexOf(id);
    
    if (index === -1) {
      // Add the item if not present
      const newSelection = [...currentSelection, id];
      console.log(`Adding content type: ${id}, new selection:`, newSelection);
      setValue('selectedContentTypes', newSelection);
    } else {
      // Remove the item if already selected
      currentSelection.splice(index, 1);
      console.log(`Removing content type: ${id}, new selection:`, currentSelection);
      setValue('selectedContentTypes', currentSelection);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !createSiteMutation.isPending) {
          handleDialogReset();
        }
        onOpenChange(open);
      }}
    >
      {/* Multi-step loader for creation process */}
      <MultiStepLoader 
        loadingStates={siteCreationSteps} 
        loading={isCreatingProcess && wizardStep === 3} 
        duration={2000} 
        loop={false}
      />
      
      <DialogContent className="sm:max-w-7xl p-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-xl">
        <div className="flex flex-col md:flex-row h-[90vh] max-h-[800px]">
          {/* Left panel - Form */}
          <div className="md:w-1/2 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
            <div className="px-16 pt-16 pb-2">
              <DialogTitle className="sr-only">Create New Site</DialogTitle>
              <DialogDescription className="sr-only">Create and customize your new site with brand assets and content types</DialogDescription>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: wizardStep === 1 ? '33%' : wizardStep === 2 ? '66%' : '100%' }}
                    ></div>
                  </div>
                  <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">{wizardStep}/3</span>
                </div>
              </div>
 
            </div>
            
            <div className="flex-1 items-center justify-center px-16 overflow-y-auto 
             scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
             <h1 className="text-l font-semibold text-gray-900 dark:text-white mt-8 mb-1">
                  {wizardStep === 1 
                    ? "Enter your domain" 
                    : wizardStep === 2 
                    ? "Create your site" 
                    : "Choose post types"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {wizardStep === 1 
                    ? "We'll fetch your brand assets automatically" 
                    : wizardStep === 2
                    ? "Customize your community platform with your brand"
                    : "Select the content types for your community"}
                </p>
              <form 
                id="create-site-form" 
                onSubmit={(e) => {
                  // Only allow form submission in step 3
                  if (wizardStep !== 3) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(onSubmitHandler)(e);
                }} 
                className="space-y-5"
                onKeyDown={(e) => {
                  // Prevent form submission on Enter key except when in step 3
                  if (e.key === 'Enter' && wizardStep !== 3) {
                    e.preventDefault();
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  {wizardStep === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-2 mb-6">
                        <Label 
                          htmlFor="domain" 
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Domain name
                        </Label>
                        <div className="relative">
                          <Input
                            id="domain"
                            {...register('domain')}
                            placeholder="yourdomain.com"
                            className="w-full py-2 pr-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            disabled={brandData.loading}
                          />
                          {domainValue && (
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={() => setValue('domain', '')}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          We suggest using your company's official domain
                        </p>
                      </div>
                    </motion.div>
                  ) : wizardStep === 2 ? (
                    <motion.div 
                      key="step2"
                      className="space-y-5"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-4">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Site Name
                        </Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="Acme Community"
                          className="w-full mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          disabled={createSiteMutation.isPending}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subdomain
                        </Label>
                        <div className="flex items-center mt-1">
                          <Input
                            id="subdomain"
                            {...register('subdomain')}
                            placeholder="community"
                            className="rounded-r-none flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            disabled={createSiteMutation.isPending}
                          />
                          <div className="px-3 h-10 flex items-center rounded-r-md border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                            .bettermode.com
                          </div>
                        </div>
                        {errors.subdomain && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.subdomain.message}</p>
                        )}
                      </div>
                      
                      {/* Brand Logos */}
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Brand Logos
                        </Label>
                        
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <Controller
                            name="selectedLogo"
                            control={control}
                            render={({ field }) => (
                              <>
                                {brandData.logos.length > 0 ? (
                                  brandData.logos
                                    .sort((a, b) => {
                                      if (a.type === 'logo' && b.type !== 'logo') return -1;
                                      if (b.type === 'logo' && a.type !== 'logo') return 1;
                                      if (a.theme === 'light' && b.theme !== 'light') return -1;
                                      if (b.theme === 'light' && a.theme !== 'light') return 1;
                                      return 0;
                                    })
                                    .map((logo, index) => (
                                      <motion.div 
                                        key={index}
                                        onClick={() => field.onChange(logo.url)}
                                        className={cn(
                                          "cursor-pointer rounded-md p-2 h-16 transition-all flex items-center justify-center",
                                          field.value === logo.url 
                                            ? 'ring-2 ring-blue-500 bg-white dark:bg-gray-800' 
                                            : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700'
                                        )}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.2 }}
                                      >
                                        <img 
                                          src={logo.url} 
                                          alt={`${logo.type} - ${logo.theme || 'default'}`} 
                                          className="max-h-full max-w-full object-contain"
                                          loading="lazy"
                                        />
                                      </motion.div>
                                    ))
                                ) : (
                                  <div className="col-span-3 text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                    <Globe className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                    No brand logos found
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                        
                        {/* Company Information */}
                        {(brandData.companyInfo || brandData.description || brandData.name) && (
                          <div className="mt-3 space-y-3">
                            {/* Basic Info */}
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                {brandData.name && (
                                  <div><strong>Company:</strong> <span className="text-gray-900 dark:text-gray-100">{brandData.name}</span></div>
                                )}
                                {brandData.companyInfo?.industry && (
                                  <div><strong>Industry:</strong> <span className="text-gray-900 dark:text-gray-100">{brandData.companyInfo.industry}</span></div>
                                )}
                                {brandData.companyInfo?.location && (
                                  <div><strong>Location:</strong> <span className="text-gray-900 dark:text-gray-100">{brandData.companyInfo.location}</span></div>
                                )}
                                {brandData.companyInfo?.employees && (
                                  <div><strong>Employees:</strong> <span className="text-gray-900 dark:text-gray-100">{brandData.companyInfo.employees.toLocaleString()}+</span></div>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            {brandData.description && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                                <div className="text-xs">
                                  <strong className="text-blue-800 dark:text-blue-200">About:</strong>
                                  <p className="text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                                    {brandData.description.length > 200 
                                      ? `${brandData.description.substring(0, 200)}...` 
                                      : brandData.description}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Social Links */}
                            {brandData.links && brandData.links.length > 0 && (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                <div className="text-xs">
                                  <strong className="text-green-800 dark:text-green-200">Social Links:</strong>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {brandData.links.slice(0, 4).map((link, index) => (
                                      <span 
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 rounded text-xs capitalize"
                                      >
                                        {link.name}
                                      </span>
                                    ))}
                                    {brandData.links.length > 4 && (
                                      <span className="text-green-600 dark:text-green-400 text-xs">
                                        +{brandData.links.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Brand Fonts */}
                            {brandData.fonts && brandData.fonts.length > 0 && (
                              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                                <div className="text-xs">
                                  <strong className="text-purple-800 dark:text-purple-200">Brand Fonts:</strong>
                                  <div className="space-y-1 mt-1">
                                    {brandData.fonts.map((font, index) => (
                                      <div key={index} className="text-purple-700 dark:text-purple-300">
                                        <span className="font-medium">{font.name}</span>
                                        <span className="text-purple-600 dark:text-purple-400 ml-2">({font.type})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Quality Score */}
                            {brandData.qualityScore && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                                <div className="text-xs">
                                  <strong className="text-amber-800 dark:text-amber-200">Brand Quality Score:</strong>
                                  <div className="flex items-center mt-1">
                                    <div className="flex-1 bg-amber-200 dark:bg-amber-700 rounded-full h-2">
                                      <div 
                                        className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.round(brandData.qualityScore * 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-amber-700 dark:text-amber-300 ml-2 font-medium">
                                      {Math.round(brandData.qualityScore * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Brand Colors */}
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Brand Colors
                        </Label>
                        
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Controller
                            name="selectedColor"
                            control={control}
                            render={({ field }) => (
                              <>
                                {brandData.colors.length > 0 ? (
                                  brandData.colors
                                    .sort((a, b) => {
                                      if (a.type === 'primary' && b.type !== 'primary') return -1;
                                      if (b.type === 'primary' && a.type !== 'primary') return 1;
                                      if (a.type === 'accent' && b.type !== 'accent') return -1;
                                      if (b.type === 'accent' && a.type !== 'accent') return 1;
                                      return 0;
                                    })
                                    .map((color, index) => (
                                      <motion.div 
                                        key={index}
                                        onClick={() => field.onChange(color.hex)}
                                        className={cn(
                                          "cursor-pointer rounded-full border-2 transition-all p-1 relative group",
                                          field.value === color.hex 
                                            ? 'border-gray-900 dark:border-white' 
                                            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                        )}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.03, duration: 0.2 }}
                                      >
                                        <div 
                                          className="w-10 h-10 rounded-full"
                                          style={{ backgroundColor: color.hex }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                          {color.type} - {color.hex}
                                        </div>
                                      </motion.div>
                                    ))
                                ) : (
                                  <div className="w-full text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                    No brand colors found
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step3"
                      className="space-y-5"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-4">
                        {loadingContentTypes ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading content types...</p>
                          </div>
                        ) : contentTypes.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                              <Layout className="h-6 w-6 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No content types available</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                              Please try refreshing or contact support if this issue persists.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                            {contentTypes.map((content, index) => (
                              <motion.div 
                                key={content.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => toggleContentType(content.id)}
                                className={`
                                  cursor-pointer relative overflow-hidden group
                                  bg-gradient-to-br rounded-xl transition-all duration-200
                                  ${selectedContentTypes.includes(content.id) 
                                    ? `from-${content.color}-50/90 to-${content.color}-100/50 dark:from-${content.color}-900/40 dark:to-${content.color}-800/30 shadow-md` 
                                    : `from-${content.color}-50/60 to-${content.color}-100/10 dark:from-${content.color}-900/15 dark:to-${content.color}-800/5 hover:from-${content.color}-50/95 hover:to-${content.color}-100/50 dark:hover:from-${content.color}-900/40 dark:hover:to-${content.color}-800/25`}
                                  border border-${content.color}-200/30 dark:border-${content.color}-800/20
                                `}
                              >
                                <div className="flex flex-col p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {content.icon}
                                      <h3 className="text-[0.8rem] font-medium text-gray-900 dark:text-gray-100">{content.title}</h3>
                                    </div>
                                    {selectedContentTypes.includes(content.id) && (
                                      <div className={`p-1 rounded-full bg-${content.color}-100/60 dark:bg-${content.color}-800/40`}>
                                        <Check className={`h-4 w-4 text-${content.color}-600 dark:text-${content.color}-400`} />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[0.7rem] text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-end">
              {wizardStep === 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={fetchBrandData}
                  disabled={!domainValue || brandData.loading}
                  className="text-sm bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 min-w-24"
                >
                  {brandData.loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      <span>Fetching</span>
                    </>
                  ) : (
                    <span>Next</span>
                  )}
                </Button>
              ) : wizardStep === 2 ? (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setWizardStep(1)}
                    disabled={createSiteMutation.isPending}
                    className="text-sm min-w-20"
                  >
                    Back
                  </Button>
                  <Button
                    type="button" 
                    size="sm"
                    onClick={(e) => {
                      // Prevent any form submission
                      e.preventDefault();
                      e.stopPropagation();
                      // Only change the wizard step without submitting the form
                      setWizardStep(3);
                    }}
                    disabled={!nameValue}
                    className="text-sm bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 min-w-24"
                  >
                    <span>Next</span>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setWizardStep(2)}
                    disabled={createSiteMutation.isPending}
                    className="text-sm min-w-20"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    form="create-site-form"
                    size="sm"
                    onClick={() => {
                      // Explicitly set creating process state here as a backup
                      if (wizardStep === 3) {
                        setIsCreatingProcess(true);
                      }
                    }}
                    disabled={createSiteMutation.isPending}
                    className="text-sm bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 min-w-24"
                  >
                    {createSiteMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                        <span>Creating</span>
                      </>
                    ) : (
                      <span>Create Site</span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Right panel - Preview */}
          <div className="hidden md:block md:w-3/4 py-12 pl-20 bg-gradient-to-br from-gray-100/80 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-900/80">
            <div className="flex-1 flex items-center justify-center">
              <SitePreview 
                previewName={nameValue || brandData.name || "Your Site Name"}
                previewColor={selectedColor}
                previewLogo={selectedLogo || (brandData.logos.length > 0 ? brandData.logos[0].url : "")}
                subdomainValue={subdomainValue || ""}
                wizardStep={wizardStep}
                selectedContentTypeObjects={selectedContentTypeObjects}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSiteDialog;