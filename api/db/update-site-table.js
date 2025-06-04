import { Client } from 'pg';
import 'dotenv/config';
// Connect directly using the Client for better error handling
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});
async function updateSiteTable() {
    try {
        await client.connect();
        console.log('Connected to database');
        // 1. Create site_plan enum type if it doesn't exist
        try {
            await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'site_plan') THEN
            CREATE TYPE site_plan AS ENUM ('lite', 'pro');
          END IF;
        END $$;
      `);
            console.log('✓ Created site_plan enum type (if it didn\'t exist)');
        }
        catch (err) {
            console.error('Error creating site_plan enum:', err);
        }
        // 2. Check if sites table has state column
        const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sites'
    `);
        const columns = columnsResult.rows.map(row => row.column_name);
        console.log('Current sites table columns:', columns);
        // 3. Add plan column if it doesn't exist
        if (!columns.includes('plan')) {
            try {
                await client.query(`
          ALTER TABLE "sites"
          ADD COLUMN "plan" site_plan DEFAULT 'lite';
        `);
                console.log('✓ Added plan column to sites table');
            }
            catch (err) {
                console.error('Error adding plan column:', err);
            }
        }
        else {
            console.log('Plan column already exists in sites table');
        }
        // 4. Remove state column if it exists
        if (columns.includes('state')) {
            try {
                // First, copy any useful data from state to status if needed
                await client.query(`
          UPDATE "sites"
          SET "status" = CASE 
                           WHEN "state" = 'pending' THEN 'inactive'
                           WHEN "state" = 'active' THEN 'active'
                           ELSE "status"
                         END
          WHERE "status" IS NULL OR "status" = '';
        `);
                console.log('✓ Migrated relevant data from state to status');
                // Then drop the state column
                await client.query(`
          ALTER TABLE "sites"
          DROP COLUMN "state";
        `);
                console.log('✓ Removed state column from sites table');
            }
            catch (err) {
                console.error('Error removing state column:', err);
            }
        }
        else {
            console.log('State column does not exist in sites table');
        }
        // 5. Find code files that use site.state and might need to be updated
        try {
            const result = await client.query(`
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE column_name = 'state'
        ORDER BY table_name;
      `);
            if (result.rows.length > 0) {
                console.log('\nOther tables that still have "state" columns:');
                result.rows.forEach(row => {
                    console.log(`- ${row.table_name}.${row.column_name}`);
                });
                console.log('\nYou may need to update code that references these columns.');
            }
            else {
                console.log('\nNo other tables with "state" columns found.');
            }
        }
        catch (err) {
            console.error('Error checking for other state columns:', err);
        }
        console.log('\nSites table update completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await client.end();
    }
}
// Run the migration
// updateSiteTable().catch(err => { // Commented out to prevent auto-execution
//   console.error('Fatal error:', err);
//   process.exit(1);
// }); 
