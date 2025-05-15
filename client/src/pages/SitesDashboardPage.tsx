import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Input } from '@/components/ui/input';   // Assuming shadcn/ui Input
import { Label } from '@/components/ui/label';   // Assuming shadcn/ui Label
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, PlusCircle, List, ChevronRight, Loader2 } from 'lucide-react'; // More icons
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { Link } from "wouter"; 

// --- API Fetching Functions ---
const fetchUserSites = async (): Promise<Site[]> => {
  // TODO: Implement actual authentication to pass user context to backend if needed
  const response = await fetch('/api/sites');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch sites and parse error' }));
    throw new Error(errorData.message || 'Failed to fetch sites');
  }
  return response.json();
};

// Zod schema for site creation form validation (client-side)
const siteCreationSchema = z.object({
  name: z.string().min(2, 'Site name must be at least 2 characters.'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid subdomain (lowercase, numbers, hyphens, no leading/trailing hyphen).')
    .optional()
    .or(z.literal('')), // Allow empty string, which will be treated as null/undefined
});

type SiteCreationFormInputs = z.infer<typeof siteCreationSchema>;

interface Site {
  id: string;
  name: string;
  subdomain?: string | null;
  role: string;
  createdAt: string;
  // Potentially other fields like ownerId if needed for display
}

const createNewSite = async (data: SiteCreationFormInputs): Promise<Site> => {
  const payload = {
    ...data,
    // Ensure empty string for optional subdomain is sent as null or omitted if API expects that
    subdomain: data.subdomain && data.subdomain.trim() !== '' ? data.subdomain.trim() : null,
  };
  const response = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create site and parse error' }));
    throw new Error(errorData.message || 'Failed to create site');
  }
  return response.json();
};

// --- Component ---
const SitesDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: sites = [],
    isLoading: isLoadingSites,
    error: sitesError,
  } = useQuery<Site[], Error>({ queryKey: ['userSites'], queryFn: fetchUserSites });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError, // To manually set errors, e.g., from server
  } = useForm<SiteCreationFormInputs>({
    resolver: zodResolver(siteCreationSchema),
    defaultValues: { name: '', subdomain: '' },
  });

  const createSiteMutation = useMutation<Site, Error, SiteCreationFormInputs>({
    mutationFn: createNewSite,
    onSuccess: (newSite) => {
      queryClient.invalidateQueries({ queryKey: ['userSites'] });
      reset({ name: '', subdomain: '' });
      setShowCreateForm(false);
      toast({
        title: "Site Created!",
        description: `Site "${newSite.name}" has been successfully created.`,
        variant: "default", // Or use a custom "success" variant if available
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    },
    onError: (error) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      toast({
        title: "Error Creating Site",
        description: errorMessage,
        variant: "destructive",
      });
      if (errorMessage.toLowerCase().includes('subdomain')) {
        setError('subdomain', { type: 'server', message: errorMessage });
      } else {
        setError('root.serverError', { type: 'server', message: errorMessage });
      }
    },
  });

  const onSubmit: SubmitHandler<SiteCreationFormInputs> = (data) => {
    createSiteMutation.mutate(data);
  };

  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Your Sites</h1>
          <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Manage your existing sites or create a new one to get started.</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} size="lg" className="flex-shrink-0">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Site
          </Button>
        )}
      </header>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-10 overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Add a New Site</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Site Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="mt-1"
                    placeholder="e.g., My Awesome Community"
                    disabled={createSiteMutation.isPending}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="subdomain" className="text-sm font-medium">Subdomain (Optional)</Label>
                  <div className="mt-1 flex rounded-md">
                    <Input
                      id="subdomain"
                      type="text"
                      {...register('subdomain')}
                      className="rounded-none rounded-l-md focus:z-10"
                      placeholder="e.g., mycommunity"
                      disabled={createSiteMutation.isPending}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                      .yourplatform.com {/* TODO: Replace .yourplatform.com with your actual platform domain */}
                    </span>
                  </div>
                  {errors.subdomain && <p className="mt-1 text-xs text-red-500">{errors.subdomain.message}</p>}
                  {errors.root?.serverError && <p className="mt-1 text-xs text-red-500">{errors.root.serverError.message}</p>}
                </div>
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => { reset(); setShowCreateForm(false); createSiteMutation.reset(); }}
                    disabled={createSiteMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createSiteMutation.isPending}
                  >
                    {createSiteMutation.isPending ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </>
                    ) : 'Create Site'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoadingSites && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-10 w-10 text-blue-600 animate-spin" />
          <p className="mt-3 text-md font-medium text-gray-600 dark:text-gray-400">Loading your sites...</p>
        </div>
      )}
      {sitesError && (
        <div className="my-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-3 text-xl font-semibold text-red-700 dark:text-red-300">Oops! Something went wrong.</h3>
            <p className="mt-1 text-md text-red-600 dark:text-red-400">Failed to load your sites. Error: {sitesError.message}</p>
            {/* Optionally, add a retry button */}
        </div>
      )}
      
      {!isLoadingSites && !sitesError && sites.length === 0 && !showCreateForm && (
        <motion.div {...cardAnimation} className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <List className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">No Sites Yet!</h3>
          <p className="mt-2 text-md text-gray-500 dark:text-gray-400">It looks like you haven't created or joined any sites.</p>
          <Button onClick={() => setShowCreateForm(true)} className="mt-8" size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Site
          </Button>
        </motion.div>
      )}

{!isLoadingSites && !sitesError && sites.length > 0 && (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, index) => (
            <motion.div
              key={site.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate" title={site.name}>{site.name}</h2>
                {site.subdomain && (
                  <p className="text-sm text-indigo-500 dark:text-indigo-400 mb-3 truncate">
                    <a
                      href={`http://${site.subdomain}.yourplatform.com`} /* TODO: Use HTTPS and actual platform domain from config */
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      title={`http://${site.subdomain}.yourplatform.com`}
                    >
                      {site.subdomain}.yourplatform.com
                    </a>
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Role: <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{site.role}</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Created: {new Date(site.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/site/${site.id}/overview`}>
                  <a className="group text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-between w-full">
                    <span>Manage Site</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SitesDashboardPage;
