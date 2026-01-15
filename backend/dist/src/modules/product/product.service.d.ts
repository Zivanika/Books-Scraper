import { Repository } from 'typeorm';
import { Product } from '../navigation/entities/product.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { ScraperService } from '../scraper/scraper.service';
export declare class ProductService {
    private productRepository;
    private productDetailRepository;
    private reviewRepository;
    private scraperService;
    private readonly logger;
    private readonly CACHE_TTL_HOURS;
    constructor(productRepository: Repository<Product>, productDetailRepository: Repository<ProductDetail>, reviewRepository: Repository<Review>, scraperService: ScraperService);
    findAll(query: QueryProductsDto): Promise<{
        items: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    refreshProduct(id: string): Promise<Product>;
    private shouldRefresh;
}
