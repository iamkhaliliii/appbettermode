import { Client } from 'pg';
import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from 'drizzle-orm';
// Connect directly using the Client for better error handling
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});
async function updateTables() {
    try {
        await client.connect();
        console.log('Connected to database');
        // Check existing tables
        const tablesResult = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        const tableNames = tablesResult.rows.map(row => row.tablename);
        console.log('Existing tables:', tableNames);
        // 1. Check and drop the media table
        if (tableNames.includes('media')) {
            // First, check for any dependencies on the media table
            const checkDeps = await client.query(`
        SELECT
          tc.table_schema, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'media';
      `);
            if (checkDeps.rows.length > 0) {
                console.log('The following tables have dependencies on the media table:');
                checkDeps.rows.forEach(row => {
                    console.log(`- ${row.table_name}.${row.column_name} → media.${row.foreign_column_name}`);
                });
                // Remove these foreign key constraints
                for (const row of checkDeps.rows) {
                    try {
                        // Get the constraint name
                        const constraintResult = await client.query(`
              SELECT constraint_name 
              FROM information_schema.table_constraints
              WHERE table_schema = $1 AND table_name = $2 AND constraint_type = 'FOREIGN KEY'
              AND constraint_name IN (
                SELECT constraint_name 
                FROM information_schema.constraint_column_usage 
                WHERE table_name = 'media'
              )
            `, [row.table_schema, row.table_name]);
                        if (constraintResult.rows.length > 0) {
                            const constraintName = constraintResult.rows[0].constraint_name;
                            await client.query(`
                ALTER TABLE "${row.table_name}" DROP CONSTRAINT "${constraintName}";
              `);
                            console.log(`✓ Removed dependency: ${row.table_name}.${row.column_name} → media.${row.foreign_column_name}`);
                        }
                    }
                    catch (err) {
                        console.error(`Error removing dependency for ${row.table_name}:`, err);
                    }
                }
            }
            // Now drop the media table
            try {
                await client.query('DROP TABLE IF EXISTS "media" CASCADE');
                console.log('✓ Removed media table');
            }
            catch (err) {
                console.error('Error removing media table:', err);
            }
        }
        else {
            console.log('Media table not found, skipping removal');
        }
        // 2. Update content_tags table structure
        // Get the structure of the existing tags table
        if (tableNames.includes('tags')) {
            try {
                const tagsColumnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'tags'
          ORDER BY ordinal_position
        `);
                console.log('Current tags table structure:');
                tagsColumnsResult.rows.forEach(row => {
                    console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
                });
                // Check if any changes are needed
                const missingColumns = [];
                // Check for color column
                const hasColorColumn = tagsColumnsResult.rows.some(row => row.column_name === 'color');
                if (!hasColorColumn) {
                    missingColumns.push({
                        name: 'color',
                        type: 'text',
                        default: null
                    });
                }
                // Check for icon column
                const hasIconColumn = tagsColumnsResult.rows.some(row => row.column_name === 'icon');
                if (!hasIconColumn) {
                    missingColumns.push({
                        name: 'icon',
                        type: 'text',
                        default: null
                    });
                }
                // Add any missing columns
                for (const column of missingColumns) {
                    try {
                        await client.query(`
              ALTER TABLE "tags" 
              ADD COLUMN "${column.name}" ${column.type} ${column.default ? `DEFAULT '${column.default}'` : ''};
            `);
                        console.log(`✓ Added ${column.name} column to tags table`);
                    }
                    catch (err) {
                        console.error(`Error adding ${column.name} column to tags table:`, err);
                    }
                }
                // Rename cms_content_tags to content_tags if it exists
                if (tableNames.includes('cms_content_tags')) {
                    // Check if regular content_tags already exists
                    if (tableNames.includes('content_tags')) {
                        console.log('Both cms_content_tags and content_tags exist. Merging data...');
                        // Generate a temporary table name
                        const tempTableName = 'content_tags_new';
                        // Create temp table with the same structure as cms_content_tags
                        await client.query(`
              CREATE TABLE "${tempTableName}" (
                content_id uuid NOT NULL,
                tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                content_type text NOT NULL,
                PRIMARY KEY (content_id, tag_id, content_type)
              );
            `);
                        // Copy data from cms_content_tags to new table
                        await client.query(`
              INSERT INTO "${tempTableName}" (content_id, tag_id, content_type)
              SELECT content_id, tag_id, content_type FROM "cms_content_tags"
              ON CONFLICT DO NOTHING;
            `);
                        // Drop the old tables
                        await client.query('DROP TABLE IF EXISTS "content_tags" CASCADE');
                        await client.query('DROP TABLE IF EXISTS "cms_content_tags" CASCADE');
                        // Rename temp table to content_tags
                        await client.query(`
              ALTER TABLE "${tempTableName}" RENAME TO "content_tags";
            `);
                        console.log('✓ Successfully merged and renamed cms_content_tags to content_tags');
                    }
                    else {
                        // Just rename the table
                        await client.query('ALTER TABLE "cms_content_tags" RENAME TO "content_tags"');
                        console.log('✓ Renamed cms_content_tags to content_tags');
                    }
                }
            }
            catch (err) {
                console.error('Error updating tags table:', err);
            }
        }
        else {
            console.log('Tags table not found, cannot update structure');
        }
        console.log('Update completed!');
    }
    catch (error) {
        console.error('Update failed:', error);
    }
    finally {
        await client.end();
    }
}
// Run the updates
updateTables().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
    console.error('No database connection string found in environment variables.');
    process.exit(1);
}
const migrateDatabase = async () => {
    console.log('Starting database migration process...');
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        console.log('1. Creating posts table and updating enum...');
        // First, update the content_status enum to include new statuses
        await db.execute(sql `
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'scheduled';
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'pending_review';
    `);
        // Create the posts table
        await db.execute(sql `
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status content_status DEFAULT 'draft',
        author_id UUID REFERENCES users(id),
        space_id UUID REFERENCES spaces(id),
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        cms_type TEXT NOT NULL,
        site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
        locked BOOLEAN DEFAULT false,
        hidden BOOLEAN DEFAULT false
      )
    `);
        // Create the post_tags junction table
        await db.execute(sql `
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);
        console.log('2. Migrating data from CMS tables to posts table...');
        // Migrate Discussion data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, body, status, author_id, space_id, created_at, 
          updated_at, 'discussion', site_id
        FROM cms_discussions
        RETURNING id, title
      )
      UPDATE cms_discussions d
      SET post_id = p.id
      FROM inserted_posts p
      WHERE d.title = p.title
    `);
        // Migrate QA Questions data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          question, details, status, author_id, space_id, created_at, 
          updated_at, 'qa_question', site_id
        FROM cms_qa_questions
        RETURNING id, question
      )
      UPDATE cms_qa_questions q
      SET post_id = p.id
      FROM inserted_posts p
      WHERE q.question = p.title
    `);
        // Migrate Knowledge Base Articles data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, body, status, author_id, space_id, created_at, 
          updated_at, 'kb_article', site_id
        FROM cms_knowledge_base_articles
        RETURNING id, title
      )
      UPDATE cms_knowledge_base_articles a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);
        // Migrate Ideas data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          idea_title, description, submitter_id, space_id, created_at, 
          updated_at, 'idea', site_id
        FROM cms_ideas
        RETURNING id, title
      )
      UPDATE cms_ideas i
      SET post_id = p.id
      FROM inserted_posts p
      WHERE i.idea_title = p.title
    `);
        // Migrate Changelogs data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          update_title, description, author_id, space_id, created_at, 
          updated_at, 'changelog', site_id
        FROM cms_changelogs
        RETURNING id, title
      )
      UPDATE cms_changelogs c
      SET post_id = p.id
      FROM inserted_posts p
      WHERE c.update_title = p.title
    `);
        // Migrate Product Updates data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, description, author_id, space_id, created_at, 
          updated_at, 'product_update', site_id
        FROM cms_product_updates
        RETURNING id, title
      )
      UPDATE cms_product_updates pu
      SET post_id = p.id
      FROM inserted_posts p
      WHERE pu.title = p.title
    `);
        // Migrate Roadmap Items data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          feature, description, owner_id, space_id, created_at, 
          updated_at, 'roadmap_item', site_id
        FROM cms_roadmap_items
        RETURNING id, title
      )
      UPDATE cms_roadmap_items ri
      SET post_id = p.id
      FROM inserted_posts p
      WHERE ri.feature = p.title
    `);
        // Migrate Announcements data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, message, space_id, created_at, 
          updated_at, 'announcement', site_id
        FROM cms_announcements
        RETURNING id, title
      )
      UPDATE cms_announcements a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);
        // Migrate Wiki Pages data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          page_title, content, editor_id, space_id, created_at, 
          updated_at, 'wiki_page', site_id
        FROM cms_wiki_pages
        RETURNING id, title
      )
      UPDATE cms_wiki_pages wp
      SET post_id = p.id
      FROM inserted_posts p
      WHERE wp.page_title = p.title
    `);
        // Migrate Events data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          event_title, description, space_id, created_at, 
          updated_at, 'event', site_id
        FROM cms_events
        RETURNING id, title
      )
      UPDATE cms_events e
      SET post_id = p.id
      FROM inserted_posts p
      WHERE e.event_title = p.title
    `);
        // Migrate Courses data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          course_title, description, space_id, created_at, 
          updated_at, 'course', site_id
        FROM cms_courses
        RETURNING id, title
      )
      UPDATE cms_courses c
      SET post_id = p.id
      FROM inserted_posts p
      WHERE c.course_title = p.title
    `);
        // Migrate Jobs data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          job_title, description, space_id, created_at, 
          updated_at, 'job', site_id
        FROM cms_jobs
        RETURNING id, title
      )
      UPDATE cms_jobs j
      SET post_id = p.id
      FROM inserted_posts p
      WHERE j.job_title = p.title
    `);
        // Migrate Speakers data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          name, bio, space_id, created_at, 
          updated_at, 'speaker', site_id
        FROM cms_speakers
        RETURNING id, title
      )
      UPDATE cms_speakers s
      SET post_id = p.id
      FROM inserted_posts p
      WHERE s.name = p.title
    `);
        // Migrate Articles data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id, status
        )
        SELECT 
          title, body, author_id, space_id, created_at, 
          updated_at, 'article', site_id, status
        FROM cms_articles
        RETURNING id, title
      )
      UPDATE cms_articles a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);
        // Migrate Polls data to posts (using question as title)
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          question, question, space_id, created_at, 
          updated_at, 'poll', site_id
        FROM cms_polls
        RETURNING id, title
      )
      UPDATE cms_polls p
      SET post_id = p.id
      FROM inserted_posts p
      WHERE p.question = p.title
    `);
        // Migrate Gallery Items data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, COALESCE(caption, title), author_id, space_id, created_at, 
          updated_at, 'gallery_item', site_id
        FROM cms_gallery_items
        RETURNING id, title
      )
      UPDATE cms_gallery_items gi
      SET post_id = p.id
      FROM inserted_posts p
      WHERE gi.title = p.title
    `);
        // Migrate File Library data to posts
        await db.execute(sql `
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          file_name, COALESCE(description, file_name), space_id, created_at, 
          updated_at, 'file_library', site_id
        FROM cms_file_library
        RETURNING id, title
      )
      UPDATE cms_file_library fl
      SET post_id = p.id
      FROM inserted_posts p
      WHERE fl.file_name = p.title
    `);
        // Migrate tags to post_tags
        await db.execute(sql `
      INSERT INTO post_tags (post_id, tag_id)
      SELECT p.id, t.id
      FROM posts p
      JOIN tags t ON t.content_id = p.id AND t.content_type = p.cms_type
      WHERE t.content_id IS NOT NULL AND t.content_type IS NOT NULL
    `);
        console.log('3. Updating CMS table schemas to use post references...');
        // Now alter the CMS tables to remove the duplicate fields and add post_id foreign key
        await db.execute(sql `
      ALTER TABLE cms_discussions 
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_qa_questions
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_knowledge_base_articles
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_ideas
      DROP COLUMN IF EXISTS idea_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS submitter_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_changelogs
      DROP COLUMN IF EXISTS update_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_product_updates
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_roadmap_items
      DROP COLUMN IF EXISTS feature,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS owner_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_announcements
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS message,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_wiki_pages
      DROP COLUMN IF EXISTS page_title,
      DROP COLUMN IF EXISTS content,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_events
      DROP COLUMN IF EXISTS event_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_courses
      DROP COLUMN IF EXISTS course_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_jobs
      DROP COLUMN IF EXISTS job_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_speakers
      DROP COLUMN IF EXISTS bio,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_articles
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_polls
      DROP COLUMN IF EXISTS question,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_gallery_items
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        await db.execute(sql `
      ALTER TABLE cms_file_library
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);
        console.log('Database migration completed successfully');
    }
    catch (error) {
        console.error('Database migration failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
};
// If this file is run directly (not imported), execute the migration
// if (import.meta.url === `file://${process.argv[1]}`) {
//     migrateDatabase() // Commented out to prevent auto-execution
//         .then(() => {
//         console.log('Migration script completed');
//         process.exit(0);
//     })
//         .catch((error) => {
//         console.error('Migration script failed:', error);
//         process.exit(1);
//     });
// }
export { migrateDatabase };
