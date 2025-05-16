// server/utils/logger.ts
export const logger = {
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
