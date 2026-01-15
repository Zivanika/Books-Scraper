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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../navigation/entities/product.entity");
const product_detail_entity_1 = require("../navigation/entities/product-detail.entity");
const review_entity_1 = require("../navigation/entities/review.entity");
const scraper_service_1 = require("../scraper/scraper.service");
const scrape_job_entity_1 = require("../navigation/entities/scrape-job.entity");
let ProductService = ProductService_1 = class ProductService {
    productRepository;
    productDetailRepository;
    reviewRepository;
    scraperService;
    logger = new common_1.Logger(ProductService_1.name);
    CACHE_TTL_HOURS = 24;
    constructor(productRepository, productDetailRepository, reviewRepository, scraperService) {
        this.productRepository = productRepository;
        this.productDetailRepository = productDetailRepository;
        this.reviewRepository = reviewRepository;
        this.scraperService = scraperService;
    }
    async findAll(query) {
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
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['detail', 'reviews', 'category'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const shouldRefresh = this.shouldRefresh(product.lastScrapedAt);
        if (shouldRefresh && product.sourceUrl) {
            this.logger.log(`Product ${id} is stale, queuing refresh...`);
            await this.scraperService.queueScrapeJob(product.sourceUrl, scrape_job_entity_1.ScrapeTargetType.PRODUCT_DETAIL, { productId: id });
        }
        return product;
    }
    async create(createProductDto) {
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
    async refreshProduct(id) {
        const product = await this.findOne(id);
        if (!product.sourceUrl) {
            throw new Error('Product has no source URL');
        }
        await this.scraperService.queueScrapeJob(product.sourceUrl, scrape_job_entity_1.ScrapeTargetType.PRODUCT_DETAIL, { productId: id });
        return product;
    }
    shouldRefresh(lastScrapedAt) {
        if (!lastScrapedAt)
            return true;
        const hoursSinceLastScrape = (Date.now() - lastScrapedAt.getTime()) / (1000 * 60 * 60);
        return hoursSinceLastScrape >= this.CACHE_TTL_HOURS;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_detail_entity_1.ProductDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        scraper_service_1.ScraperService])
], ProductService);
//# sourceMappingURL=product.service.js.map