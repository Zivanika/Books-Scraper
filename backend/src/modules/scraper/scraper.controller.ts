import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ScraperService } from './scraper.service';
import { ScrapeTargetType } from '../navigation/entities/scrape-job.entity';

@ApiTags('scraper')
@Controller('api/v1/scraper')
@UseGuards(ThrottlerGuard)
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('navigation')
  @ApiOperation({ 
    summary: 'Scrape navigation/menu structure',
    description: 'Scrapes the main navigation menu from World of Books and creates categories'
  })
  @ApiResponse({ status: 201, description: 'Scrape job queued successfully' })
  async scrapeNavigation() {
    const job = await this.scraperService.queueScrapeJob(
      'https://www.worldofbooks.com',
      ScrapeTargetType.NAVIGATION,
      { description: 'Scrape main navigation menu' }
    );
    
    return {
      message: 'Navigation scrape job queued',
      jobId: job.id,
      status: job.status,
      targetUrl: job.targetUrl,
    };
  }

  @Post('category')
  @ApiOperation({ 
    summary: 'Scrape products from a category',
    description: 'Scrapes all products from a specific category URL'
  })
  @ApiQuery({ name: 'url', required: true, description: 'Category URL to scrape' })
  @ApiResponse({ status: 201, description: 'Scrape job queued successfully' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async scrapeCategory(@Query('url') url: string) {
    if (!url) {
      return { error: 'URL parameter is required' };
    }

    const job = await this.scraperService.queueScrapeJob(
      url,
      ScrapeTargetType.CATEGORY,
      { description: 'Scrape category products' }
    );
    
    return {
      message: 'Category scrape job queued',
      jobId: job.id,
      status: job.status,
      targetUrl: job.targetUrl,
    };
  }

  @Post('product')
  @ApiOperation({ 
    summary: 'Scrape product details',
    description: 'Scrapes detailed information for a specific product'
  })
  @ApiQuery({ name: 'url', required: true, description: 'Product URL to scrape' })
  @ApiResponse({ status: 201, description: 'Scrape job queued successfully' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async scrapeProduct(@Query('url') url: string) {
    if (!url) {
      return { error: 'URL parameter is required' };
    }

    const job = await this.scraperService.queueScrapeJob(
      url,
      ScrapeTargetType.PRODUCT_DETAIL,
      { description: 'Scrape product details' }
    );
    
    return {
      message: 'Product scrape job queued',
      jobId: job.id,
      status: job.status,
      targetUrl: job.targetUrl,
    };
  }

  @Post('seed')
  @ApiOperation({ 
    summary: 'Seed database with initial data',
    description: 'Scrapes products ONLY from https://www.worldofbooks.com homepage'
  })
  @ApiResponse({ status: 201, description: 'Seed jobs queued successfully' })
  async seedDatabase() {
    // Queue ONLY homepage product scrape
    const homepageJob = await this.scraperService.queueScrapeJob(
      'https://www.worldofbooks.com',
      ScrapeTargetType.CATEGORY,
      { description: 'Scrape products from homepage', isHomepage: true }
    );

    return {
      message: 'Database seeding initiated - scraping homepage only',
      jobs: {
        homepage: {
          jobId: homepageJob.id,
          status: homepageJob.status,
          url: homepageJob.targetUrl,
        },
      },
      note: 'Scraping products from https://www.worldofbooks.com homepage. Check logs for progress.',
    };
  }

  @Post('homepage')
  @ApiOperation({ 
    summary: 'Scrape products from homepage',
    description: 'Scrapes products directly from the World of Books homepage'
  })
  @ApiResponse({ status: 201, description: 'Homepage scrape job queued successfully' })
  async scrapeHomepage() {
    const job = await this.scraperService.queueScrapeJob(
      'https://www.worldofbooks.com',
      ScrapeTargetType.CATEGORY,
      { description: 'Scrape products from homepage', isHomepage: true }
    );
    
    return {
      message: 'Homepage scrape job queued',
      jobId: job.id,
      status: job.status,
      targetUrl: job.targetUrl,
    };
  }

  @Get('jobs')
  @ApiOperation({ 
    summary: 'Get all scrape jobs',
    description: 'Returns list of all scrape jobs with their status'
  })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_progress', 'completed', 'failed'] })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  @ApiResponse({ status: 200, description: 'Returns list of scrape jobs' })
  async getJobs(
    @Query('status') status?: string,
    @Query('limit') limit: number = 20,
  ) {
    // This would need to be implemented in the scraper service
    return {
      message: 'Job listing endpoint - to be implemented',
      note: 'Check your database scrape_job table for job status',
    };
  }
}
