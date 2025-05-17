import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for API requests based on environment
 */
export function getApiBaseUrl(): string {
  // In production (Vercel), use relative URLs to avoid CORS issues
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In development, use the dev server
  return 'http://localhost:4000';
}
