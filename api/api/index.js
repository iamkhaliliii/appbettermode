"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./sites/index"));
const apiRouter = express_1.default.Router();
// API version prefix
const API_PREFIX = '/api/v1';
// Register all API routes
apiRouter.use(`${API_PREFIX}/sites`, index_1.default);
// API health check endpoint
apiRouter.get(`${API_PREFIX}/health`, (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});
// Handle 404 for API routes
apiRouter.use(`${API_PREFIX}/*`, (_req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});
exports.default = apiRouter;
