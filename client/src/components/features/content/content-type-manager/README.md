# Content Type Manager

This directory contains components for managing content types in a site - adding new content types like Discussion, Event, Q&A, etc. to a site.

> **Note**: This is different from the content creation/composer modals. This is for site administrators to add new content type capabilities to their sites.

## Components

### ContentTypeManagerModal
Main modal for adding new content types to a site. Features:
- **Content Type Selection**: Choose from available CMS types 
- **Space Configuration**: Set up the new space with name, slug, permissions
- **Two-Step Process**: Select content type → Configure space settings
- **API Integration**: Fetches available CMS types and creates spaces via API

### Supporting Components
- **SelectContentTypeStep**: First step showing available content types with previews
- **ConfigureSpaceStep**: Second step for configuring space settings and permissions
- **ContentTypeCard**: Individual content type cards with preview
- **ContentTypePreviews**: Preview components for different content types

### Utilities
- **useSpaceConfig**: Hook for managing space configuration state
- **animation-variants**: Framer Motion animation configurations

## Usage

```tsx
import { AddContentDialog } from './content-type-manager';

function AdminPanel() {
  const [showAddContent, setShowAddContent] = useState(false);

  return (
    <AddContentDialog
      open={showAddContent}
      onOpenChange={setShowAddContent}
    />
  );
}
```

## Content Types Supported

The system supports various official CMS types:
- **Discussion**: Community discussions and conversations
- **Event**: Events with scheduling and registration
- **Q&A**: Question and answer format with voting
- **Blog**: Article and blog post content
- **Wishlist**: Feature requests and ideas
- **Job Board**: Job listings and applications
- **Knowledge Base**: Documentation and help articles
- **And more**: Extensible system for new content types

## API Integration

The modal integrates with the following API endpoints:
- `GET /api/v1/cms-types/favorites` - Get favorite content types
- `GET /api/v1/cms-types/category/official` - Get official content types
- `GET /api/v1/cms-types/name/{name}` - Look up content type by name
- `POST /api/v1/sites/{siteId}/spaces` - Create new space
- `GET /api/v1/sites/{siteId}` - Get site information

## File Structure

```
content-type-manager/
├── ContentTypeManagerModal.tsx    # Main modal component
├── SelectContentTypeStep.tsx      # Step 1: Content type selection
├── ConfigureSpaceStep.tsx         # Step 2: Space configuration  
├── ContentTypeCard.tsx            # Content type display card
├── ContentTypePreviews.tsx        # Preview components for each type
├── use-space-config.tsx           # Space configuration state hook
├── animation-variants.ts          # Animation configurations
├── index.tsx                      # Exports
└── README.md                      # This documentation
```

## Migration Notes

This was previously located at `add-content-dialog/` but was renamed to better reflect its purpose:
- **Old**: `add-content-dialog` (confusing - sounds like adding posts)
- **New**: `content-type-manager` (clear - managing site content types)

The main export is still available as `AddContentDialog` for backward compatibility. 