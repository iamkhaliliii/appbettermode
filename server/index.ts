        // server/index.ts
        import './env'; // یا 'shared/env' اگر فایل را آنجا گذاشتید - این خط باید اولین خط اجرایی باشد
        // Debug: Check if DATABASE_URL is loaded (can be removed later)
console.log("(server/index.ts) DATABASE_URL after env import:", process.env.DATABASE_URL);
console.log("(server/index.ts) CWD:", process.cwd());

import dotenv from 'dotenv';
import path from 'path'; // Import path module

// Explicitly load .env from the project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Debug: Check if DATABASE_URL is loaded and where .env was expected
console.log(`Trying to load .env from: ${envPath}`);
console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);
console.log("CWD for .env loading:", process.cwd());

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 3030
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 3030;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
