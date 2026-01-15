#!/usr/bin/env node

/**
 * Redis Connectivity Test Script
 * Tests connection to Redis (Upstash or local)
 */

const redis = require('ioredis');
require('dotenv').config();

async function testRedis() {
  console.log('🔍 Testing Redis Connection...\n');

  // Method 1: Try REDIS_URL first (for Upstash)
  if (process.env.REDIS_URL) {
    console.log('📡 Method 1: Using REDIS_URL');
    console.log(`   URL: ${process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@')}\n`);
    
    try {
      const client = redis.createClient({
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying
          }
          return Math.min(times * 50, 2000);
        },
      });

      client.on('error', (err) => {
        console.error('❌ Redis Error:', err.message);
      });

      client.on('connect', () => {
        console.log('✅ Connected to Redis!');
      });

      await client.connect();
      
      // Test PING
      const pong = await client.ping();
      console.log(`✅ PING Response: ${pong}`);
      
      // Test SET/GET
      await client.set('test:connection', 'success', 'EX', 10);
      const value = await client.get('test:connection');
      console.log(`✅ SET/GET Test: ${value}`);
      
      // Test INFO
      const info = await client.info('server');
      const redisVersion = info.match(/redis_version:([^\r\n]+)/)?.[1];
      console.log(`✅ Redis Version: ${redisVersion || 'Unknown'}`);
      
      await client.quit();
      console.log('\n✅ Redis connection test PASSED!\n');
      return true;
    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}\n`);
    }
  }

  // Method 2: Try host/port (for local Redis)
  if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    console.log('📡 Method 2: Using REDIS_HOST and REDIS_PORT');
    console.log(`   Host: ${process.env.REDIS_HOST.replace(/:[^:@]+@/, ':****@')}`);
    console.log(`   Port: ${process.env.REDIS_PORT}\n`);
    
    try {
      const client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            return null;
          }
          return Math.min(times * 50, 2000);
        },
      });

      client.on('error', (err) => {
        console.error('❌ Redis Error:', err.message);
      });

      client.on('connect', () => {
        console.log('✅ Connected to Redis!');
      });

      await client.connect();
      
      const pong = await client.ping();
      console.log(`✅ PING Response: ${pong}`);
      
      await client.set('test:connection', 'success', 'EX', 10);
      const value = await client.get('test:connection');
      console.log(`✅ SET/GET Test: ${value}`);
      
      await client.quit();
      console.log('\n✅ Redis connection test PASSED!\n');
      return true;
    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}\n`);
    }
  }

  console.log('❌ No Redis configuration found!');
  console.log('   Please set REDIS_URL or REDIS_HOST/REDIS_PORT in .env file\n');
  return false;
}

// Run the test
testRedis()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
