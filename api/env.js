"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(process.cwd(), '.env');
// console.log(`[env.ts] Attempting to load .env from: ${envPath}`); // Optional: for deep debugging
const result = dotenv_1.default.config({ path: envPath });
if (result.error) {
    console.error('[env.ts] Error loading .env file:', result.error);
    // throw result.error; // Optionally re-throw, or handle as needed
}
// console.log('[env.ts] .env file loaded. DATABASE_URL:', process.env.DATABASE_URL); // Optional: for deep debugging
