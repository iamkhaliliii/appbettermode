import { db } from '../server/db'; // Adjusted path to point to server/db/index.ts
import { sites } from '../server/db/schema'; // Adjusted path
// import { eq, desc } from 'drizzle-orm'; // Import operators if needed for specific queries

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // TODO: Add authentication and filter sites by user if necessary
      // Example: const userSites = await db.select().from(sites).where(eq(sites.userId, currentUserId)).orderBy(desc(sites.createdAt));
      const allSites = await db.select().from(sites);
      res.status(200).json(allSites);
    } catch (error) {
      console.error('Error fetching sites from Supabase:', error);
      res.status(500).json({ message: 'Error fetching sites from database', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      let parsedBody;
      if (typeof req.body === 'string') {
        try {
          parsedBody = JSON.parse(req.body);
        } catch (parseError) {
          console.error('Error parsing request body string:', parseError);
          return res.status(400).json({ message: 'Invalid JSON in request body string' });
        }
      } else if (typeof req.body === 'object' && req.body !== null) {
        parsedBody = req.body;
      } else {
        console.error('Request body is not a string or a valid object.');
        return res.status(400).json({ message: 'Request body must be a JSON object or a JSON string.' });
      }

      const { name, subdomain } = parsedBody;

      if (!name) {
        return res.status(400).json({ message: 'Site name is required.'});
      }

      // Example: const userId = await getUserIdFromRequest(req); // Implement this based on your auth
      // if (!userId) {
      //   return res.status(401).json({ message: 'Unauthorized' });
      // }

      const newSiteArray = await db.insert(sites).values({
        name,
        subdomain: subdomain || null,
        // userId, // Uncomment if you have a userId field and are linking sites to users
        // status: 'active', // You can set a default status or let the DB default handle it
      }).returning();

      if (newSiteArray.length === 0) {
        console.error('Site creation did not return the new site.');
        return res.status(500).json({ message: 'Error creating site: No record returned after insert.' });
      }

      res.status(201).json(newSiteArray[0]);

    } catch (error) {
      console.error('Error creating site in Supabase:', error);
      // Check for unique constraint errors (e.g., for subdomain)
      // Supabase (PostgreSQL) error code for unique_violation is '23505'
      if (error.code === '23505') {
         // The error.constraint might give you the name of the violated constraint, e.g., "sites_subdomain_key"
         const field = error.constraint && error.constraint.includes('subdomain') ? 'subdomain' : 'unknown unique field';
         return res.status(409).json({ message: `A site with this ${field} already exists.`, field, detail: error.detail });
      }
      res.status(500).json({ message: 'Error creating site in database', error: error.message, code: error.code });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 