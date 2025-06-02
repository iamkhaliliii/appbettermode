import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for API requests based on environment
 */
export function getApiUrl(): string {
  // Check for Vite environment variable first
  try {
    // @ts-ignore - import.meta might not be available in all environments
    if (import.meta?.env?.VITE_API_BASE_URL !== undefined) {
      // @ts-ignore
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      console.log('[Utils] Using VITE_API_BASE_URL:', apiUrl || 'empty string (relative)');
      return apiUrl;
    }
  } catch (e) {
    // import.meta is not available
  }
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In production, use relative URLs
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      console.log('[Utils] Using relative URLs for production');
      return '';
    }
  }
  
  // In development or if unsure, use localhost
  console.log('[Utils] Using localhost:4000 for development');
  return 'http://localhost:4000';
}

export type ObjectValues<T> = T[keyof T];