import { Post } from './types';

// Sample data for fallback use when API fails
export const MOCK_DATA: Post[] = [
  {
    id: "dOUwwAq3Lc9vmA",
    title: "Level Up Your Community",
    status: "Schedule",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Discussions",
      color: "#6366f1"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Discussion",
    tags: ["Discussion", "new", "me_too"],
    locked: false
  },
  {
    id: "9fXYxHmWxwvcf15",
    title: "Community Building Strategies",
    status: "Pending review",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Wishlist",
      color: "#eab308"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Wishlist",
    tags: ["Discussion", "new", "me_too"],
    locked: true
  },
  {
    id: "qbJgwG9RtWsJW5d",
    title: "Engaging Your Online Community",
    status: "Pending review",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Discussions",
      color: "#6366f1"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Discussion",
    tags: ["Discussion", "new", "me_too"],
    locked: false
  },
  {
    id: "5tRgT7Y9oP4Z1qA",
    title: "Modern Community Examples",
    status: "Published",
    author: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Articles",
      color: "#2563eb"
    },
    publishedAt: "Jan 14, 2025",
    cmsModel: "Article",
    tags: ["community", "featured"],
    locked: false
  },
  {
    id: "u5TrF8Y3iO2P1aS",
    title: "Building Authentic Relationships",
    status: "Published",
    author: {
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Articles",
      color: "#2563eb"
    },
    publishedAt: "Jan 15, 2025",
    cmsModel: "Article",
    tags: ["community", "featured"],
    locked: false
  },
  {
    id: "v6UgH9Z4jP3Q2bD",
    title: "Content Moderation Best Practices",
    status: "Draft",
    author: {
      name: "Mark Wilson",
      avatar: "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Guidelines",
      color: "#10b981"
    },
    publishedAt: "Jan 16, 2025",
    cmsModel: "Guide",
    tags: ["moderation", "guidelines"],
    locked: false
  },
  {
    id: "w7ViJ1A5kR4S3cF",
    title: "Growing Your User Base",
    status: "Schedule",
    author: {
      name: "Sarah Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Marketing",
      color: "#ef4444"
    },
    publishedAt: "Jan 17, 2025",
    cmsModel: "Strategy",
    tags: ["marketing", "engagement"],
    locked: false
  },
  {
    id: "x8WjK2B6lS5T4dG",
    title: "Community Newsletter Guidelines",
    status: "Published",
    author: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Newsletter",
      color: "#9333ea"
    },
    publishedAt: "Jan 18, 2025",
    cmsModel: "Template",
    tags: ["newsletter", "communication"],
    locked: true
  },
  {
    id: "y9XkL3C7mT6U5eH",
    title: "Onboarding New Community Members",
    status: "Published",
    author: {
      name: "Robert Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Members",
      color: "#f59e0b"
    },
    publishedAt: "Jan 19, 2025",
    cmsModel: "Process",
    tags: ["onboarding", "members"],
    locked: false
  },
  {
    id: "z1YlM4D8nU7V6fI",
    title: "Product Feedback Collection Strategy",
    status: "Draft",
    author: {
      name: "Amanda White",
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Product",
      color: "#06b6d4"
    },
    publishedAt: "Jan 20, 2025",
    cmsModel: "Strategy",
    tags: ["feedback", "product"],
    locked: false
  },
]; 