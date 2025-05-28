// Define content data type
export interface Content {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Schedule" | "Pending review";
  author: {
    name: string;
    avatar: string;
  };
  space: {
    name: string;
    color: string;
  };
  publishedAt: string;
  cmsModel: string;
  tags: string[];
  locked: boolean;
}

// Keep Post as an alias for backward compatibility
export type Post = Content;

// Add a type for space data from API
export interface SpaceData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  site_id: string;
  visibility?: string;
  cms_type?: string;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Status counts interface
export interface StatusCounts {
  total: number;
  published: number;
  scheduled: number;
  draft: number;
  pending: number;
} 