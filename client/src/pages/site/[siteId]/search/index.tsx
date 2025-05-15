import { useRoute } from "wouter";

export default function SiteFrontendSearch() {
  const [, params] = useRoute('/site/:siteId/search/:query?');
  const siteId = params?.siteId;
  const query = params?.query;

  // If no siteId is provided, show an error state
  if (!siteId) {
    return (
      <div className="p-8 text-center text-red-600">
        No site ID provided
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Search Results</h1>
        {query && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Showing results for: {query}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Site Search</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {query ? `Searching for "${query}" in site ${siteId}` : 'Enter a search term to begin'}
          </p>
        </div>
      </div>
    </div>
  );
} 