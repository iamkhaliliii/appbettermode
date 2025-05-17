// server/utils/logger.ts
export const logger = {
    info: (...args: any[]) => {
      console.log('[INFO]', ...args);
    },
    warn: (...args: any[]) => {
      console.warn('[WARN]', ...args);
    },
    error: (...args: any[]) => {
      console.error('[ERROR]', ...args);
    },
    debug: (...args: any[]) => {
      // Conditionally log debug messages based on NODE_ENV
      if (process.env.NODE_ENV === 'development') {
        console.debug('[DEBUG]', ...args);
      }
    },
  };