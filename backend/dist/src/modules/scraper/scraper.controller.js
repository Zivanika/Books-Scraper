"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const scraper_service_1 = require("./scraper.service");
const scrape_job_entity_1 = require("../navigation/entities/scrape-job.entity");
let ScraperController = class ScraperController {
    scraperService;
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async scrapeNavigation() {
        const job = await this.scraperService.queueScrapeJob('https://www.worldofbooks.com', scrape_job_entity_1.ScrapeTargetType.NAVIGATION, { description: 'Scrape main navigation menu' });
        return {
            message: 'Navigation scrape job queued',
            jobId: job.id,
            status: job.status,
            targetUrl: job.targetUrl,
        };
    }
    async scrapeCategory(url) {
        if (!url) {
            return { error: 'URL parameter is required' };
        }
        const job = await this.scraperService.queueScrapeJob(url, scrape_job_entity_1.ScrapeTargetType.CATEGORY, { description: 'Scrape category products' });
        return {
            message: 'Category scrape job queued',
            jobId: job.id,
            status: job.status,
            targetUrl: job.targetUrl,
        };
    }
    async scrapeProduct(url) {
        if (!url) {
            return { error: 'URL parameter is required' };
        }
        const job = await this.scraperService.queueScrapeJob(url, scrape_job_entity_1.ScrapeTargetType.PRODUCT_DETAIL, { description: 'Scrape product details' });
        return {
            message: 'Product scrape job queued',
            jobId: job.id,
            status: job.status,
            targetUrl: job.targetUrl,
        };
    }
    async seedDatabase() {
        const homepageJob = await this.scraperService.queueScrapeJob('https://www.worldofbooks.com', scrape_job_entity_1.ScrapeTargetType.CATEGORY, { description: 'Scrape products from homepage', isHomepage: true });
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
    async scrapeHomepage() {
        const job = await this.scraperService.queueScrapeJob('https://www.worldofbooks.com', scrape_job_entity_1.ScrapeTargetType.CATEGORY, { description: 'Scrape products from homepage', isHomepage: true });
        return {
            message: 'Homepage scrape job queued',
            jobId: job.id,
            status: job.status,
            targetUrl: job.targetUrl,
        };
    }
    async getJobs(status, limit = 20) {
        return {
            message: 'Job listing endpoint - to be implemented',
            note: 'Check your database scrape_job table for job status',
        };
    }
};
exports.ScraperController = ScraperController;
__decorate([
    (0, common_1.Post)('navigation'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scrape navigation/menu structure',
        description: 'Scrapes the main navigation menu from World of Books and creates categories'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scrape job queued successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeNavigation", null);
__decorate([
    (0, common_1.Post)('category'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scrape products from a category',
        description: 'Scrapes all products from a specific category URL'
    }),
    (0, swagger_1.ApiQuery)({ name: 'url', required: true, description: 'Category URL to scrape' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scrape job queued successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid URL' }),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeCategory", null);
__decorate([
    (0, common_1.Post)('product'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scrape product details',
        description: 'Scrapes detailed information for a specific product'
    }),
    (0, swagger_1.ApiQuery)({ name: 'url', required: true, description: 'Product URL to scrape' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scrape job queued successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid URL' }),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeProduct", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Seed database with initial data',
        description: 'Scrapes products ONLY from https://www.worldofbooks.com homepage'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Seed jobs queued successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "seedDatabase", null);
__decorate([
    (0, common_1.Post)('homepage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scrape products from homepage',
        description: 'Scrapes products directly from the World of Books homepage'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Homepage scrape job queued successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeHomepage", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all scrape jobs',
        description: 'Returns list of all scrape jobs with their status'
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['pending', 'in_progress', 'completed', 'failed'] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, default: 20 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of scrape jobs' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getJobs", null);
exports.ScraperController = ScraperController = __decorate([
    (0, swagger_1.ApiTags)('scraper'),
    (0, common_1.Controller)('api/v1/scraper'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperController);
//# sourceMappingURL=scraper.controller.js.map