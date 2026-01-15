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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function checkRedis() {
    console.log('🔍 Testing Redis Connection...\n');
    let client = null;
    try {
        if (process.env.REDIS_URL) {
            console.log('📡 Method 1: Using REDIS_URL');
            const maskedUrl = process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@');
            console.log(`   URL: ${maskedUrl}\n`);
            client = new ioredis_1.default(process.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) {
                        return null;
                    }
                    return Math.min(times * 50, 2000);
                },
                enableReadyCheck: true,
                enableOfflineQueue: true,
                lazyConnect: false,
            });
            client.on('error', (err) => {
                console.error('❌ Redis Error:', err.message);
            });
            client.on('connect', () => {
                console.log('✅ Connected to Redis!');
            });
            await new Promise((resolve, reject) => {
                if (client?.status === 'ready') {
                    resolve();
                }
                else {
                    client?.once('ready', () => resolve());
                    client?.once('error', (err) => reject(err));
                    setTimeout(() => reject(new Error('Connection timeout')), 10000);
                }
            });
            const pong = await client.ping();
            console.log(`✅ PING Response: ${pong}`);
            await client.set('test:connection', 'success', 'EX', 10);
            const value = await client.get('test:connection');
            console.log(`✅ SET/GET Test: ${value}`);
            const info = await client.info('server');
            const redisVersion = info.match(/redis_version:([^\r\n]+)/)?.[1];
            console.log(`✅ Redis Version: ${redisVersion || 'Unknown'}`);
            const redisMode = info.match(/redis_mode:([^\r\n]+)/)?.[1];
            if (redisMode) {
                console.log(`✅ Redis Mode: ${redisMode}`);
            }
            await client.quit();
            console.log('\n✅ Redis connection test PASSED!\n');
            return true;
        }
        if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
            console.log('📡 Method 2: Using REDIS_HOST and REDIS_PORT');
            const maskedHost = process.env.REDIS_HOST.replace(/:[^:@]+@/, ':****@');
            console.log(`   Host: ${maskedHost}`);
            console.log(`   Port: ${process.env.REDIS_PORT}\n`);
            client = new ioredis_1.default({
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT, 10),
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) {
                        return null;
                    }
                    return Math.min(times * 50, 2000);
                },
                enableOfflineQueue: true,
                lazyConnect: false,
            });
            client.on('error', (err) => {
                console.error('❌ Redis Error:', err.message);
            });
            client.on('connect', () => {
                console.log('✅ Connected to Redis!');
            });
            await new Promise((resolve, reject) => {
                if (client?.status === 'ready') {
                    resolve();
                }
                else {
                    client?.once('ready', () => resolve());
                    client?.once('error', (err) => reject(err));
                    setTimeout(() => reject(new Error('Connection timeout')), 10000);
                }
            });
            const pong = await client.ping();
            console.log(`✅ PING Response: ${pong}`);
            await client.set('test:connection', 'success', 'EX', 10);
            const value = await client.get('test:connection');
            console.log(`✅ SET/GET Test: ${value}`);
            await client.quit();
            console.log('\n✅ Redis connection test PASSED!\n');
            return true;
        }
        console.log('❌ No Redis configuration found!');
        console.log('   Please set REDIS_URL or REDIS_HOST/REDIS_PORT in .env file\n');
        return false;
    }
    catch (error) {
        console.error(`❌ Connection failed: ${error.message}`);
        if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.error('\n💡 Troubleshooting:');
            console.error('   • Check if Redis host is correct');
            console.error('   • Check if Redis port is correct');
            console.error('   • Check if firewall allows connection');
            console.error('   • For Upstash: Verify REDIS_URL is correct\n');
        }
        return false;
    }
    finally {
        if (client && client.status !== 'end') {
            try {
                await client.quit();
            }
            catch (err) {
            }
        }
    }
}
checkRedis()
    .then((success) => {
    process.exit(success ? 0 : 1);
})
    .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
//# sourceMappingURL=check-redis.js.map