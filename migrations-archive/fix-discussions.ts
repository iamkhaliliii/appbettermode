import { db } from './index.js';
import { eq } from 'drizzle-orm';
import { posts, spaces } from './schema.js';

async function updatePostSpace() {
  try {
    // Get all discussion posts
    const discussionPosts = await db.select().from(posts).where(eq(posts.cms_type, 'discussion'));
    console.log('Found discussion posts:', discussionPosts);
    
    // Get the discussions space
    const discussionsSpace = await db.select().from(spaces).where(eq(spaces.slug, 'discussions'));
    console.log('Discussions space:', discussionsSpace);
    
    if (discussionPosts.length > 0 && discussionsSpace.length > 0) {
      // Update the post space_id
      const result = await db.update(posts)
        .set({ space_id: discussionsSpace[0].id })
        .where(eq(posts.id, discussionPosts[0].id))
        .returning();
      
      console.log('Updated post:', result);
      console.log('Success! Post has been moved to the discussions space!');
    } else {
      console.log('No posts or spaces found to update');
    }
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// Run the function when this script is executed directly
updatePostSpace(); 