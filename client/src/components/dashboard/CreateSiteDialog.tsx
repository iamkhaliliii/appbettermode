import React, { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
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

// --- Content Types for Step 3 ---
interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const contentTypes: ContentType[] = [
  {
    id: "event",
    title: "Event",
    description: "Organize events with scheduling and registrations.",
    icon: <Calendar className="h-5 w-5 text-emerald-500" />,
    color: "emerald"
  },
  {
    id: "discussion",
    title: "Discussion",
    description: "Start conversations with community members.",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    color: "blue"
  },
  {
    id: "qa",
    title: "Q&A",
    description: "Enable community Q&A with voting system.",
    icon: <HelpCircle className="h-5 w-5 text-violet-500" />,
    color: "violet"
  },
  {
    id: "wishlist",
    title: "Wishlist",
    description: "Collect and prioritize community ideas.",
    icon: <Star className="h-5 w-5 text-amber-500" />,
    color: "amber"
  },
  {
    id: "landing",
    title: "Landing Page",
    description: "Create beautiful marketing pages.",
    icon: <Layout className="h-5 w-5 text-indigo-500" />,
    color: "indigo"
  },
  {
    id: "knowledge",
    title: "Knowledge Base",
    description: "Build a searchable help center.",
    icon: <BookOpen className="h-5 w-5 text-rose-500" />,
    color: "rose"
  },
  {
    id: "jobs",
    title: "Job List",
    description: "Post and manage job openings.",
    icon: <Briefcase className="h-5 w-5 text-cyan-500" />,
    color: "cyan"
  },
  {
    id: "blog",
    title: "Blog",
    description: "Share updates and stories.",
    icon: <FileText className="h-5 w-5 text-purple-500" />,
    color: "purple"
  }
];

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
    logos: BrandLogo[];
    colors: BrandColor[];
    companyInfo?: CompanyInfo;
    loading: boolean;
    error: string | null;
  }>({
    logos: [],
    colors: [],
    loading: false,
    error: null
  });
  
  // Manual upload options
  const [showManualLogoInput, setShowManualLogoInput] = useState(false);
  const [showManualColorInput, setShowManualColorInput] = useState(false);
  
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
    setShowManualLogoInput(false);
    setShowManualColorInput(false);
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
                      
                      {/* Logo Selection */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Brand Logo
                          </Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setShowManualLogoInput(!showManualLogoInput)}
                          >
                            {showManualLogoInput ? "Show Suggestions" : "Add Manually"}
                          </Button>
                        </div>
                        
                        {!showManualLogoInput ? (
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
                                      .slice(0, 6)
                                      .map((logo, index) => (
                                        <motion.div 
                                          key={index}
                                          onClick={() => field.onChange(logo.url)}
                                          className={cn(
                                            "cursor-pointer rounded-md p-2 h-16 transition-all flex items-center justify-center",
                                            field.value === logo.url 
                                              ? 'ring-1 ring-blue-500 bg-white dark:bg-gray-800' 
                                              : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700'
                                          )}
                                          initial={{ opacity: 0, y: 5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.05, duration: 0.2 }}
                                        >
                                          <img 
                                            src={logo.url} 
                                            alt={`Logo ${index + 1}`} 
                                            className="max-h-full max-w-full object-contain"
                                          />
                                        </motion.div>
                                      ))
                                  ) : (
                                    <div className="col-span-3 text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                      No logos found
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="mt-1 border border-dashed border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                            <Controller
                              name="selectedLogo"
                              control={control}
                              render={({ field }) => (
                                <div className="flex flex-col items-center gap-2">
                                  {field.value ? (
                                    <div className="relative p-2 bg-white dark:bg-gray-700 rounded-md">
                                      <img 
                                        src={field.value} 
                                        alt="Selected logo" 
                                        className="max-h-16 object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => field.onChange('')}
                                        className="absolute -top-1.5 -right-1.5 bg-white dark:bg-gray-700 rounded-full p-0.5 border border-gray-200 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <Input
                                      placeholder="Logo URL"
                                      className="text-xs w-full"
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Color Selection */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Brand Color
                          </Label>
                          <Button 
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => setShowManualColorInput(!showManualColorInput)}
                          >
                            {showManualColorInput ? "Show Suggestions" : "Add Manually"}
                          </Button>
                        </div>
                        
                        {!showManualColorInput ? (
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
                                      .slice(0, 8)
                                      .map((color, index) => (
                                        <motion.div 
                                          key={index}
                                          onClick={() => field.onChange(color.hex)}
                                          className={cn(
                                            "cursor-pointer rounded-full border transition-all p-0.5",
                                            field.value === color.hex ? 'border-gray-900 dark:border-white' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                          )}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.03, duration: 0.2 }}
                                        >
                                          <div 
                                            className="w-8 h-8 rounded-full"
                                            style={{ backgroundColor: color.hex }}
                                            title={color.type || color.hex}
                                          />
                                        </motion.div>
                                      ))
                                  ) : (
                                    <div className="w-full text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                      No brand colors found
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="mt-1 border border-dashed border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                            <Controller
                              name="selectedColor"
                              control={control}
                              render={({ field }) => (
                                <div className="flex items-center gap-3">
                                  {field.value && (
                                    <div 
                                      className="w-8 h-8 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: field.value }}
                                    />
                                  )}
                                  <Input
                                    placeholder="#6366f1"
                                    value={field.value}
                                    className="text-xs w-full"
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        )}
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
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                          {contentTypes.map((content, index) => (
                            <motion.div 
                              key={content.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              onClick={() => toggleContentType(content.id)}
                              className={cn(
                                "cursor-pointer rounded-md p-3 transition-all border",
                                selectedContentTypes.includes(content.id) 
                                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm' 
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-${content.color}-100 dark:bg-${content.color}-900/20`}>
                                  {content.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {content.title}
                                    </h3>
                                    {selectedContentTypes.includes(content.id) && (
                                      <Check className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {content.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
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
                selectedContentTypes={selectedContentTypes}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSiteDialog;