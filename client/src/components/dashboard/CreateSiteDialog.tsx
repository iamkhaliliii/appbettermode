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
} from 'lucide-react';
import { sitesApi } from '@/lib/api';
import { z } from 'zod';
import { BrandLogo, BrandColor, CompanyInfo } from '@/pages/sites/types';
import { cn } from '@/lib/utils';

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
});

export type SiteCreationFormInputs = z.infer<typeof siteCreationSchema>;

// --- API Functions ---
const createNewSite = async (data: SiteCreationFormInputs) => {
  return sitesApi.createSite({
    name: data.name,
    subdomain: data.subdomain?.trim().toLowerCase() || undefined,
    domain: data.domain?.trim().toLowerCase() || undefined,
    selectedLogo: data.selectedLogo,
    selectedColor: data.selectedColor
  });
};

interface CreateSiteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSiteDialog: React.FC<CreateSiteDialogProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Wizard step tracking - 1: Domain entry, 2: Site details and brand
  const [wizardStep, setWizardStep] = useState(1);
  
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
      selectedColor: '' 
    },
    mode: 'onChange'
  });

  const nameValue = watch('name');
  const subdomainValue = watch('subdomain');
  const domainValue = watch('domain');
  const selectedLogo = watch('selectedLogo');
  const selectedColor = watch('selectedColor') || '#6366f1';
  
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
      toast({
        title: "Creation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<SiteCreationFormInputs> = (data) => {
    createSiteMutation.mutate(data);
  };

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
  };

  // Preview component for the site
  const SitePreview = () => {
    const previewName = nameValue || brandData.name || "Your Site Name";
    const previewColor = selectedColor || "#6366f1";
    const previewLogo = selectedLogo || (brandData.logos.length > 0 ? brandData.logos[0].url : "");
    
    return (
      <motion.div 
        className="flex flex-col h-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Browser chrome */}
        <div className="flex flex-col rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Browser tabs */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 pt-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex space-x-1.5 absolute left-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex space-x-1 ml-10 mb-[-1px]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-t-md bg-white dark:bg-gray-900 border-t border-l border-r border-gray-200 dark:border-gray-700 text-xs font-medium">
                <div className="w-3 h-3 rounded-full" style={{ background: previewColor }}></div>
                <span className="truncate max-w-[80px]">{previewName}</span>
              </div>
            </div>
          </div>
          
          {/* Browser address bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1.5">
              <div className="text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L3.56 9l2.72 2.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.72 5.22a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06L16.44 9l-2.72-2.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-xs text-center text-gray-600 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600">
              {subdomainValue ? `${subdomainValue}.yourdomain.com` : "yourdomain.com"}
            </div>
          </div>
          <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Logo in navbar */}
                  <div className="flex items-center gap-2.5">
                    {previewLogo ? (
                      <div className="w-8 h-8 relative flex items-center justify-center p-1.5 rounded-md bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-700">
                        <img 
                          src={previewLogo} 
                          alt="Site logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${previewColor}, ${adjustColor(previewColor, -15)})` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {previewName.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-semibold text-sm truncate" style={{ color: previewColor }}>
                      {previewName}
                    </span>
                  </div>

                  <div className="mx-4 h-6 border-l border-gray-200 dark:border-gray-700"></div>
                  
                  <div className="w-40 h-8 rounded-md flex items-center px-3 bg-gray-100 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
          {/* Two-column layout with sidebar and content */}
          <div className="flex flex-1 h-[350px] bg-white dark:bg-gray-900">
            {/* Left Sidebar - Minimal with icons and labels */}
            <div className="w-[180px] border-r border-gray-200 dark:border-gray-700 flex flex-col pt-5 bg-white dark:bg-gray-800">
              {/* Navigation Items with icons and labels */}
              <div className="space-y-1 w-full px-3">
                <div 
                  className="flex items-center gap-3 px-2 py-2 rounded-md"
                  style={{ 
                    backgroundColor: `${previewColor}15`,
                    color: previewColor 
                  }}
                >
                  <div className="w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Home</span>
                </div>
                
                {['users', 'document', 'settings', 'chart'].map((icon, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-5 h-5">
                      {icon === 'users' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      )}
                      {icon === 'document' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === 'settings' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      )}
                      {icon === 'chart' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      )}
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Navigation Bar */}

              
              {/* Content area */}
              <div className="flex-1 overflow-auto">
                {/* Header banner */}
                <div 
                  className="h-36 relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${previewColor}40, ${previewColor}70)`,
                  }}
                >
                  {/* Decorative shapes */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="85" cy="20" r="15" fill="white" />
                      <circle cx="10" cy="40" r="5" fill="white" />
                      <circle cx="50" cy="70" r="20" fill="white" />
                    </svg>
                  </div>
                  
                  {/* Community Name and Description */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-3">
                    {previewLogo ? (
                      <div className="w-14 h-14 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center">
                        <img 
                          src={previewLogo} 
                          alt="Logo" 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                        style={{ 
                          background: `linear-gradient(135deg, ${previewColor}, ${adjustColor(previewColor, -15)})` 
                        }}
                      >
                        <span className="text-white font-bold text-xl">
                          {previewName.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-white text-lg drop-shadow-sm">{previewName}</h2>
                      <p className="text-white/80 text-xs">Your community platform</p>
                    </div>
                  </div>
                  
                  {/* Banner Buttons */}
                  <div className="absolute bottom-5 right-5 flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Main content area */}
                <div className="p-5 space-y-4">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700 -mx-5 px-5 pb-3">
                    <div className="mr-4 border-b-2 pb-3 px-1" style={{ borderColor: previewColor, color: previewColor }}>
                      <span className="font-medium text-sm">All Posts</span>
                    </div>
                    <div className="mr-4 text-gray-500 dark:text-gray-400 px-1">
                      <span className="text-sm">Latest</span>
                    </div>
                    <div className="mr-4 text-gray-500 dark:text-gray-400 px-1">
                      <span className="text-sm">Popular</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        <span>Filter</span>
                      </div>
                      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1 flex items-center">
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-md w-10"></div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Minimal Feed */}
                  <div className="space-y-3 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.3 }}
                      >
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                          <div className="space-y-2 w-full">
                            <div className="flex justify-between items-center">
                              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
                            </div>
                            
                            <div className="space-y-1.5">
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5"></div>
                            </div>
                            
                            {i === 0 && (
                              <div 
                                className="mt-3 h-20 rounded-lg w-full"
                                style={{ background: `linear-gradient(135deg, ${previewColor}20, ${previewColor}40)` }}
                              ></div>
                            )}
                            
                            <div className="flex justify-between pt-2">
                              <div className="flex gap-3">
                                {[...Array(3)].map((_, j) => (
                                  <div key={j} className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-5"></div>
                                ))}
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {wizardStep === 2 && (
          <div className="mt-4 text-center">
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This is a preview of how your site might look. Colors and layout will vary based on the final theme.
            </motion.p>
          </div>
        )}
      </motion.div>
    );
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
      <DialogContent className="sm:max-w-6xl p-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-violet-500"></div>
        
        <div className="flex flex-col md:flex-row h-[80vh] max-h-[700px]">
          {/* Left panel - Form */}
          <div className="md:w-1/2 flex flex-col overflow-hidden border-r border-gray-100 dark:border-gray-800">
            <DialogHeader className="px-8 pt-8 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-500 to-violet-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                  {wizardStep === 1 ? (
                    <Globe className="h-6 w-6 text-white" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                    {wizardStep === 1 ? "Setup Your Site" : "Customize Your Site"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1 text-base">
                    {wizardStep === 1 
                      ? "Enter your domain to get started" 
                      : "Personalize your community platform"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="relative px-8 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    wizardStep === 1 
                      ? 'bg-gradient-to-tr from-primary-500 to-violet-500 text-white shadow-md shadow-primary-500/20' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}>
                    {wizardStep === 1 ? (
                      <span className="text-base font-semibold">1</span>
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className={`h-0.5 w-16 ml-2 mr-2 ${
                    wizardStep === 2 
                      ? 'bg-gradient-to-r from-primary-500 to-violet-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    wizardStep === 2 
                      ? 'bg-gradient-to-tr from-primary-500 to-violet-500 text-white shadow-md shadow-primary-500/20' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}>
                    <span className="text-base font-semibold">2</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 px-8 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              <form id="create-site-form" onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {wizardStep === 1 ? (
                    <motion.div 
                      key="step1"
                      className="space-y-5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-3">
                        <Label 
                          htmlFor="domain" 
                          className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Globe className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                          Website Domain
                        </Label>
                        <div className="relative">
                          <Input
                            id="domain"
                            {...register('domain')}
                            placeholder="e.g., acme.com"
                            className="w-full py-3 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400 text-base"
                            disabled={brandData.loading}
                          />
                          {domainValue && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={() => setValue('domain', '')}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Enter your website domain to automatically fetch your brand assets.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      className="space-y-7"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          Site Name
                        </Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="e.g., Acme Community"
                          className="w-full py-3 bg-white dark:bg-gray-800 text-base"
                          disabled={createSiteMutation.isPending}
                        />
                        {errors.name ? (
                          <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.name.message}</p>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            This is how your site will be identified.
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="subdomain" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          Subdomain
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id="subdomain"
                            {...register('subdomain')}
                            placeholder="e.g., community"
                            className="rounded-r-none flex-1 py-3 text-base"
                            disabled={createSiteMutation.isPending}
                          />
                          <div className="px-4 h-12 flex items-center rounded-r-md border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            .yourdomain.com
                          </div>
                        </div>
                        {errors.subdomain ? (
                          <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.subdomain.message}</p>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            This will be the URL for your site.
                          </p>
                        )}
                      </div>
                      
                      {/* Logo Selection */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                            Site Logo
                          </Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={() => setShowManualLogoInput(!showManualLogoInput)}
                          >
                            {showManualLogoInput ? "Show Suggestions" : "Add Manually"}
                          </Button>
                        </div>
                        
                        {!showManualLogoInput ? (
                          // Logo suggestions
                          <div className="grid grid-cols-2 gap-3 mt-2">
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
                                      .slice(0, 4) // Show up to 4 logos to save space
                                      .map((logo, index) => (
                                        <motion.div 
                                          key={index}
                                          onClick={() => field.onChange(logo.url)}
                                          className={cn(
                                            "cursor-pointer rounded-lg p-3 h-20 transition-all flex items-center justify-center",
                                            field.value === logo.url 
                                              ? 'ring-2 ring-primary-500 dark:ring-primary-400 bg-white dark:bg-gray-800 shadow-md' 
                                              : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700'
                                          )}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.1, duration: 0.3 }}
                                        >
                                          <div className="h-full w-full flex items-center justify-center">
                                            <img 
                                              src={logo.url} 
                                              alt={`Logo ${index + 1}`} 
                                              className="max-h-full max-w-full object-contain"
                                            />
                                          </div>
                                        </motion.div>
                                      ))
                                  ) : (
                                    <div className="col-span-2 text-center p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                      No logos found for this domain
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        ) : (
                          // Manual logo input
                          <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-5 mt-2 bg-gray-50 dark:bg-gray-800">
                            <Controller
                              name="selectedLogo"
                              control={control}
                              render={({ field }) => (
                                <div className="flex flex-col items-center gap-4">
                                  {field.value ? (
                                    <div className="relative p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                                      <img 
                                        src={field.value} 
                                        alt="Selected logo" 
                                        className="max-h-24 object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => field.onChange('')}
                                        className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-1 border border-gray-200 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shadow-sm"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Enter logo URL
                                      </p>
                                      <Input
                                        placeholder="https://example.com/logo.png"
                                        className="w-full"
                                        onChange={(e) => field.onChange(e.target.value)}
                                      />
                                    </>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Color Selection */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                            Brand Color
                          </Label>
                          <Button 
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={() => setShowManualColorInput(!showManualColorInput)}
                          >
                            {showManualColorInput ? "Show Suggestions" : "Add Manually"}
                          </Button>
                        </div>
                        
                        {!showManualColorInput ? (
                          // Color suggestions
                          <div className="flex flex-wrap gap-3 mt-2">
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
                                      .slice(0, 6) // Show up to 6 colors to save space
                                      .map((color, index) => (
                                        <motion.div 
                                          key={index}
                                          onClick={() => field.onChange(color.hex)}
                                          className={cn(
                                            "cursor-pointer rounded-full border-2 transition-all p-0.5",
                                            field.value === color.hex ? 'border-gray-800 dark:border-white scale-110 shadow-md' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                          )}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: field.value === color.hex ? 1.1 : 1 }}
                                          transition={{ delay: index * 0.05, duration: 0.3 }}
                                        >
                                          <div 
                                            className="w-10 h-10 rounded-full"
                                            style={{ background: `linear-gradient(135deg, ${color.hex}, ${adjustColor(color.hex, -20)})` }}
                                            title={color.type || color.hex}
                                          />
                                        </motion.div>
                                      ))
                                  ) : (
                                    <div className="w-full text-center p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                      No brand colors found
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        ) : (
                          // Manual color input
                          <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-5 mt-2 bg-gray-50 dark:bg-gray-800">
                            <Controller
                              name="selectedColor"
                              control={control}
                              render={({ field }) => (
                                <div className="flex flex-col items-center gap-4">
                                  {field.value && (
                                    <div 
                                      className="w-16 h-16 rounded-full shadow-md"
                                      style={{ background: `linear-gradient(135deg, ${field.value}, ${adjustColor(field.value, -20)})` }}
                                    />
                                  )}
                                  <Input
                                    placeholder="#6366f1"
                                    value={field.value}
                                    className="w-full"
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  if (wizardStep === 1) {
                    onOpenChange(false);
                  } else {
                    setWizardStep(1);
                  }
                }}
                disabled={brandData.loading || createSiteMutation.isPending}
              >
                {wizardStep === 1 ? "Cancel" : <ArrowLeft className="h-4 w-4" />}
                {wizardStep === 1 ? "" : "Back"}
              </Button>
              
              {wizardStep === 1 ? (
                <Button
                  type="button"
                  onClick={fetchBrandData}
                  disabled={!domainValue || brandData.loading}
                  className="bg-gradient-to-r from-primary-500 to-violet-500 hover:from-primary-600 hover:to-violet-600 text-white gap-2 shadow-md shadow-primary-500/20"
                >
                  {brandData.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching Brand Data
                    </>
                  ) : (
                    <>
                      Continue
                      <motion.div 
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="create-site-form"
                  disabled={createSiteMutation.isPending || !nameValue}
                  className="bg-gradient-to-r from-primary-500 to-violet-500 hover:from-primary-600 hover:to-violet-600 text-white gap-2 shadow-md shadow-primary-500/20"
                >
                  {createSiteMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Site
                    </>
                  ) : (
                    <>
                      Create Site
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Right panel - Preview */}
          <div className="hidden md:block md:w-3/4 py-12 pl-20 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900/80 dark:via-gray-800 dark:to-gray-900/80">
            <div className="h-full flex flex-col">
              
              <div className="flex-1 flex items-center justify-center">
                <SitePreview />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSiteDialog;