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
  Users,
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
import { Site, SiteCreationFormInputs } from './types';

// --- Validation Schema ---
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
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch sites' }));
    throw new Error(errorData.message || 'Failed to fetch sites');
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
    const errorData = await response.json().catch(() => ({ message: 'Failed to create site' }));
    throw new Error(errorData.message || 'Failed to create site');
  }
  return response.json();
};

// --- Helper Components ---
const SiteCard: React.FC<{ site: Site }> = ({ site }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400',
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusStyle = (status: string | undefined) => {
    if (!status || !statusStyles[status as keyof typeof statusStyles]) {
      return statusStyles.inactive; // Default style
    }
    return statusStyles[status as keyof typeof statusStyles];
  };

  return (
    <Link href={APP_ROUTES.DASHBOARD_SITE.INDEX(site.id)}>
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{site.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(site.status)}`}>
              {getStatusText(site.status)}
            </span>
          </CardTitle>
          <CardDescription>
            {site.subdomain ? `${site.subdomain}.yourdomain.com` : 'No subdomain set'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{site.memberCount || 0} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(site.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last activity: {site.lastActivityAt ? new Date(site.lastActivityAt).toLocaleDateString() : 'Never'}
          </span>
          <ExternalLink className="h-4 w-4 text-gray-400" />
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
    setError,
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
        description: `Site "${newSite.name}" has been created.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary-gray"
              onClick={() => onOpenChange(false)}
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    data: sites = [],
    isLoading,
    error,
  } = useQuery<Site[], Error>({
    queryKey: ['userSites'],
    queryFn: fetchUserSites,
  });

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.subdomain?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sites, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading your sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Sites
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
          <Button
            variant="secondary-gray"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Sites
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and monitor all your sites from one place
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Site
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sites Grid */}
          {filteredSites.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No sites found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first site'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Site
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                    transition={{ duration: 0.2 }}
                  >
                    <SiteCard site={site} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <CreateSiteDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default SitesDashboardPage;
