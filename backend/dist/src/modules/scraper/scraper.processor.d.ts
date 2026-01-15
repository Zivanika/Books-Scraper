import type { Job } from 'bull';
import { Repository } from 'typeorm';
import { ScrapeJob } from '../navigation/entities/scrape-job.entity';
import { Product } from '../navigation/entities/product.entity';
import { Category } from '../navigation/entities/category.entity';
import { Navigation } from '../navigation/entities/navigation.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';
import { ScraperService } from './scraper.service';
export declare class ScraperProcessor {
    private scrapeJobRepository;
    private productRepository;
    private categoryRepository;
    private navigationRepository;
    private productDetailRepository;
    private reviewRepository;
    private scraperService;
    private readonly logger;
    constructor(scrapeJobRepository: Repository<ScrapeJob>, productRepository: Repository<Product>, categoryRepository: Repository<Category>, navigationRepository: Repository<Navigation>, productDetailRepository: Repository<ProductDetail>, reviewRepository: Repository<Review>, scraperService: ScraperService);
    handleScrape(job: Job): Promise<void>;
    private saveNavigationData;
    private saveCategoryProducts;
    private saveProductDetail;
}
