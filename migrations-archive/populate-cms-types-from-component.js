import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

/**
 * Script to populate cms_types table with content types from the React component
 */
async function populateCmsTypes() {
  // Ensure connectionString is defined
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const queryClient = postgres(connectionString, { max: 1 });
  
  try {
    // Create db instance
    const db = queryClient;
    console.log('Connected to the database');
    
    // Content types from React component
    const contentTypes = [
      {
        name: 'Event',
        description: 'Organize events with scheduling and registrations.',
        icon_name: 'Calendar',
        color: 'emerald',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'date_time',
            label: 'Event Date',
            type: 'date'
          },
          {
            key: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Event location'
          },
          {
            key: 'rsvp_limit',
            label: 'RSVP Limit',
            type: 'text',
            placeholder: 'Maximum number of attendees'
          }
        ]
      },
      {
        name: 'Discussion',
        description: 'Start conversations with community members.',
        icon_name: 'MessageSquare',
        color: 'blue',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'allow_replies',
            label: 'Allow Replies',
            type: 'select',
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ]
          },
          {
            key: 'pinned',
            label: 'Pinned',
            type: 'select',
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ]
          }
        ]
      },
      {
        name: 'Q&A',
        description: 'Enable community Q&A with voting system.',
        icon_name: 'HelpCircle',
        color: 'violet',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'question',
            label: 'Question',
            type: 'text',
            placeholder: 'Enter your question'
          },
          {
            key: 'details',
            label: 'Details',
            type: 'textarea',
            placeholder: 'Provide more details about your question'
          }
        ]
      },
      {
        name: 'Wishlist',
        description: 'Collect and prioritize community ideas.',
        icon_name: 'Star',
        color: 'amber',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Planned', label: 'Planned' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Closed', label: 'Closed' }
            ]
          }
        ]
      },
      {
        name: 'KnowledgeBase',
        description: 'Build a searchable help center.',
        icon_name: 'BookOpen',
        color: 'rose',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'last_updated',
            label: 'Last Updated',
            type: 'date'
          }
        ]
      },
      {
        name: 'Job List',
        description: 'Post and manage job openings.',
        icon_name: 'Briefcase',
        color: 'cyan',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Remote, New York, etc.'
          },
          {
            key: 'department',
            label: 'Department',
            type: 'text',
            placeholder: 'Engineering, Sales, etc.'
          },
          {
            key: 'type',
            label: 'Job Type',
            type: 'select',
            options: [
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' }
            ]
          },
          {
            key: 'salary',
            label: 'Salary Range',
            type: 'text',
            placeholder: '$80,000 - $120,000'
          },
          {
            key: 'apply_link',
            label: 'Application Link',
            type: 'text',
            placeholder: 'https://...'
          }
        ]
      },
      {
        name: 'Blog',
        description: 'Share updates and stories.',
        icon_name: 'FileText',
        color: 'purple',
        favorite: true,
        type: 'official',
        fields: [
          {
            key: 'estimated_reading_time',
            label: 'Estimated Reading Time (minutes)',
            type: 'text',
            placeholder: '5'
          },
          {
            key: 'featured',
            label: 'Featured Post',
            type: 'select',
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ]
          }
        ]
      }
    ];
    
    // Delete existing cms_types first
    const deleteResult = await db`DELETE FROM cms_types`;
    console.log(`Deleted ${deleteResult.count} existing records from cms_types table`);
    
    // Insert content types
    for (const type of contentTypes) {
      await db`
        INSERT INTO cms_types (name, description, color, icon_name, favorite, type, fields)
        VALUES (${type.name}, ${type.description}, ${type.color}, ${type.icon_name}, ${type.favorite}, ${type.type}, ${JSON.stringify(type.fields)})
      `;
      console.log(`✅ Added ${type.name} CMS type`);
    }
    
    // Also add lowercase versions matching the Lucide icons in client code
    const lowercaseVersions = [
      {
        name: 'discussion', 
        description: 'Start conversations with community members', 
        icon_name: 'message-circle',
        color: 'blue',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'event', 
        description: 'Organize events with scheduling and registrations', 
        icon_name: 'calendar',
        color: 'emerald',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'qa', 
        description: 'Enable community Q&A with voting system', 
        icon_name: 'help-circle',
        color: 'violet',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'blog', 
        description: 'Share updates and stories', 
        icon_name: 'file-text',
        color: 'purple',
        favorite: true,
        type: 'official',
        fields: []
      }
    ];
    
    // Insert lowercase versions
    for (const type of lowercaseVersions) {
      await db`
        INSERT INTO cms_types (name, description, color, icon_name, favorite, type, fields)
        VALUES (${type.name}, ${type.description}, ${type.color}, ${type.icon_name}, ${type.favorite}, ${type.type}, ${JSON.stringify(type.fields)})
      `;
      console.log(`✅ Added ${type.name} CMS type (lowercase version)`);
    }
    
    console.log('CMS types population completed successfully');
    return true;
  } catch (error) {
    console.error('CMS types population failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Execute the population
populateCmsTypes()
  .then(() => {
    console.log('CMS types population script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('CMS types population script failed:', error);
    process.exit(1);
  }); 