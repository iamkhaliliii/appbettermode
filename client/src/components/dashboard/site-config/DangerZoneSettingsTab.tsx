import { useState } from "react";
import {
  Trash2,
  AlertTriangle
} from "lucide-react";

export function DangerZoneSettingsTab() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteSpace = () => {
    if (deleteConfirmation === 'DELETE') {
      // Handle space deletion logic here
      console.log('Space deletion confirmed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Space Section */}
      <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Delete Space</h3>
        </div>
        <p className="text-xs text-red-700 dark:text-red-300 mb-4">
          Permanently delete this space and all its content. This action cannot be undone.
        </p>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-red-700 dark:text-red-300">
              Type <span className="font-mono bg-red-100 dark:bg-red-900/50 px-1 rounded">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full text-sm bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded-md px-3 py-2 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={handleDeleteSpace}
            disabled={deleteConfirmation !== 'DELETE'}
            className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800 text-white rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="h-3 w-3" />
            Delete Space Permanently
          </button>
        </div>
      </div>
    </div>
  );
} 