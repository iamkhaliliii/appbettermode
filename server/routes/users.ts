import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Query the user from the database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        // Don't include any fields that don't exist in the database
        createdAt: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    logger.info(`Fetched user: ${user.id}`);
    return res.status(200).json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Error fetching user from database' });
  }
});

export { router as usersRouter }; 