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
 * Migration script to create cms_types table and add initial content types
 */
async function migrateDatabase() {
  // Ensure connectionString is defined
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const queryClient = postgres(connectionString, { max: 1 });
  
  try {
    // Create db instance
    const db = queryClient;
    console.log('Connected to the database');

    // Step 1: Create cms_types table
    console.log('Creating cms_types table...');
    await db`
      CREATE TABLE IF NOT EXISTS cms_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        fields JSONB NOT NULL DEFAULT '[]'::jsonb
      );
    `;
    console.log('✅ Created cms_types table');

    // Step 2: Insert default content types
    console.log('Adding default content types...');
    
    // Define content types with their fields
    const contentTypes = [
      {
        name: 'discussion',
        fields: JSON.stringify([
          { key: 'allow_replies', label: 'Allow Replies', type: 'select', options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ] },
          { key: 'pinned', label: 'Pinned', type: 'select', options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ] }
        ])
      },
      {
        name: 'event',
        fields: JSON.stringify([
          { key: 'date_time', label: 'Event Date', type: 'date' },
          { key: 'location', label: 'Location', type: 'text', placeholder: 'Event location' },
          { key: 'rsvp_limit', label: 'RSVP Limit', type: 'text', placeholder: 'Maximum number of attendees' }
        ])
      },
      {
        name: 'knowledge',
        fields: JSON.stringify([
          { key: 'last_updated', label: 'Last Updated', type: 'date' }
        ])
      },
      {
        name: 'kb_article',
        fields: JSON.stringify([
          { key: 'last_updated', label: 'Last Updated', type: 'date' }
        ])
      },
      {
        name: 'wishlist',
        fields: JSON.stringify([
          { key: 'status', label: 'Status', type: 'select', options: [
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Planned', label: 'Planned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Closed', label: 'Closed' }
          ] }
        ])
      },
      {
        name: 'idea',
        fields: JSON.stringify([
          { key: 'status', label: 'Status', type: 'select', options: [
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Planned', label: 'Planned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Closed', label: 'Closed' }
          ] }
        ])
      },
      {
        name: 'changelog',
        fields: JSON.stringify([
          { key: 'date', label: 'Release Date', type: 'date' },
          { key: 'version', label: 'Version', type: 'text', placeholder: '1.0.0' },
          { key: 'feature_area', label: 'Feature Area', type: 'text', placeholder: 'UI, Backend, etc.' }
        ])
      },
      {
        name: 'roadmap',
        fields: JSON.stringify([
          { key: 'status', label: 'Status', type: 'select', options: [
            { value: 'Planned', label: 'Planned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' }
          ] },
          { key: 'timeline', label: 'Timeline', type: 'text', placeholder: 'Q4 2023' },
          { key: 'priority', label: 'Priority', type: 'select', options: [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' }
          ] }
        ])
      },
      {
        name: 'announcement',
        fields: JSON.stringify([
          { key: 'date', label: 'Announcement Date', type: 'date' },
          { key: 'audience', label: 'Audience', type: 'text', placeholder: 'All Users, Admins, etc.' },
          { key: 'call_to_action', label: 'Call To Action', type: 'text', placeholder: 'Action URL or instruction' }
        ])
      },
      {
        name: 'job',
        fields: JSON.stringify([
          { key: 'location', label: 'Location', type: 'text', placeholder: 'Remote, New York, etc.' },
          { key: 'department', label: 'Department', type: 'text', placeholder: 'Engineering, Sales, etc.' },
          { key: 'type', label: 'Job Type', type: 'select', options: [
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' }
          ] },
          { key: 'salary', label: 'Salary Range', type: 'text', placeholder: '$80,000 - $120,000' },
          { key: 'apply_link', label: 'Application Link', type: 'text', placeholder: 'https://...' }
        ])
      },
      {
        name: 'jobs',
        fields: JSON.stringify([
          { key: 'location', label: 'Location', type: 'text', placeholder: 'Remote, New York, etc.' },
          { key: 'department', label: 'Department', type: 'text', placeholder: 'Engineering, Sales, etc.' },
          { key: 'type', label: 'Job Type', type: 'select', options: [
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' }
          ] },
          { key: 'salary', label: 'Salary Range', type: 'text', placeholder: '$80,000 - $120,000' },
          { key: 'apply_link', label: 'Application Link', type: 'text', placeholder: 'https://...' }
        ])
      },
      {
        name: 'article',
        fields: JSON.stringify([
          { key: 'estimated_reading_time', label: 'Estimated Reading Time (minutes)', type: 'text', placeholder: '5' }
        ])
      },
      {
        name: 'poll',
        fields: JSON.stringify([
          { key: 'options', label: 'Poll Options (comma separated)', type: 'textarea', placeholder: 'Option 1, Option 2, Option 3' },
          { key: 'allow_multiple', label: 'Allow Multiple Selections', type: 'select', options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ] },
          { key: 'anonymous', label: 'Anonymous Voting', type: 'select', options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ] },
          { key: 'deadline', label: 'Voting Deadline', type: 'date' }
        ])
      },
      {
        name: 'qa',
        fields: JSON.stringify([
          { key: 'question', label: 'Question', type: 'text', placeholder: 'Enter your question' },
          { key: 'details', label: 'Details', type: 'textarea', placeholder: 'Provide more details about your question' }
        ])
      },
      {
        name: 'qa_question',
        fields: JSON.stringify([
          { key: 'question', label: 'Question', type: 'text', placeholder: 'Enter your question' },
          { key: 'details', label: 'Details', type: 'textarea', placeholder: 'Provide more details about your question' }
        ])
      },
      {
        name: 'blog',
        fields: JSON.stringify([
          { key: 'estimated_reading_time', label: 'Estimated Reading Time (minutes)', type: 'text', placeholder: '5' },
          { key: 'featured', label: 'Featured Post', type: 'select', options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ] }
        ])
      }
    ];
    
    // Insert content types
    for (const type of contentTypes) {
      // Check if content type already exists
      const existingType = await db`
        SELECT id FROM cms_types WHERE name = ${type.name}
      `;
      
      if (existingType.length === 0) {
        await db`
          INSERT INTO cms_types (name, fields)
          VALUES (${type.name}, ${type.fields}::jsonb)
        `;
        console.log(`✅ Added content type: ${type.name}`);
      } else {
        console.log(`Content type "${type.name}" already exists, skipping`);
      }
    }

    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Execute the migration
migrateDatabase()
  .then(() => {
    console.log('Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 