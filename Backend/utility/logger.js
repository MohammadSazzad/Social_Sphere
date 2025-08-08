/**
 * Production-ready logging utility for Social Sphere
 * Provides environment-aware logging with proper levels
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
    constructor() {
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        this.currentLevel = isDevelopment ? this.levels.DEBUG : this.levels.ERROR;
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}]`;
        
        if (data) {
            return `${prefix} ${message} ${JSON.stringify(data)}`;
        }
        return `${prefix} ${message}`;
    }

    error(message, data = null) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(this.formatMessage('ERROR', message, data));
        }
    }

    warn(message, data = null) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(this.formatMessage('WARN', message, data));
        }
    }

    info(message, data = null) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(this.formatMessage('INFO', message, data));
        }
    }

    debug(message, data = null) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log(this.formatMessage('DEBUG', message, data));
        }
    }

    // Production-safe methods
    startup(message) {
        // Always log startup messages
        console.log(this.formatMessage('STARTUP', message));
    }

    security(message, data = null) {
        // Always log security events
        console.error(this.formatMessage('SECURITY', message, data));
    }

    audit(message, data = null) {
        // Always log audit events
        console.log(this.formatMessage('AUDIT', message, data));
    }
}

export const logger = new Logger();

// Convenience exports for cleaner imports
export const { error, warn, info, debug, startup, security, audit } = logger;
