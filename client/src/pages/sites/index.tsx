import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Users, // Will be removed from SiteCard
  Calendar,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "wouter";
import { APP_ROUTES } from "@/config/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Site, SiteCreationFormInputs } from './types'; // Uses updated Site type

// --- Validation Schema (for create site form) ---
const siteCreationSchema = z.object({
  name: z.string()
    .min(2, 'Site name must be at least 2 characters.')
    .max(50, 'Site name cannot exceed 50 characters.'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters.')
    .max(30, 'Subdomain cannot exceed 30 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid subdomain format.')
    .optional()
    .or(z.literal('')),
});

// --- API Functions ---
const fetchUserSites = async (): Promise<Site[]> => {
  const response = await fetch('/api/sites');
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to fetch sites';
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        errorMessage = 'Failed to parse JSON error response.';
      }
    } else {
      try {
        const errorText = await response.text();
        if (errorText && errorText.toLowerCase().includes('<!doctype html')) {
          errorMessage = `Server returned an HTML page instead of JSON. Status: ${response.status}`;
        } else if (errorText) {
          errorMessage = `Server error: ${errorText.substring(0, 150)}`; // Show a snippet
        } else {
          errorMessage = `Failed to fetch sites. Status: ${response.status}`;
        }
      } catch (textError) {
        errorMessage = `Failed to read error response. Status: ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const createNewSite = async (data: SiteCreationFormInputs): Promise<Site> => {
  const response = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      subdomain: data.subdomain?.trim() || null,
    }),
  });

  if (!response.ok) {
    // Assuming error response is JSON, if not, more robust handling like in fetchUserSites might be needed
    const errorData = await response.json().catch(() => ({ message: 'Failed to create site. Server returned non-JSON response.' }));
    throw new Error(errorData.message || 'Failed to create site');
  }
  return response.json(); // Expects the new Site object matching the updated Site type
};

// --- Helper Components ---
const SiteCard: React.FC<{ site: Site }> = ({ site }) => {
  // Adjusted styles for potentially different 'state' values.
  // Ensure keys are lowercase for matching.
  const stateStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400',
    // Add more states if your backend uses them, e.g.:
    // archived: 'bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400',
  };

  const getStateText = (stateValue?: string | null) => {
    if (!stateValue) return 'Unknown';
    return stateValue.charAt(0).toUpperCase() + stateValue.slice(1);
  };

  const getStateStyle = (stateValue?: string | null) => {
    const normalizedState = stateValue?.toLowerCase();
    if (!normalizedState || !stateStyles[normalizedState]) {
      return stateStyles.inactive; // Default style
    }
    return stateStyles[normalizedState];
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return 'Invalid Date';
    }
  };

  return (
    <Link href={APP_ROUTES.DASHBOARD_SITE.INDEX(site.id)}>
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate" title={site.name}>{site.name}</span>
            {site.state && (
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStateStyle(site.state)}`}>
                {getStateText(site.state)}
              </span>
            )}
          </CardTitle>
          <CardDescription className="truncate" title={site.subdomain ? `${site.subdomain}.yourdomain.com` : 'No subdomain set'}>
            {site.subdomain ? `${site.subdomain}.yourdomain.com` : 'No subdomain set'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Created: {formatDate(site.createdAt)}</span>
          </div>
          {/* Member count display removed as site.memberCount is no longer available */}
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            Updated: {formatDate(site.updatedAt)}
          </span>
          <ExternalLink className="h-4 w-4" />
        </CardFooter>
      </Card>
    </Link>
  );
};

const CreateSiteDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // setError, // setError is not used in current implementation, can be removed if not planned
  } = useForm<SiteCreationFormInputs>({
    resolver: zodResolver(siteCreationSchema),
    defaultValues: { name: '', subdomain: '' },
  });

  const createSiteMutation = useMutation({
    mutationFn: createNewSite,
    onSuccess: (newSite) => {
      queryClient.invalidateQueries({ queryKey: ['userSites'] });
      reset();
      onOpenChange(false);
      toast({
        title: "Success!",
        description: `Site "${newSite.name}" has been created.`, // newSite now has the updated Site structure
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Site",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<SiteCreationFormInputs> = (data) => {
    createSiteMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Enter the details for your new site. You can always modify these later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Site Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="My Awesome Site"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain (Optional)</Label>
            <Input
              id="subdomain"
              {...register('subdomain')}
              placeholder="my-site"
              className={errors.subdomain ? 'border-red-500' : ''}
            />
            {errors.subdomain && (
              <p className="text-sm text-red-500">{errors.subdomain.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If provided, your site will be available at my-site.yourdomain.com
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary-gray"
              onClick={() => { reset(); onOpenChange(false); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSiteMutation.isPending}
            >
              {createSiteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Site'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---
const SitesDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all'); // Renamed from statusFilter

  const {
    data: sites = [],
    isLoading,
    error,
  } = useQuery<Site[], Error>({ // Site[] uses the updated Site type
    queryKey: ['userSites'],
    queryFn: fetchUserSites,
  });

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = site.name.toLowerCase().includes(searchLower);
      const subdomainMatch = site.subdomain?.toLowerCase().includes(searchLower);
      const matchesSearch = nameMatch || subdomainMatch;

      const siteStateNormalized = site.state?.toLowerCase();
      const filterStateNormalized = stateFilter.toLowerCase();
      const matchesState = filterStateNormalized === 'all' || (siteStateNormalized && siteStateNormalized === filterStateNormalized);

      return matchesSearch && matchesState;
    });
  }, [sites, searchQuery, stateFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-primary-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your sites...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Error Loading Sites
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <Button
            variant="secondary-gray"
            className="w-full"
            onClick={() => queryClient.refetchQueries({ queryKey: ['userSites'] })} // Use React Query's refetch
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Define available states for the filter dropdown - this should ideally match actual states from your backend
  const availableStates = useMemo(() => {
    const uniqueStates = new Set(sites.map(site => site.state).filter(Boolean) as string[]);
    return ['all', ...Array.from(uniqueStates).sort()];
  }, [sites]);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Your Sites
              </h1>
              <p className="mt-1.5 text-md text-gray-600 dark:text-gray-400">
                Manage and monitor all your Bettermode sites from one place.
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create New Site
            </Button>
          </div>
        </header>

        {/* Filters and Search Section */}
        <Card className="mb-6 md:mb-8 p-4 sm:p-6 border-border dark:border-border">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-full sm:flex-grow">
              <Label htmlFor="search-sites" className="sr-only">Search sites</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="search-sites"
                  type="search"
                  placeholder="Search by name or subdomain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="state-filter" className="sr-only">Filter by state</Label>
              <select
                id="state-filter"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="h-10 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
              >
                {availableStates.map(s => (
                  <option key={s} value={s.toLowerCase()}>
                    {s === 'all' ? 'All States' : (s.charAt(0).toUpperCase() + s.slice(1))}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        

        {/* Sites Grid or Empty State */}
        {filteredSites.length === 0 && !isLoading ? (
          <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-800/30 mb-6">
              <AlertCircle className="h-8 w-8 text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No sites found
            </h3>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || stateFilter !== 'all'
                ? 'Try adjusting your search or filters, or create a new site.'
                : 'Get started by creating your first site!'}
            </p>
            {!searchQuery && stateFilter === 'all' && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Site
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {filteredSites.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <SiteCard site={site} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <CreateSiteDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default SitesDashboardPage;