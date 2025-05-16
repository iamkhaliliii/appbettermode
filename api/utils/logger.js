"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// server/utils/logger.ts
exports.logger = {
    info: (...args) => {
        console.log('[INFO]', ...args);
    },
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
    debug: (...args) => {
        // Conditionally log debug messages based on NODE_ENV
        if (process.env.NODE_ENV === 'development') {
            console.debug('[DEBUG]', ...args);
        }
    },
};
