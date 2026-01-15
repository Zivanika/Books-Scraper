import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
// import { CacheModule } from '@nestjs/cache-manager';
import { databaseConfig } from './config/database.config';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { ScraperModule } from './modules/scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    BullModule.forRoot({
      redis: (() => {
        // Use REDIS_URL if available (for Upstash)
        if (process.env.REDIS_URL) {
          try {
            const url = new URL(process.env.REDIS_URL);
            const config: any = {
              host: url.hostname,
              port: parseInt(url.port || '6379', 10),
            };
            
            // Extract password from URL
            if (url.password) {
              config.password = url.password;
            } else if (url.username && url.username !== 'default') {
              // Some Upstash URLs have password in username
              config.password = url.username;
            }
            
            // Enable TLS for rediss:// protocol
            if (url.protocol === 'rediss:') {
              config.tls = {};
            }
            
            return config;
          } catch (error) {
            console.warn('Failed to parse REDIS_URL, falling back to host/port');
          }
        }
        
        // Fallback to host/port configuration
        const config: any = {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        };
        
        // Add password if provided separately
        if (process.env.REDIS_PASSWORD) {
          config.password = process.env.REDIS_PASSWORD;
        }
        
        return config;
      })(),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: 300, // 5 minutes
    // }),
    ProductModule,
    CategoryModule,
    NavigationModule,
    ScraperModule,
  ],
})
export class AppModule {}