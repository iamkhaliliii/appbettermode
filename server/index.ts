        // server/index.ts
import './env'; // First import to ensure environment variables are loaded
import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import apiRouter from './api/index';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// IMPORTANT: Mount the API router before Vite middleware
app.use(apiRouter);

// Add a test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test endpoint is working' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  console.error(err);
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
const port = process.env.PORT || 3030;
server.listen(port, () => {
  log(`Server running on port ${port}`);
  log(`API test endpoint at http://localhost:${port}/api/test`);
  log(`API health endpoint at http://localhost:${port}/api/v1/health`);
});

// Setup Vite in development or serve static files in production
// IMPORTANT: This should be the LAST middleware to avoid interfering with API routes
(async () => {
  try {
    if (app.get("env") === "development") {
      log("Setting up Vite middleware in development mode");
      await setupVite(app, server);
    } else {
      log("Serving static files in production mode");
      serveStatic(app);
    }
  } catch (err) {
    console.error("Error setting up Vite:", err);
  }
})();
