import { ScraperService } from './scraper.service';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    scrapeNavigation(): Promise<{
        message: string;
        jobId: string;
        status: import("../navigation/entities/scrape-job.entity").ScrapeStatus;
        targetUrl: string;
    }>;
    scrapeCategory(url: string): Promise<{
        error: string;
        message?: undefined;
        jobId?: undefined;
        status?: undefined;
        targetUrl?: undefined;
    } | {
        message: string;
        jobId: string;
        status: import("../navigation/entities/scrape-job.entity").ScrapeStatus;
        targetUrl: string;
        error?: undefined;
    }>;
    scrapeProduct(url: string): Promise<{
        error: string;
        message?: undefined;
        jobId?: undefined;
        status?: undefined;
        targetUrl?: undefined;
    } | {
        message: string;
        jobId: string;
        status: import("../navigation/entities/scrape-job.entity").ScrapeStatus;
        targetUrl: string;
        error?: undefined;
    }>;
    seedDatabase(): Promise<{
        message: string;
        jobs: {
            homepage: {
                jobId: string;
                status: import("../navigation/entities/scrape-job.entity").ScrapeStatus;
                url: string;
            };
        };
        note: string;
    }>;
    scrapeHomepage(): Promise<{
        message: string;
        jobId: string;
        status: import("../navigation/entities/scrape-job.entity").ScrapeStatus;
        targetUrl: string;
    }>;
    getJobs(status?: string, limit?: number): Promise<{
        message: string;
        note: string;
    }>;
}
