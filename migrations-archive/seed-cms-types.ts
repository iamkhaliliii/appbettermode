import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { cms_types } from '../server/db/schema'; // Adjust path if your schema is elsewhere
import 'dotenv/config'; // To load .env for DATABASE_URL

interface CmsTypeSeed {
  id: string; // Explicit UUID
  name: string; // This will be the slug-like identifier, e.g., "qa", "job-board"
  label: string; // This will be the display name, e.g., "Q&A", "Job Board"
  description?: string;
  icon_name?: string;
  color?: string;
  fields?: any[]; // Define more strictly if needed
  type?: 'official' | 'custom';
  favorite?: boolean;
}

// UUIDs from your log: 
// "5e4d4067-0b59-44e0-9c2a-167ac8d5c9cf", (Q&A)
// "89afe8a7-c1f3-48d6-b1e8-3850b359cb86", (Discussions)
// "1ca52109-2e34-4bc6-b1f0-fd5259736fd7", (Events)
// "c9167813-209e-42d4-b8a6-8f697d072394", (Blog)
// "f61ac2df-3192-4d12-98c4-20451b29f16e", (Ideas & Wishlist)
// "2e2697ef-8746-46f2-99bf-635f7124d6a7", (Knowledge Base)
// "eb463700-26b3-4cc8-8d9a-85d85b54e71b", (Job Board)
// "f9953c80-1be9-46c8-9ba4-0899e1fe0ecf"  (Changelog)

const officialCmsTypes: CmsTypeSeed[] = [
  {
    id: '5e4d4067-0b59-44e0-9c2a-167ac8d5c9cf',
    name: 'qa',
    label: 'Q&A',
    description: 'Ask questions and get answers from the community.',
    icon_name: 'help-circle',
    color: 'violet',
    type: 'official',
    favorite: true,
    fields: [
      { key: 'question_title', label: 'Question Title', type: 'text', placeholder: 'What is your question?' },
      { key: 'question_details', label: 'Details', type: 'richtext', placeholder: 'Provide more details...' }
    ]
  },
  {
    id: '89afe8a7-c1f3-48d6-b1e8-3850b359cb86',
    name: 'discussion',
    label: 'Discussions',
    description: 'Start or join conversations on various topics.',
    icon_name: 'message-square',
    color: 'blue',
    type: 'official',
    favorite: true,
    fields: [
      { key: 'discussion_title', label: 'Title', type: 'text', placeholder: 'Discussion Title' },
      { key: 'discussion_body', label: 'Body', type: 'richtext', placeholder: 'Start the discussion...' }
    ]
  },
  {
    id: '1ca52109-2e34-4bc6-b1f0-fd5259736fd7',
    name: 'event',
    label: 'Events',
    description: 'Discover and RSVP to upcoming community events.',
    icon_name: 'calendar',
    color: 'emerald',
    type: 'official',
    favorite: true,
    fields: [
      { key: 'event_title', label: 'Event Title', type: 'text' },
      { key: 'event_date', label: 'Date & Time', type: 'datetime' },
      { key: 'event_location', label: 'Location', type: 'text' },
      { key: 'event_description', label: 'Description', type: 'richtext' }
    ]
  },
  {
    id: 'c9167813-209e-42d4-b8a6-8f697d072394',
    name: 'blog',
    label: 'Blog',
    description: 'Read and publish articles and blog posts.',
    icon_name: 'file-text',
    color: 'purple',
    type: 'official',
    fields: [
      { key: 'article_title', label: 'Title', type: 'text' },
      { key: 'article_body', label: 'Content', type: 'richtext' },
      { key: 'cover_image_url', label: 'Cover Image URL', type: 'url' }
    ]
  },
  {
    id: 'f61ac2df-3192-4d12-98c4-20451b29f16e',
    name: 'ideas-wishlist',
    label: 'Ideas & Wishlist',
    description: 'Share ideas and vote on features for the community or product.',
    icon_name: 'star',
    color: 'amber',
    type: 'official',
    fields: [
      { key: 'idea_title', label: 'Idea/Wish', type: 'text' },
      { key: 'idea_description', label: 'Description', type: 'richtext' }
    ]
  },
  {
    id: '2e2697ef-8746-46f2-99bf-635f7124d6a7',
    name: 'knowledge-base',
    label: 'Knowledge Base',
    description: 'Find helpful articles and documentation.',
    icon_name: 'book-open',
    color: 'sky',
    type: 'official',
    fields: [
      { key: 'kb_title', label: 'Article Title', type: 'text' },
      { key: 'kb_content', label: 'Content', type: 'richtext' }
    ]
  },
  {
    id: 'eb463700-26b3-4cc8-8d9a-85d85b54e71b',
    name: 'job-board',
    label: 'Job Board',
    description: 'Post and find job opportunities within the community.',
    icon_name: 'briefcase',
    color: 'teal',
    type: 'official',
    fields: [
      { key: 'job_title', label: 'Job Title', type: 'text' },
      { key: 'job_description', label: 'Description', type: 'richtext' },
      { key: 'job_location', label: 'Location', type: 'text' },
      { key: 'apply_url', label: 'Apply URL', type: 'url' }
    ]
  },
  {
    id: 'f9953c80-1be9-46c8-9ba4-0899e1fe0ecf',
    name: 'changelog',
    label: 'Changelog',
    description: 'Track updates and changes to the product or community.',
    icon_name: 'layout',
    color: 'indigo',
    type: 'official',
    fields: [
      { key: 'update_title', label: 'Update Title', type: 'text' },
      { key: 'update_description', label: 'Description', type: 'richtext' },
      { key: 'update_date', label: 'Date', type: 'date' }
    ]
  },
];

async function seedCmsTypes() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required for seeding.");
  }
  console.log(`Connecting to database for seeding: ${databaseUrl.split('@')[0]}...`); // Mask credentials

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  try {
    console.log('Deleting existing data from cms_types table...');
    await db.delete(cms_types);
    console.log('Existing data deleted.');

    console.log('Inserting new official CMS types with predefined IDs...');
    for (const cmsTypeData of officialCmsTypes) {
      await db.insert(cms_types).values({
        id: cmsTypeData.id, // Using the predefined ID
        name: cmsTypeData.name,
        label: cmsTypeData.label,
        description: cmsTypeData.description,
        icon_name: cmsTypeData.icon_name,
        color: cmsTypeData.color,
        fields: cmsTypeData.fields || [],
        type: cmsTypeData.type || 'official',
        favorite: cmsTypeData.favorite || false,
      });
      console.log(`Inserted: ${cmsTypeData.label} (ID: ${cmsTypeData.id}, name: ${cmsTypeData.name})`);
    }
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding cms_types:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed after seeding.');
  }
}

seedCmsTypes(); 