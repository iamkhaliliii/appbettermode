import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { sitesApi, Site } from '@/lib/api'; // Import the new API client
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
  Globe,
  Clock,
  TagIcon,
  LayoutGrid,
  X,
  RefreshCw,
  ChevronDown
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiteCreationFormInputs } from './types';

// --- Validation Schema (for create site form) ---
const siteCreationSchema = z.object({
  name: z.string()
    .min(2, 'Site name must be at least 2 characters.')
    .max(50, 'Site name cannot exceed 50 characters.'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters.')
    .max(30, 'Subdomain cannot exceed 30 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid subdomain format (lowercase letters, numbers, and hyphens).')
    .optional()
    .or(z.literal('')),
});

// --- API Functions using our new API client ---
const fetchUserSites = async (): Promise<Site[]> => {
  return sitesApi.getAllSites();
};

const createNewSite = async (data: SiteCreationFormInputs): Promise<Site> => {
  return sitesApi.createSite({
    name: data.name,
    subdomain: data.subdomain?.trim().toLowerCase() || undefined,
  });
};

// --- Helper Components ---
const SiteStateBadge: React.FC<{ state?: string | null }> = ({ state }) => {
  if (!state) return null;

  const normalizedState = state.toLowerCase();
  let bgColor = 'bg-gray-100 dark:bg-gray-700';
  let textColor = 'text-gray-600 dark:text-gray-300';
  let dotColor = 'bg-gray-400';
  let Icon = TagIcon;

  if (normalizedState === 'active') {
    bgColor = 'bg-green-100 dark:bg-green-900/30';
    textColor = 'text-green-700 dark:text-green-300';
    dotColor = 'bg-green-500';
    Icon = CheckCircle2;
  } else if (normalizedState === 'pending') {
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    textColor = 'text-yellow-700 dark:text-yellow-400';
    dotColor = 'bg-yellow-500';
    Icon = Clock;
  } else if (normalizedState === 'inactive') {
    bgColor = 'bg-slate-100 dark:bg-slate-800';
    textColor = 'text-slate-600 dark:text-slate-400';
    dotColor = 'bg-slate-500';
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-transparent shadow-sm`}>
      <Icon className={`w-3 h-3 mr-1.5 ${normalizedState === 'active' || normalizedState === 'pending' ? textColor : dotColor}`} />
      {state.charAt(0).toUpperCase() + state.slice(1)}
    </div>
  );
};

const SiteCard: React.FC<{ site: Site }> = ({ site }) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Link href={APP_ROUTES.DASHBOARD_SITE.INDEX(site.subdomain || site.id)} className="block group">
      <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 hover:shadow-xl dark:hover:border-primary-500/50 transition-all duration-300 ease-in-out h-full flex flex-col rounded-lg overflow-hidden will-change-transform group-hover:translate-y-[-4px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <CardHeader className="p-5 border-b dark:border-gray-700/60 relative">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate" title={site.name}>
              {site.name}
            </h3>
            <SiteStateBadge state={site.state} />
          </div>
          {site.subdomain ? (
            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{site.subdomain}.yourdomain.com</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">No subdomain</p>
          )}
        </CardHeader>
        <CardContent className="p-5 flex-grow space-y-3 relative z-10">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span>Created: {formatDate(site.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span>Updated: {formatDate(site.updatedAt)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700/60 relative z-10">
          <div className="flex justify-between w-full items-center">
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary-600 dark:text-primary-400 group-hover:underline p-0 h-auto"
            >
              View Dashboard
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronDown className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
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
    formState: { errors, isSubmitting, isValid, touchedFields },
    watch,
  } = useForm<SiteCreationFormInputs>({
    resolver: zodResolver(siteCreationSchema),
    defaultValues: { name: '', subdomain: '' },
    mode: 'onChange'
  });

  const nameValue = watch('name');
  const subdomainValue = watch('subdomain');

  const createSiteMutation = useMutation({
    mutationFn: createNewSite,
    onSuccess: (newSite) => {
      queryClient.invalidateQueries({ queryKey: ['userSites'] });
      reset();
      onOpenChange(false);
      toast({
        title: "Site Created!",
        description: `The site "${newSite.name}" has been successfully created.`,
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

  // Auto-generate subdomain suggestion based on name
  useEffect(() => {
    if (nameValue && !touchedFields.subdomain) {
      const suggestedSubdomain = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }, [nameValue, touchedFields.subdomain]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (createSiteMutation.isPending) return;
      onOpenChange(open);
      if (!open) reset();
    }}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 p-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <DialogHeader className="p-6 pb-3 border-b dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create a New Site</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fill in the details below to launch your new community site.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="px-6 py-4 space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Site Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., My Awesome Community"
              className={`w-full h-10 px-3 rounded-md border dark:bg-gray-700 dark:text-gray-200 ${errors.name ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400'}`}
              disabled={createSiteMutation.isPending}
            />
            {errors.name ? (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fadeIn">{errors.name.message}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 h-4"></p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subdomain" className="font-medium text-gray-700 dark:text-gray-300">Subdomain <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span></Label>
            <div className="flex items-center relative">
              <Input
                id="subdomain"
                {...register('subdomain')}
                placeholder="e.g., my-community"
                className={`w-full h-10 px-3 rounded-l-md border dark:bg-gray-700 dark:text-gray-200 ${errors.subdomain ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400'} rounded-r-none border-r-0`}
                disabled={createSiteMutation.isPending}
              />
              <span className="px-3 h-10 inline-flex items-center rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm">
                .yourdomain.com
              </span>
              {subdomainValue && (
                <button
                  type="button"
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => {
                    const field = register('subdomain');
                    field.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {errors.subdomain ? (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fadeIn">{errors.subdomain.message}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                Lowercase letters, numbers, and hyphens only. Leave blank for no subdomain.
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (createSiteMutation.isPending) return;
                reset();
                onOpenChange(false);
              }}
              disabled={createSiteMutation.isPending}
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={createSiteMutation.isPending}            >
              {createSiteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                  Creating Site...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4.5 w-4.5" />
                  Create Site
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Skeleton Placeholder for loading state ---
const SiteCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-lg overflow-hidden h-full flex flex-col animate-pulse">
    <div className="p-5 border-b dark:border-gray-700/60">
      <div className="flex justify-between items-start gap-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mt-2"></div>
    </div>
    <div className="p-5 flex-grow space-y-3">
      <div className="flex items-center">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700/60">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
  </div>
);

// --- Main Component ---
const SitesDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: sites = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Site[], Error>({
    queryKey: ['userSites'],
    queryFn: fetchUserSites,
    refetchOnWindowFocus: true,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800); // Ensure minimal spinner time for UX
  };

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

  const availableStates = useMemo(() => {
    const uniqueStates = new Set(sites.map(site => site.state).filter(Boolean) as string[]);
    return ['all', ...Array.from(uniqueStates).sort()];
  }, [sites]);

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-primary-600 dark:text-primary-400 mb-6" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-t-2 border-primary-600/20 dark:border-primary-400/20 animate-ping"></div>
        </div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Your Sites</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we fetch your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full text-center">
          <div className="relative">
            <AlertCircle className="h-20 w-20 text-red-500 dark:text-red-400 mx-auto mb-6" />
            <div className="absolute inset-0 h-20 w-20 rounded-full border-2 border-red-500/20 dark:border-red-400/20 animate-pulse"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an error while trying to load your sites. Please try again.
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md mb-8">
            <strong>Error:</strong> {error.message || "An unexpected error occurred."}
          </p>
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white"
            onClick={() => queryClient.refetchQueries({ queryKey: ['userSites'] })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <header className="mb-10 md:mb-12 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <LayoutGrid className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                  My Sites Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Oversee and manage all your community platforms.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="default"
                onClick={() => setIsCreateDialogOpen(true)}
                size="default"              >
                <Plus className="h-4 w-4 mr-2" />
                New Site
              </Button>
            </div>
          </div>
        </header>

        {/* Filters and Search Section */}
        <div className="mb-8 p-5 bg-white dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60">
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
            <div className="w-full md:flex-grow relative">
              <Label htmlFor="search-sites" className="sr-only">Search sites</Label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="search-sites"
                type="search"
                placeholder="Search by name or subdomain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 h-auto w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="w-full md:w-auto md:min-w-[220px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="w-full justify-between items-center h-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      {stateFilter === 'all' ? 'All States' : (stateFilter.charAt(0).toUpperCase() + stateFilter.slice(1))}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full min-w-[220px]">
                  {availableStates.map(s => (
                    <DropdownMenuItem 
                      key={s} 
                      onClick={() => setStateFilter(s.toLowerCase())}
                      className={stateFilter === s.toLowerCase() ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''}
                    >
                      {s === 'all' ? 'All States' : (s.charAt(0).toUpperCase() + s.slice(1))}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Sites Grid or Empty State */}
        {sites.length > 0 && filteredSites.length === 0 && !isLoading && (
          <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800/30 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60">
            <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Sites Match Your Filters
            </h3>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search query or changing the selected state filter.
            </p>
            <Button variant="secondary" onClick={clearFilters} className="px-6">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}

        {sites.length === 0 && !isLoading && (
          <div className="text-center py-16 md:py-24 bg-white dark:bg-gray-800/30 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60">
            <div className="mx-auto h-20 w-20 rounded-xl bg-primary-100/50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
              <LayoutGrid className="h-12 w-12 text-primary-500 dark:text-primary-400 opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              No Sites Yet!
            </h3>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              It looks like you haven't created any sites. Let's get your first community up and running.
            </p>
            <Button
              variant="default"
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2.5" />
              Create Your First Site
            </Button>
          </div>
        )}

        {filteredSites.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AnimatePresence>
              {filteredSites.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30, 
                    mass: 1
                  }}
                  className="h-full"
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