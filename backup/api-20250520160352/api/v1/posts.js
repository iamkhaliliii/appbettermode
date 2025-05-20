import postsRouter from '../../routes/posts.js';
import { createVercelHandler } from '../../utils/vercel.js';
export default createVercelHandler(postsRouter);
