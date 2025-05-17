# AI Agent Guide for App-bettermode

## Table of Contents
- [Project Architecture Overview](#project-architecture-overview)
- [Source of Truth Rules](#source-of-truth-rules)
- [Project Structure](#project-structure)
- [UI Component System](#ui-component-system)
- [State Management](#state-management)
- [Form Handling](#form-handling)
- [Database Schema and Drizzle ORM](#database-schema-and-drizzle-orm)
- [React Query for API Data](#react-query-for-api-data)
- [Authentication and Authorization](#authentication-and-authorization)
- [Testing](#testing)
- [Practical Examples](#practical-examples)
- [Frontend Layout Structure](#frontend-layout-structure)
- [Routing and Page Structure](#routing-and-page-structure)
- [Adding New API Endpoints](#adding-new-api-endpoints)
- [Error Handling](#error-handling)
- [Validation with Zod](#validation-with-zod)
- [Building and Deployment](#building-and-deployment)
- [Project-Specific Patterns and Conventions](#project-specific-patterns-and-conventions)
- [Debugging Tips](#debugging-tips)
- [Common Gotchas](#common-gotchas)

This guide is designed to help AI agents quickly understand the structure, patterns, and correct ways to edit and extend the App-bettermode codebase.

## Project Architecture Overview

App-bettermode is a multi-site content management and community platform with:

1. **Frontend**: React (Vite) application in `client/`
2. **Backend**: TypeScript API in `server/` 
3. **Compiled API**: JavaScript files in `api/` (compiled from `server/`)

The project uses a unified API architecture that works in both local development (Express) and production (Vercel serverless functions).

## Source of Truth Rules

- **NEVER** edit files in the `api/` directory; these are compiled outputs
- **ALWAYS** edit TypeScript files in the `server/` directory
- After editing `server/` files, build with `npm run build` to update `api/`

## Project Structure

```
App-bettermode/
├── api/                    # Compiled JS (DO NOT EDIT)
├── client/                 # Frontend React app
│   └── src/
│       ├── components/     # React components
│       │   ├── dashboard/  # Dashboard UI components
│       │   ├── layout/     # Layout components
│       │   │   └── secondary-sidebar/ # Context-specific navigation
│       │   └── ui/         # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Helper functions
│       └── pages/          # Page components
│           ├── dashboard/  # Dashboard pages
│           │   └── site/   # Site-specific dashboard pages
│           │       └── [siteSD]/ # Dynamic site pages using site subdomain
│           ├── site/       # Public site pages
│           │   └── [siteId]/ # Dynamic site pages using site ID
│           └── sites/      # Sites listing/management pages
├── server/                 # Backend API source (EDIT HERE)
│   ├── db/                 # Database models and connection
│   ├── routes/             # API route handlers
│   └── utils/              # Utility functions
└── docs/                   # Documentation
```

## UI Component System

The project uses a custom UI component library based on [shadcn/ui](https://ui.shadcn.com/) - a collection of reusable components built on Tailwind CSS and Radix UI primitives.

### Component Types

- **Primitives**: Button, Input, Select, Checkbox
- **Composite Components**: Card, Dialog, Dropdown, Table
- **Layout Components**: Accordion, Tabs, Drawer
- **Feedback Components**: Toast, Alert, Progress

### Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here...</p>
        <Button variant="default" size="sm">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## State Management

The application uses React's Context API for state management across components.

### Context Structure

Key contexts include:

1. **Authentication Context** - Manages user session and permissions
   ```tsx
   // Example from authContext.tsx
   export const AuthContext = createContext<AuthContextType | undefined>(undefined);
   
   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     
     // Authentication logic
     
     return (
       <AuthContext.Provider value={{ user, login, logout, isLoading }}>
         {children}
       </AuthContext.Provider>
     );
   }
   
   // Usage in components
   export function useAuth() {
     const context = useContext(AuthContext);
     if (context === undefined) {
       throw new Error("useAuth must be used within an AuthProvider");
     }
     return context;
   }
   ```

2. **Site Context** - Manages current site information
   ```tsx
   export const SiteContext = createContext<SiteContextType | undefined>(undefined);
   
   export function SiteProvider({ children, siteId }: SiteProviderProps) {
     const [site, setSite] = useState<Site | null>(null);
     
     // Site data fetching logic
     
     return (
       <SiteContext.Provider value={{ site, updateSite }}>
         {children}
       </SiteContext.Provider>
     );
   }
   ```

### Global State vs. Component State

- Use **Context API** for cross-component shared state (user, site, theme)
- Use **useState** for component-local state
- Use **React Query** for server state (API data)

## Form Handling

The application uses a combination of native form handling and React Hook Form for complex forms.

### Basic Form Example

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SimpleForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
```

### React Hook Form Example

For complex forms with validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

function ComplexForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    // Submit validated data
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Database Schema and Drizzle ORM

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL for database operations. The schema is defined in `server/db/schema.ts`.

### Key Database Tables

The main data model includes:

- **sites** - Communities or websites
- **users** - User accounts
- **memberships** - User-site relationships with roles
- **Content tables**: `categories`, `spaces`, `discussions`, `tags`, `events`

### Common Database Operations

```typescript
import { db } from '../db/index.js';
import { sites, users, memberships } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// Query examples
async function databaseExamples() {
  // SELECT: Find a site by subdomain
  const site = await db.query.sites.findFirst({
    where: eq(sites.subdomain, "example"),
    with: { owner: true } // Include related data
  });
  
  // INSERT: Create a new site
  const newSite = await db.insert(sites).values({
    name: "New Site",
    subdomain: "newsite",
    owner_id: userId
  }).returning();
  
  // UPDATE: Modify a site
  await db.update(sites)
    .set({ name: "Updated Name" })
    .where(eq(sites.id, siteId));
    
  // DELETE: Remove a site
  await db.delete(sites).where(eq(sites.id, siteId));
  
  // TRANSACTION: Multiple operations in one transaction
  await db.transaction(async (tx) => {
    const site = await tx.insert(sites).values({...}).returning();
    await tx.insert(memberships).values({
      userId,
      siteId: site[0].id,
      role: 'admin'
    });
  });
}
```

## React Query for API Data

The application uses [TanStack Query](https://tanstack.com/query) (React Query) for fetching, caching, and updating server state.

### Basic Query Example

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSites, createSite } from '@/lib/api';

function SitesList() {
  // Fetch data with caching and loading states
  const { data, isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(site => (
        <li key={site.id}>{site.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation Example

```tsx
function CreateSiteForm() {
  const queryClient = useQueryClient();
  
  // Create mutation for adding a site
  const mutation = useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      // Invalidate and refetch the sites list
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
  
  const handleSubmit = (data) => {
    mutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Query Configuration Best Practices

1. **Consistent Query Keys**: Use structured keys for related data
   ```tsx
   // For a list of sites
   queryKey: ['sites']
   
   // For a specific site
   queryKey: ['sites', siteId]
   
   // For site-specific data
   queryKey: ['sites', siteId, 'members']
   ```

2. **Automatic Refetching**: Configure when queries should refetch
   ```tsx
   useQuery({
     queryKey: ['sites'],
     queryFn: fetchSites,
     refetchOnWindowFocus: true,
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Error Handling**: Handle errors consistently
   ```tsx
   useQuery({
     queryKey: ['sites'],
     queryFn: fetchSites,
     onError: (error) => {
       // Log or display error
     },
   });
   ```

## Authentication and Authorization

The application implements a comprehensive authentication and authorization system:

### Authentication Flow

1. **Login Process**:
   ```tsx
   // client/src/lib/api.ts
   export async function login(credentials) {
     const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(credentials),
     });
     
     if (!response.ok) {
       throw new Error('Login failed');
     }
     
     const data = await response.json();
     // Store token in localStorage or secure cookie
     localStorage.setItem('token', data.token);
     return data.user;
   }
   ```

2. **Auth Context**:
   ```tsx
   // Use the auth context to access the current user
   const { user, isAuthenticated, login, logout } = useAuth();
   
   // Conditional rendering based on auth state
   if (!isAuthenticated) {
     return <LoginForm onLogin={login} />;
   }
   ```

### Role-Based Authorization

1. **Permission Checking**:
   ```tsx
   // Check user role for a specific site
   function canManageSite(user, siteId) {
     const membership = user.memberships.find(m => m.siteId === siteId);
     return membership && ['admin', 'editor'].includes(membership.role);
   }
   
   // Component with permission check
   function AdminAction({ siteId }) {
     const { user } = useAuth();
     
     if (!canManageSite(user, siteId)) {
       return null; // Don't render for unauthorized users
     }
     
     return <Button>Admin Action</Button>;
   }
   ```

2. **Route Protection**:
   ```tsx
   // Protected route component
   function ProtectedRoute({ children, requiredRole }) {
     const { user, isLoading } = useAuth();
     const { siteId } = useParams();
     
     if (isLoading) return <Loading />;
     
     const hasPermission = user && checkPermission(user, siteId, requiredRole);
     
     if (!hasPermission) {
       return <Navigate to="/login" />;
     }
     
     return children;
   }
   ```

## Testing

The project uses Jest and React Testing Library for testing components and API endpoints.

### Component Testing

```tsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { SiteCard } from './SiteCard';

describe('SiteCard', () => {
  const mockSite = { id: '1', name: 'Test Site', subdomain: 'test' };
  
  test('renders site information', () => {
    render(<SiteCard site={mockSite} />);
    
    expect(screen.getByText('Test Site')).toBeInTheDocument();
    expect(screen.getByText('test.example.com')).toBeInTheDocument();
  });
  
  test('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<SiteCard site={mockSite} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(handleEdit).toHaveBeenCalledWith(mockSite.id);
  });
});
```

### API Testing

```typescript
// Example API test
import request from 'supertest';
import { app } from '../server';
import { db } from '../db';

describe('Sites API', () => {
  beforeEach(async () => {
    // Set up test database
    await db.delete(sites).execute();
  });
  
  test('GET /api/v1/sites returns list of sites', async () => {
    // Insert test data
    await db.insert(sites).values([
      { name: 'Site 1', subdomain: 'site1' },
      { name: 'Site 2', subdomain: 'site2' }
    ]);
    
    const response = await request(app).get('/api/v1/sites');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Site 1');
  });
  
  test('POST /api/v1/sites creates a new site', async () => {
    const siteData = { name: 'New Site', subdomain: 'newsite' };
    
    const response = await request(app)
      .post('/api/v1/sites')
      .send(siteData)
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(siteData.name);
    
    // Verify in database
    const sites = await db.query.sites.findMany();
    expect(sites.length).toBe(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run specific tests
npm run test -- -t "SiteCard"
```

## Practical Examples

### Example 1: Creating a New Page with API Integration

Let's build a "Site Analytics" feature, including both frontend and backend components:

1. **Backend API Endpoint**:

```typescript
// server/routes/analytics.ts
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { handleApiError } from '../utils/errors.js';
import { sites, discussions, users } from '../db/schema.js';
import { eq, count, sql } from 'drizzle-orm';

export const analyticsRouter = Router();

// GET /api/v1/sites/:siteId/analytics
analyticsRouter.get('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Validate siteId
    if (!siteId) {
      return res.status(400).json({ message: 'Site ID is required' });
    }
    
    // Get site stats
    const memberCount = await db.select({ count: count() })
      .from(users)
      .innerJoin(memberships, eq(memberships.userId, users.id))
      .where(eq(memberships.siteId, siteId))
      .execute();
      
    const discussionCount = await db.select({ count: count() })
      .from(discussions)
      .where(eq(discussions.site_id, siteId))
      .execute();
    
    // Get monthly activity (simplified example)
    const monthlyActivity = await db.execute(sql`
      SELECT date_trunc('month', created_at) as month, COUNT(*) as count
      FROM discussions
      WHERE site_id = ${siteId}
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `);
    
    return res.json({
      stats: {
        memberCount: memberCount[0]?.count || 0,
        discussionCount: discussionCount[0]?.count || 0,
      },
      monthlyActivity
    });
  } catch (error) {
    return handleApiError(error, res);
  }
});

// Register in server/index.ts
app.use('/api/v1/sites/:siteId/analytics', analyticsRouter);
```

2. **Frontend API Client**:

```typescript
// client/src/lib/api.ts
export async function fetchSiteAnalytics(siteId) {
  const response = await fetch(`${API_BASE}/api/v1/sites/${siteId}/analytics`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  
  return response.json();
}
```

3. **Analytics Page Component**:

```tsx
// client/src/pages/dashboard/site/[siteSD]/analytics/index.tsx
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteAnalytics } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';

export default function SiteAnalyticsPage() {
  const { siteSD } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['sites', siteSD, 'analytics'],
    queryFn: () => fetchSiteAnalytics(siteSD)
  });
  
  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;
  
  const { stats, monthlyActivity } = data;
  
  return (
    <DashboardLayout 
      siteName="Site Analytics" 
      currentSiteIdentifier={siteSD}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Site Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memberCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.discussionCount}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="line"
              data={{
                labels: monthlyActivity.map(item => new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
                datasets: [{
                  label: 'Discussions',
                  data: monthlyActivity.map(item => item.count),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

4. **Add to Navigation**:

```tsx
// client/src/components/layout/secondary-sidebar/DashboardSidebar.tsx
// Add a new nav item for Analytics
const navItems = [
  // ...existing items
  {
    name: "Analytics",
    href: APP_ROUTES.DASHBOARD_SITE.ANALYTICS(currentSiteIdentifier),
    icon: BarChart, // Import from lucide-react
  },
];
```

### Example 2: Creating a New UI Component

Let's create a reusable `StatCard` component for analytics:

```tsx
// client/src/components/ui/stat-card.tsx
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium flex items-center",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

Usage:
```tsx
<StatCard
  title="Total Members"
  value={stats.memberCount}
  description="Active community members"
  trend={{ value: 12, isPositive: true }}
/>
```

## Frontend Layout Structure

The application uses a multi-level layout system for dashboard pages:

### Dashboard Layout

The `DashboardLayout` component (`client/src/components/layout/dashboard-layout.tsx`) is the main layout wrapper for admin pages and contains:

1. **Header**: Top navigation bar with site switcher, profile menu and global actions
2. **Main Sidebar**: Left vertical navigation with collapsed icons for top-level navigation
3. **Secondary Sidebar**: Context-specific navigation based on the current route
4. **Main Content Area**: Dynamic content rendered via `children` prop

```typescript
// Basic usage of DashboardLayout
<DashboardLayout 
  siteName="My Site" 
  currentSiteIdentifier="site-123"
  navItems={[...]} // Optional navigation items
>
  <PageContent />
</DashboardLayout>
```

### Secondary Sidebar System

The secondary sidebar (`client/src/components/layout/secondary-sidebar/index.tsx`) is a context-aware navigation component that:

1. **Detects current route** to determine which sidebar to display
2. **Loads the appropriate sidebar component** based on the section (content, people, settings, etc.)
3. **Passes the site identifier** to enable proper link generation in child components

Each section of the dashboard has its own sidebar component:

```
secondary-sidebar/
├── AppearanceSidebar.tsx   # Design and theme settings
├── AppStoreSidebar.tsx     # App extensions marketplace
├── BillingSidebar.tsx      # Payment and subscription management 
├── ContentSidebar.tsx      # Posts, pages, and media management
├── DashboardSidebar.tsx    # Main dashboard overview
├── DesignStudioSidebar.tsx # Advanced design tools
├── PeopleSidebar.tsx       # Users, members and staff management
├── ReportsSidebar.tsx      # Analytics and reports
├── SettingsSidebar.tsx     # Site configuration
├── SiteConfigSidebar.tsx   # Technical site settings
└── index.tsx               # Main controller component
```

### Navigation Item Structure

Navigation items use a standardized structure defined in `secondary-sidebar/types.ts`:

```typescript
interface NavItem {
  name: string;          // Display name of the navigation item
  href: string;          // Link destination
  icon?: LucideIcon;     // Optional icon component (from Lucide icons)
  active?: boolean;      // If the item is currently active
  children?: NavItem[];  // Nested navigation items
  disabled?: boolean;    // If the item should be disabled
  expanded?: boolean;    // If the item's children should be shown
}
```

When extending the navigation, always follow this structure for consistency.

## Routing and Page Structure

1. **Dashboard ([siteSD])**: Admin dashboard for managing a specific site
   - Path: `/dashboard/site/[siteSD]/*`
   - `[siteSD]` is the site's subdomain parameter
   - Contains sections like appearance, content, people, settings, etc.

2. **Public Site ([siteId])**: Front-facing site for visitors
   - Path: `/site/[siteId]/*`
   - `[siteId]` is the site's unique identifier
   - Used for public-facing pages

3. **Sites Management**: For managing multiple sites
   - Path: `/sites/*`
   - Used for listing, creating, and managing sites

## Adding New API Endpoints

To add a new API endpoint that works both locally and on Vercel:

1. **Create the TypeScript handler** in `server/routes/` or `server/v1/`

```typescript
// server/routes/example.ts
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { handleApiError } from '../utils/errors.js';

export const exampleRouter = Router();

exampleRouter.get('/', async (req, res) => {
  try {
    // Your logic here
    const data = { example: 'data' };
    return res.json(data);
  } catch (error) {
    return handleApiError(error, res);
  }
});
```

2. **Register the router** in `server/index.ts`:

```typescript
import { exampleRouter } from './routes/example.js';

// Add this line where other routes are registered
app.use('/api/v1/examples', exampleRouter);
```

3. **Create the Vercel serverless function** in `server/` that matches the path structure:

```typescript
// server/api/v1/examples.ts
import { exampleRouter } from '../../routes/example.js';
import { createVercelHandler } from '../../utils/vercel.js';

export default createVercelHandler(exampleRouter);
```

4. **Build to generate files in `api/`**:

```bash
npm run build
```

## Error Handling

Always use the standardized error handling:

```typescript
try {
  // Your code here
} catch (error) {
  return handleApiError(error, res);
}
```

## Validation with Zod

Use Zod for input validation:

```typescript
import { z } from 'zod';

const createSiteSchema = z.object({
  name: z.string().min(3).max(50),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/)
});

// In your route handler
const result = createSiteSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({
    message: 'Invalid input',
    errors: { fieldErrors: result.error.flatten().fieldErrors }
  });
}

// Use validated data
const { name, subdomain } = result.data;
```

## Building and Deployment

- **Development**: `npm run dev` (starts local Express server)
- **Build**: `npm run build` (compiles TypeScript to JavaScript in `api/`)
- **Production**: Vercel deploys from the `api/` directory

## Project-Specific Patterns and Conventions

1. **File naming**: Use kebab-case for filenames
2. **Component naming**: Use PascalCase for React components
3. **API routes**: Use plural nouns for resource endpoints
4. **Environment detection**: Use `isVercel()` from `utils/environment.ts` to detect runtime
5. **TypeScript**: Use strict typing throughout the project

## Debugging Tips

- Local server logs show in the terminal
- Vercel function logs appear in the Vercel dashboard
- Use the logger utility instead of console.log:

```typescript
import { logger } from '../utils/logger.js';

logger.info('This is an info message');
logger.error('This is an error', error);
```

## Common Gotchas

1. **Path mapping**: Be careful with import paths, use relative imports
2. **API endpoints**: All API endpoints should begin with `/api/v1/`
3. **Server/Client code**: Don't import server code in client code
4. **Environment variables**: Defined differently for client and server
5. **TypeScript paths**: `@/` shorthand is only available in client code