import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

const SERVER_START_MS = Date.now();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins = [
    'https://book-mania-book-scraper.vercel.app',
    process.env.FRONTEND_URL,
    'http://localhost:3000',
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, allow all origins for easier testing
        if (process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Product Data Explorer API')
    .setDescription('API for exploring products from World of Books')
    .setVersion('1.0')
    .addTag('products')
    .addTag('categories')
    .addTag('navigation')
    .build();
    
  const openapiDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, openapiDocument);

  // Lightweight uptime probe for Render, load balancers, etc. (bypasses global pipes/guards)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req: Request, res: Response) => {
    const uptimeSeconds = process.uptime();
    res.status(200).json({
      status: 'ok',
      uptimeSeconds: Math.round(uptimeSeconds * 100) / 100,
      startedAt: new Date(SERVER_START_MS).toISOString(),
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`❤️  Health check: http://localhost:${port}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();