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
 * Script to populate cms_types table with initial data
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
    
    // Default CMS types
    const defaultTypes = [
      {
        name: 'discussion',
        description: 'Start conversations with community members',
        color: '#3b82f6',
        icon_name: 'message-circle',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'event',
        description: 'Organize events with scheduling and registrations',
        color: '#f97316',
        icon_name: 'calendar',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'qa',
        description: 'Enable community Q&A with voting system',
        color: '#6366f1',
        icon_name: 'help-circle',
        favorite: false,
        type: 'official',
        fields: []
      },
      {
        name: 'blog',
        description: 'Share updates and stories',
        color: '#0ea5e9',
        icon_name: 'feather',
        favorite: true,
        type: 'official',
        fields: []
      },
      {
        name: 'knowledge',
        description: 'Create a knowledge base for your community',
        color: '#14b8a6',
        icon_name: 'book-open',
        favorite: false,
        type: 'official',
        fields: []
      },
      {
        name: 'idea',
        description: 'Collect and vote on ideas from your community',
        color: '#8b5cf6',
        icon_name: 'lightbulb',
        favorite: false,
        type: 'official',
        fields: []
      },
      {
        name: 'job',
        description: 'Post job listings and career opportunities',
        color: '#6366f1',
        icon_name: 'briefcase',
        favorite: false,
        type: 'official',
        fields: []
      }
    ];
    
    // Check if there are any existing cms_types
    const existingTypes = await db`SELECT count(*) FROM cms_types`;
    const count = parseInt(existingTypes[0].count);
    
    if (count === 0) {
      console.log('No cms_types found, inserting default types...');
      
      // Insert default types
      for (const type of defaultTypes) {
        await db`
          INSERT INTO cms_types (name, description, color, icon_name, favorite, type, fields)
          VALUES (${type.name}, ${type.description}, ${type.color}, ${type.icon_name}, ${type.favorite}, ${type.type}, ${JSON.stringify(type.fields)})
        `;
        console.log(`✅ Added ${type.name} CMS type`);
      }
    } else {
      console.log(`Found ${count} existing cms_types`);
      
      // Update existing types to ensure icon_name is correct
      for (const type of defaultTypes) {
        const existingType = await db`SELECT * FROM cms_types WHERE name = ${type.name}`;
        
        if (existingType.length > 0) {
          await db`
            UPDATE cms_types
            SET 
              description = ${type.description},
              color = ${type.color},
              icon_name = ${type.icon_name},
              favorite = ${type.favorite}
            WHERE name = ${type.name}
          `;
          console.log(`✅ Updated ${type.name} CMS type`);
        } else {
          // Insert missing type
          await db`
            INSERT INTO cms_types (name, description, color, icon_name, favorite, type, fields)
            VALUES (${type.name}, ${type.description}, ${type.color}, ${type.icon_name}, ${type.favorite}, ${type.type}, ${JSON.stringify(type.fields)})
          `;
          console.log(`✅ Added ${type.name} CMS type`);
        }
      }
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