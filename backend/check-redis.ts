/**
 * Redis Connectivity Check Script
 * Run with: npx ts-node check-redis.ts
 */

import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkRedis() {
  console.log('🔍 Testing Redis Connection...\n');

  let client: Redis | null = null;

  try {
    // Method 1: Use REDIS_URL (for Upstash)
    if (process.env.REDIS_URL) {
      console.log('📡 Method 1: Using REDIS_URL');
      const maskedUrl = process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@');
      console.log(`   URL: ${maskedUrl}\n`);

      client = new Redis(process.env.REDIS_URL, {
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

      // Wait for connection to be ready
      await new Promise<void>((resolve, reject) => {
        if (client?.status === 'ready') {
          resolve();
        } else {
          client?.once('ready', () => resolve());
          client?.once('error', (err) => reject(err));
          setTimeout(() => reject(new Error('Connection timeout')), 10000);
        }
      });

      // Test PING
      const pong = await client.ping();
      console.log(`✅ PING Response: ${pong}`);

      // Test SET/GET
      await client.set('test:connection', 'success', 'EX', 10);
      const value = await client.get('test:connection');
      console.log(`✅ SET/GET Test: ${value}`);

      // Get Redis info
      const info = await client.info('server');
      const redisVersion = info.match(/redis_version:([^\r\n]+)/)?.[1];
      console.log(`✅ Redis Version: ${redisVersion || 'Unknown'}`);

      // Check if it's Upstash
      const redisMode = info.match(/redis_mode:([^\r\n]+)/)?.[1];
      if (redisMode) {
        console.log(`✅ Redis Mode: ${redisMode}`);
      }

      await client.quit();
      console.log('\n✅ Redis connection test PASSED!\n');
      return true;
    }

    // Method 2: Use REDIS_HOST and REDIS_PORT
    if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
      console.log('📡 Method 2: Using REDIS_HOST and REDIS_PORT');
      const maskedHost = process.env.REDIS_HOST.replace(/:[^:@]+@/, ':****@');
      console.log(`   Host: ${maskedHost}`);
      console.log(`   Port: ${process.env.REDIS_PORT}\n`);

      client = new Redis({
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

      // Wait for connection to be ready
      await new Promise<void>((resolve, reject) => {
        if (client?.status === 'ready') {
          resolve();
        } else {
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
  } catch (error: any) {
    console.error(`❌ Connection failed: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   • Check if Redis host is correct');
      console.error('   • Check if Redis port is correct');
      console.error('   • Check if firewall allows connection');
      console.error('   • For Upstash: Verify REDIS_URL is correct\n');
    }
    return false;
  } finally {
    if (client && client.status !== 'end') {
      try {
        await client.quit();
      } catch (err) {
        // Ignore errors when disconnecting
      }
    }
  }
}

// Run the check
checkRedis()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
