export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // const { rows } = await dbPool.query('SELECT * FROM sites WHERE userId = $1', [/* someUserId */]);
      // res.status(200).json(rows);

      // --- TEMPORARY MOCK DATA (Remove after DB connection is fixed) ---
      const mockSites = [
        { id: '1', name: 'Mock Site Alpha', subdomain: 'alpha', status: 'active', memberCount: 10, createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() },
        { id: '2', name: 'Mock Site Beta', subdomain: 'beta', status: 'pending', memberCount: 5, createdAt: new Date().toISOString(), lastActivityAt: null },
      ];
      res.status(200).json(mockSites);
      // --- END TEMPORARY MOCK DATA ---

    } catch (error) {
      console.error('Error fetching sites:', error);
      res.status(500).json({ message: 'Error fetching sites from database', error: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle site creation
    try {
      let name, subdomain;
      if (typeof req.body === 'string') {
        try {
          const parsedBody = JSON.parse(req.body);
          name = parsedBody.name;
          subdomain = parsedBody.subdomain;
        } catch (parseError) {
          console.error('Error parsing request body string:', parseError);
          return res.status(400).json({ message: 'Invalid JSON in request body string' });
        }
      } else if (typeof req.body === 'object' && req.body !== null) {
        name = req.body.name;
        subdomain = req.body.subdomain;
      } else {
        console.error('Request body is not a string or a valid object.');
        return res.status(400).json({ message: 'Request body must be a JSON object or a JSON string.' });
      }

      // Basic validation (you'd have more robust validation here, e.g., with Zod)
      if (!name) {
        return res.status(400).json({ message: 'Site name is required.'});
      }

      // Logic to insert into database...
      // const newSite = { id: '3', name, subdomain, status: 'active', memberCount: 0, createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() }; // Mock
      // res.status(201).json(newSite);
      
      // --- TEMPORARY MOCK DATA (Remove after DB connection is fixed) ---
       const newSiteEntry = { 
         id: String(Math.random().toString(36).substr(2, 9)), 
         name, 
         subdomain: subdomain || null, // Ensure subdomain can be null 
         status: 'active', 
         memberCount: 0, 
         createdAt: new Date().toISOString(), 
         lastActivityAt: new Date().toISOString() 
       };
       res.status(201).json(newSiteEntry);
      // --- END TEMPORARY MOCK DATA ---

    } catch (error) {
      console.error('Error creating site:', error);
      res.status(500).json({ message: 'Error creating site', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 