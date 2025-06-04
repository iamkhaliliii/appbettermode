import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
// Database connection
if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL environment variable not found. Using default development database URL.");
    process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:5432/bettermode_dev";
}
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);
async function runMigration() {
    try {
        console.log('Checking for existing tables and applying safe migrations...');
        // Drop the discussion_tags table if it exists
        await db.execute(sql `DROP TABLE IF EXISTS discussion_tags`);
        console.log('✓ Handled discussion_tags table');
        // Create content_status enum if it doesn't exist
        await db.execute(sql `
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
          CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
        END IF;
      END $$;
    `);
        console.log('✓ Handled content_status enum');
        // Check for existing tables and create only the new ones
        const existingTables = await db.execute(sql `
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);
        const tableNames = existingTables.rows.map(row => row.tablename);
        console.log('Existing tables:', tableNames);
        // Create media table if it doesn't exist
        if (!tableNames.includes('media')) {
            await db.execute(sql `
        CREATE TABLE media (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          file_name text NOT NULL,
          file_type text NOT NULL,
          file_size integer NOT NULL,
          url text NOT NULL,
          upload_by uuid REFERENCES users(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created media table');
        }
        // Create qa_answers and qa_questions tables with cms_ prefix
        if (!tableNames.includes('cms_qa_answers')) {
            await db.execute(sql `
        CREATE TABLE cms_qa_answers (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          question_id uuid NOT NULL,
          body text NOT NULL,
          author_id uuid REFERENCES users(id),
          upvotes integer DEFAULT 0,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_qa_answers table');
        }
        if (!tableNames.includes('cms_qa_questions')) {
            await db.execute(sql `
        CREATE TABLE cms_qa_questions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          question text NOT NULL,
          details text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          author_id uuid REFERENCES users(id),
          category_id uuid REFERENCES categories(id),
          accepted_answer_id uuid REFERENCES cms_qa_answers(id),
          upvotes integer DEFAULT 0,
          space_id uuid REFERENCES spaces(id),
          status content_status DEFAULT 'published',
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_qa_questions table');
            // Add foreign key from qa_answers to qa_questions
            await db.execute(sql `
        ALTER TABLE cms_qa_answers 
        ADD CONSTRAINT cms_qa_answers_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES cms_qa_questions(id) ON DELETE CASCADE
      `);
            console.log('✓ Added foreign key constraint to cms_qa_answers');
        }
        // Create knowledge_base_articles table
        if (!tableNames.includes('cms_knowledge_base_articles')) {
            await db.execute(sql `
        CREATE TABLE cms_knowledge_base_articles (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title text NOT NULL,
          body text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          author_id uuid REFERENCES users(id),
          category_id uuid REFERENCES categories(id),
          space_id uuid REFERENCES spaces(id),
          last_updated timestamp with time zone DEFAULT now(),
          status content_status DEFAULT 'published',
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_knowledge_base_articles table');
        }
        // Create related_articles table
        if (!tableNames.includes('cms_related_articles')) {
            await db.execute(sql `
        CREATE TABLE cms_related_articles (
          article_id uuid NOT NULL REFERENCES cms_knowledge_base_articles(id) ON DELETE CASCADE,
          related_article_id uuid NOT NULL REFERENCES cms_knowledge_base_articles(id) ON DELETE CASCADE,
          PRIMARY KEY (article_id, related_article_id)
        )
      `);
            console.log('✓ Created cms_related_articles table');
        }
        // Create content_tags table
        if (!tableNames.includes('cms_content_tags')) {
            await db.execute(sql `
        CREATE TABLE cms_content_tags (
          content_id uuid NOT NULL,
          tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
          content_type text NOT NULL,
          PRIMARY KEY (content_id, tag_id, content_type)
        )
      `);
            console.log('✓ Created cms_content_tags table');
        }
        // Create ideas table
        if (!tableNames.includes('cms_ideas')) {
            await db.execute(sql `
        CREATE TABLE cms_ideas (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          idea_title text NOT NULL,
          description text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          submitter_id uuid REFERENCES users(id),
          status text DEFAULT 'Under Review',
          votes integer DEFAULT 0,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_ideas table');
        }
        // Create changelogs table
        if (!tableNames.includes('cms_changelogs')) {
            await db.execute(sql `
        CREATE TABLE cms_changelogs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          update_title text NOT NULL,
          description text NOT NULL,
          date timestamp with time zone NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          author_id uuid REFERENCES users(id),
          feature_area text,
          version text,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_changelogs table');
        }
        // Create product_updates table
        if (!tableNames.includes('cms_product_updates')) {
            await db.execute(sql `
        CREATE TABLE cms_product_updates (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title text NOT NULL,
          description text NOT NULL,
          date timestamp with time zone NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          author_id uuid REFERENCES users(id),
          release_notes text,
          feature text,
          version text,
          media_id uuid REFERENCES media(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_product_updates table');
        }
        // Create roadmap_items table
        if (!tableNames.includes('cms_roadmap_items')) {
            await db.execute(sql `
        CREATE TABLE cms_roadmap_items (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          feature text NOT NULL,
          status text NOT NULL,
          description text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          timeline text,
          priority text,
          owner_id uuid REFERENCES users(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_roadmap_items table');
        }
        // Create announcements table
        if (!tableNames.includes('cms_announcements')) {
            await db.execute(sql `
        CREATE TABLE cms_announcements (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title text NOT NULL,
          message text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          audience text,
          date timestamp with time zone DEFAULT now(),
          call_to_action text,
          banner_image_id uuid REFERENCES media(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_announcements table');
        }
        // Create wiki_pages table
        if (!tableNames.includes('cms_wiki_pages')) {
            await db.execute(sql `
        CREATE TABLE cms_wiki_pages (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          page_title text NOT NULL,
          content text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          parent_page_id uuid,
          last_updated timestamp with time zone DEFAULT now(),
          editor_id uuid REFERENCES users(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            // Add self-reference for parent_page_id
            await db.execute(sql `
        ALTER TABLE cms_wiki_pages 
        ADD CONSTRAINT cms_wiki_pages_parent_page_id_fkey 
        FOREIGN KEY (parent_page_id) REFERENCES cms_wiki_pages(id)
      `);
            console.log('✓ Created cms_wiki_pages table');
        }
        // Create courses table
        if (!tableNames.includes('cms_courses')) {
            await db.execute(sql `
        CREATE TABLE cms_courses (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          course_title text NOT NULL,
          description text NOT NULL,
          start_date timestamp with time zone NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          instructor_id uuid REFERENCES users(id),
          duration text,
          materials text,
          enrollment_limit integer,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_courses table');
        }
        // Create jobs table
        if (!tableNames.includes('cms_jobs')) {
            await db.execute(sql `
        CREATE TABLE cms_jobs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          job_title text NOT NULL,
          description text NOT NULL,
          location text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          department text,
          type text,
          salary text,
          apply_link text,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_jobs table');
        }
        // Create speakers table
        if (!tableNames.includes('cms_speakers')) {
            await db.execute(sql `
        CREATE TABLE cms_speakers (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          name text NOT NULL,
          title text NOT NULL,
          bio text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          linkedin text,
          image_id uuid REFERENCES media(id),
          company text,
          topic text,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_speakers table');
        }
        // Create articles table
        if (!tableNames.includes('cms_articles')) {
            await db.execute(sql `
        CREATE TABLE cms_articles (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title text NOT NULL,
          body text NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          cover_image_id uuid REFERENCES media(id),
          author_id uuid REFERENCES users(id),
          category_id uuid REFERENCES categories(id),
          estimated_reading_time integer,
          space_id uuid REFERENCES spaces(id),
          status content_status DEFAULT 'published',
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_articles table');
        }
        // Create polls table
        if (!tableNames.includes('cms_polls')) {
            await db.execute(sql `
        CREATE TABLE cms_polls (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          question text NOT NULL,
          options jsonb NOT NULL,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          allow_multiple boolean DEFAULT false,
          deadline timestamp with time zone,
          voter_list jsonb DEFAULT '[]',
          anonymous boolean DEFAULT false,
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_polls table');
        }
        // Create file_library table
        if (!tableNames.includes('cms_file_library')) {
            await db.execute(sql `
        CREATE TABLE cms_file_library (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          file_name text NOT NULL,
          file_id uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          category_id uuid REFERENCES categories(id),
          description text,
          uploader_id uuid REFERENCES users(id),
          access_level text DEFAULT 'public',
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_file_library table');
        }
        // Create gallery_items table
        if (!tableNames.includes('cms_gallery_items')) {
            await db.execute(sql `
        CREATE TABLE cms_gallery_items (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title text NOT NULL,
          image_id uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          caption text,
          category_id uuid REFERENCES categories(id),
          author_id uuid REFERENCES users(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_gallery_items table');
        }
        // Create cms_events table
        if (!tableNames.includes('cms_events')) {
            await db.execute(sql `
        CREATE TABLE cms_events (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          event_title text NOT NULL,
          date_time timestamp with time zone NOT NULL,
          location text NOT NULL,
          description text,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          speaker_id uuid REFERENCES users(id),
          rsvp_limit integer,
          banner_image_id uuid REFERENCES media(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            console.log('✓ Created cms_events table');
        }
        // Create cms_discussions table (convert existing discussions if any)
        if (!tableNames.includes('cms_discussions')) {
            // Check if old discussions table exists
            if (tableNames.includes('discussions')) {
                // Create the new table
                await db.execute(sql `
          CREATE TABLE cms_discussions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            title text NOT NULL,
            body text NOT NULL,
            site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
            author_id uuid REFERENCES users(id),
            space_id uuid REFERENCES spaces(id),
            category_id uuid REFERENCES categories(id),
            featured_image_id uuid REFERENCES media(id),
            allow_replies boolean DEFAULT true,
            pinned boolean DEFAULT false,
            status content_status DEFAULT 'published',
            created_at timestamp with time zone DEFAULT now() NOT NULL,
            updated_at timestamp with time zone DEFAULT now()
          )
        `);
                // Copy data from old table to new one
                try {
                    await db.execute(sql `
            INSERT INTO cms_discussions (
              id, title, body, site_id, author_id, space_id, 
              category_id, featured_image_id, allow_replies, pinned, 
              status, created_at, updated_at
            )
            SELECT 
              id, title, 
              CASE WHEN body IS NOT NULL THEN body ELSE content END, 
              site_id, author_id, space_id, 
              category_id, featured_image_id, 
              COALESCE(allow_replies, true), 
              COALESCE(pinned, false), 
              COALESCE(status, 'published'::content_status),
              created_at, updated_at
            FROM discussions
          `);
                    console.log('✓ Migrated data from discussions to cms_discussions');
                }
                catch (err) {
                    console.error('Error migrating discussions data:', err);
                }
            }
            else {
                // Just create new table
                await db.execute(sql `
          CREATE TABLE cms_discussions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            title text NOT NULL,
            body text NOT NULL,
            site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
            author_id uuid REFERENCES users(id),
            space_id uuid REFERENCES spaces(id),
            category_id uuid REFERENCES categories(id),
            featured_image_id uuid REFERENCES media(id),
            allow_replies boolean DEFAULT true,
            pinned boolean DEFAULT false,
            status content_status DEFAULT 'published',
            created_at timestamp with time zone DEFAULT now() NOT NULL,
            updated_at timestamp with time zone DEFAULT now()
          )
        `);
            }
            console.log('✓ Created cms_discussions table');
        }
        // Convert events table to cms_events if it exists but cms_events doesn't
        if (tableNames.includes('events') && !tableNames.includes('cms_events')) {
            // Create the cms_events table if it doesn't exist
            await db.execute(sql `
        CREATE TABLE IF NOT EXISTS cms_events (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          event_title text NOT NULL,
          date_time timestamp with time zone NOT NULL,
          location text NOT NULL,
          description text,
          site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
          speaker_id uuid REFERENCES users(id),
          rsvp_limit integer,
          banner_image_id uuid REFERENCES media(id),
          space_id uuid REFERENCES spaces(id),
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now()
        )
      `);
            // Check what columns we have in events
            const columnsResult = await db.execute(sql `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'events'
      `);
            const eventColumns = columnsResult.rows.map(row => row.column_name);
            console.log('Events table columns:', eventColumns);
            // Copy data from events to cms_events
            try {
                let nameColumn = 'name';
                if (eventColumns.includes('title')) {
                    nameColumn = 'title';
                }
                else if (eventColumns.includes('event_title')) {
                    nameColumn = 'event_title';
                }
                let startTimeColumn = 'start_time';
                if (eventColumns.includes('date_time')) {
                    startTimeColumn = 'date_time';
                }
                await db.execute(sql `
          INSERT INTO cms_events (
            id, event_title, date_time, location, description, site_id, 
            speaker_id, rsvp_limit, banner_image_id, space_id, 
            created_at, updated_at
          )
          SELECT 
            id, ${sql.raw(nameColumn)}, ${sql.raw(startTimeColumn)}, 
            location, description, site_id,
            COALESCE(speaker_id, organizer_id), rsvp_limit, banner_image_id, space_id,
            created_at, updated_at
          FROM events
        `);
                console.log('✓ Migrated data from events to cms_events');
            }
            catch (err) {
                console.error('Error migrating events data:', err);
            }
        }
        console.log('Migration completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await pool.end();
    }
}
// runMigration(); // Commented out to prevent auto-execution
