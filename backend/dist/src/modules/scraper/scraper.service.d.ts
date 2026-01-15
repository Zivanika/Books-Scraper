import { Repository } from 'typeorm';
import { ScrapeJob, ScrapeTargetType } from '../navigation/entities/scrape-job.entity';
import type { Queue } from 'bull';
export declare class ScraperService {
    private scrapeJobRepository;
    private scraperQueue;
    private readonly logger;
    private readonly BASE_URL;
    private readonly CATEGORY_NAMES;
    constructor(scrapeJobRepository: Repository<ScrapeJob>, scraperQueue: Queue);
    queueScrapeJob(url: string, targetType: ScrapeTargetType, metadata?: Record<string, any>): Promise<ScrapeJob>;
    scrapeNavigation(): Promise<any[]>;
    scrapeHomepageProducts(): Promise<any>;
    scrapeCategory(categoryUrl: string): Promise<any>;
    getCategoryNames(): string[];
    scrapeProductDetail(productUrl: string): Promise<any>;
}
