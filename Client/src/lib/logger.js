
const isDevelopment = import.meta.env.MODE === 'development';

class FrontendLogger {
    constructor() {
        this.isDev = isDevelopment;
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}]`;
        
        if (data) {
            return { message: `${prefix} ${message}`, data };
        }
        return { message: `${prefix} ${message}` };
    }

    error(message, data = null) {
        const formatted = this.formatMessage('ERROR', message, data);
        console.error(formatted.message, formatted.data || '');
    }

    warn(message, data = null) {
        const formatted = this.formatMessage('WARN', message, data);
        console.warn(formatted.message, formatted.data || '');
    }

    info(message, data = null) {
        if (this.isDev) {
            const formatted = this.formatMessage('INFO', message, data);
            console.log(formatted.message, formatted.data || '');
        }
    }

    debug(message, data = null) {
        if (this.isDev) {
            const formatted = this.formatMessage('DEBUG', message, data);
            console.log(formatted.message, formatted.data || '');
        }
    }

    userAction(action, data = null) {
        const formatted = this.formatMessage('USER_ACTION', action, data);
        console.log(formatted.message, formatted.data || '');
    }

    security(message, data = null) {
        const formatted = this.formatMessage('SECURITY', message, data);
        console.error(formatted.message, formatted.data || '');
    }
}

export const logger = new FrontendLogger();

export const { error, warn, info, debug, userAction, security } = logger;
