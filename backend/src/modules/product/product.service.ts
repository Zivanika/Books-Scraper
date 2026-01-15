import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from '../navigation/entities/product.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { ScraperService } from '../scraper/scraper.service';
import { ScrapeTargetType } from '../navigation/entities/scrape-job.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly CACHE_TTL_HOURS = 24;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private scraperService: ScraperService,
  ) {}

  async findAll(query: QueryProductsDto) {
    const { page = 1, limit = 20, categoryId, search, minPrice, maxPrice, author, minRating } = query;
    
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      queryBuilder.andWhere('product.title ILIKE :search', { search: `%${search}%` });
    }

    if (author) {
      queryBuilder.andWhere('product.author ILIKE :author', { author: `%${author}%` });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating !== undefined) {
      queryBuilder.andWhere('detail.ratingsAvg >= :minRating', { minRating });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['detail', 'reviews', 'category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if product needs refresh (older than CACHE_TTL_HOURS)
    const shouldRefresh = this.shouldRefresh(product.lastScrapedAt);
    
    if (shouldRefresh && product.sourceUrl) {
      this.logger.log(`Product ${id} is stale, queuing refresh...`);
      await this.scraperService.queueScrapeJob(
        product.sourceUrl,
        ScrapeTargetType.PRODUCT_DETAIL,
        { productId: id },
      );
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { sourceId: createProductDto.sourceId },
    });

    if (existingProduct) {
      return existingProduct;
    }

    const product = this.productRepository.create(createProductDto);
    product.lastScrapedAt = new Date();
    
    return this.productRepository.save(product);
  }

  async refreshProduct(id: string): Promise<Product> {
    const product = await this.findOne(id);
    
    if (!product.sourceUrl) {
      throw new Error('Product has no source URL');
    }

    await this.scraperService.queueScrapeJob(
      product.sourceUrl,
      ScrapeTargetType.PRODUCT_DETAIL,
      { productId: id },
    );

    return product;
  }

  private shouldRefresh(lastScrapedAt: Date | null): boolean {
    if (!lastScrapedAt) return true;
    
    const hoursSinceLastScrape = 
      (Date.now() - lastScrapedAt.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastScrape >= this.CACHE_TTL_HOURS;
  }
}