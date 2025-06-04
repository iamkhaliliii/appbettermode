import './env.js'; // Ensures .env is loaded
import express, { type Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { db } from './db/index.js';
import { logger } from './utils/logger.js';
import { IS_DEV, IS_VERCEL, SERVER_PORT } from './utils/environment.js';

const app = express();
const PORT = SERVER_PORT;

// CORS middleware - apply to all routes
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
  // Cannot use credentials:true with origin:'*'
  credentials: false,
  maxAge: 86400 // 24 hours
}));

app.use(express.json({
  // Increase size limit for file uploads if needed
  limit: '10mb',
  // Handle JSON parse errors gracefully
  verify: (req: any, res: any, buf: Buffer) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      res.status(400).json({ message: 'Invalid JSON in request body' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1', apiRoutes);

// Create an HTTP server instance
const server = http.createServer(app);

if (IS_DEV) {
  // Development mode: Set up Vite middleware
  import('./vite.js').then((viteModule: any) => {
    if (viteModule.setupVite && typeof viteModule.setupVite === 'function') {
      viteModule.setupVite(app, server);
      logger.info('Vite Dev Middleware configured.');
    } else {
      logger.error('setupVite function not found or failed to load correctly.');
    }
  }).catch(error => {
    logger.error('Failed to load or setup Vite Dev Middleware:', error);
  });
} else {
  // Production mode: Serve static files
  const clientBuildPath = path.join(__dirname, '../dist/public');
  app.use(express.static(clientBuildPath, {
    maxAge: '1y',
    setHeaders: (res, path) => {
      // Set proper cache headers
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // SPA fallback for client-side routing
  app.get('*', (req, res) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html') && !req.path.includes('.')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else if (!req.path.startsWith('/api')) {
      res.status(404).sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Don't start the server when running in Vercel environment
if (!IS_VERCEL) {
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Database initialized: ${db ? true : false}`);
    if (IS_DEV) {
      logger.info(`Development server running at http://localhost:${PORT}`);
    }
  });
}

export default app; 