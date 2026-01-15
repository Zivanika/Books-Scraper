"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = () => {
    if (process.env.DATABASE_URL) {
        try {
            const url = new URL(process.env.DATABASE_URL);
            return {
                type: 'postgres',
                host: url.hostname,
                port: parseInt(url.port || '5432', 10),
                username: url.username,
                password: url.password,
                database: url.pathname.slice(1),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            };
        }
        catch (error) {
            console.warn('Failed to parse DATABASE_URL, falling back to individual variables');
        }
    }
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'product_explorer',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
    };
};
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map