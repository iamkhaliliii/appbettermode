"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./env"); // Ensures .env is loaded
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./api/index"));
const db_1 = require("./db");
const logger_1 = require("./utils/logger");
// DO NOT ADD: import { env } from './env'; // This was incorrect
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3030; // Use process.env
const IS_DEV = process.env.NODE_ENV === 'development';
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use('/api/v1', index_1.default);
// Create an HTTP server instance. This is needed for Vite dev server integration.
const server = http_1.default.createServer(app);
if (IS_DEV) {
    // Dynamically import Vite dev middleware setup only in development
    // Use 'as any' to prevent TSC from deeply analyzing the dev-only ./vite module during production build
    Promise.resolve().then(() => __importStar(require('./vite'))).then((viteModule) => {
        if (viteModule.setupVite && typeof viteModule.setupVite === 'function') {
            viteModule.setupVite(app, server); // Pass both app and the http.Server instance
            if (viteModule.log && typeof viteModule.log === 'function') {
                viteModule.log('Vite Dev Middleware configured.');
            }
            else {
                logger_1.logger.info('Vite Dev Middleware configured (custom log not found).');
            }
        }
        else {
            logger_1.logger.error('setupVite function not found in ./vite module or ./vite failed to load correctly.');
        }
    }).catch(error => {
        logger_1.logger.error('Failed to load or setup Vite Dev Middleware:', error);
    });
}
else {
    // Production mode: Serve static files from the client build output directory
    // __dirname in CommonJS refers to the directory of the current file.
    // After build, server/index.js will be in 'api/', so __dirname is 'api/'.
    // To get to 'dist/public' from 'api/', we go up one level then into 'dist/public'.
    const clientBuildPath = path_1.default.join(__dirname, '../dist/public');
    app.use(express_1.default.static(clientBuildPath));
    // SPA fallback: For any GET request not matching API or a static file, serve index.html
    app.get('*', (req, res) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html') && !req.path.includes('.')) {
            res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
        }
        else if (!req.path.startsWith('/api')) {
            // For other non-API GET requests (e.g., direct access to a file not found by static, or bad paths)
            // send index.html to let client router handle or show its 404.
            res.status(404).sendFile(path_1.default.join(clientBuildPath, 'index.html'));
        }
        // API routes not matched by apiRoutes will be handled by Express default 404.
    });
}
// Use the http.Server instance to listen, as Vite Dev Server might attach to it.
server.listen(PORT, () => {
    logger_1.logger.info(`Server listening on port ${PORT}`);
    const dbInitialized = db_1.db ? true : false;
    logger_1.logger.info(`Database object initialized: ${dbInitialized}`);
    if (IS_DEV) {
        logger_1.logger.info(`Development server running at http://localhost:${PORT}`);
    }
});
exports.default = app; // Export app for Vercel (serverless functions might use the Express app)
