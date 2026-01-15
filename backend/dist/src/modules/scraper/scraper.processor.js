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
var ScraperProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scrape_job_entity_1 = require("../navigation/entities/scrape-job.entity");
const product_entity_1 = require("../navigation/entities/product.entity");
const category_entity_1 = require("../navigation/entities/category.entity");
const navigation_entity_1 = require("../navigation/entities/navigation.entity");
const product_detail_entity_1 = require("../navigation/entities/product-detail.entity");
const review_entity_1 = require("../navigation/entities/review.entity");
const scraper_service_1 = require("./scraper.service");
let ScraperProcessor = ScraperProcessor_1 = class ScraperProcessor {
    scrapeJobRepository;
    productRepository;
    categoryRepository;
    navigationRepository;
    productDetailRepository;
    reviewRepository;
    scraperService;
    logger = new common_1.Logger(ScraperProcessor_1.name);
    constructor(scrapeJobRepository, productRepository, categoryRepository, navigationRepository, productDetailRepository, reviewRepository, scraperService) {
        this.scrapeJobRepository = scrapeJobRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.navigationRepository = navigationRepository;
        this.productDetailRepository = productDetailRepository;
        this.reviewRepository = reviewRepository;
        this.scraperService = scraperService;
    }
    async handleScrape(job) {
        const { jobId, url, targetType } = job.data;
        this.logger.log(`═══════════════════════════════════════`);
        this.logger.log(`🚀 Processing scrape job ${jobId}`);
        this.logger.log(`   Type: ${targetType}`);
        this.logger.log(`   URL: ${url}`);
        this.logger.log(`═══════════════════════════════════════`);
        const scrapeJob = await this.scrapeJobRepository.findOne({
            where: { id: jobId }
        });
        if (!scrapeJob) {
            this.logger.error(`❌ Scrape job ${jobId} not found in database`);
            return;
        }
        try {
            scrapeJob.status = scrape_job_entity_1.ScrapeStatus.IN_PROGRESS;
            scrapeJob.startedAt = new Date();
            await this.scrapeJobRepository.save(scrapeJob);
            this.logger.log(`✅ Job status updated to IN_PROGRESS`);
            let result;
            let savedCount = 0;
            this.logger.log(`🔍 Starting scrape for type: ${targetType}`);
            switch (targetType) {
                case 'navigation':
                    result = await this.scraperService.scrapeNavigation();
                    this.logger.log(`📊 Navigation scrape returned ${result?.length || 0} items`);
                    savedCount = await this.saveNavigationData(result);
                    break;
                case 'category':
                    const isHomepage = job.data.metadata?.isHomepage || url === 'https://www.worldofbooks.com';
                    if (isHomepage) {
                        this.logger.log(`🏠 Scraping homepage products...`);
                        result = await this.scraperService.scrapeHomepageProducts();
                    }
                    else {
                        result = await this.scraperService.scrapeCategory(url);
                    }
                    this.logger.log(`📊 Scrape returned ${result?.products?.length || 0} products`);
                    if (result?.products && result.products.length > 0) {
                        this.logger.log(`📝 Sample products:`, result.products.slice(0, 3).map(p => ({
                            title: p.title?.substring(0, 50),
                            sourceId: p.sourceId,
                            price: p.price
                        })));
                    }
                    savedCount = await this.saveCategoryProducts(result, url);
                    break;
                case 'product_detail':
                    result = await this.scraperService.scrapeProductDetail(url);
                    this.logger.log(`📊 Product detail scrape completed`);
                    savedCount = await this.saveProductDetail(result, url);
                    break;
                default:
                    throw new Error(`Unknown target type: ${targetType}`);
            }
            this.logger.log(`💾 Saving results: ${savedCount} items saved`);
            scrapeJob.status = scrape_job_entity_1.ScrapeStatus.COMPLETED;
            scrapeJob.finishedAt = new Date();
            scrapeJob.metadata = {
                ...scrapeJob.metadata,
                itemsScraped: targetType === 'category' ? result.products?.length : result.length || 1,
                itemsSaved: savedCount,
                summary: `Scraped and saved ${savedCount} items`
            };
            await this.scrapeJobRepository.save(scrapeJob);
            this.logger.log(`✅ Scrape job ${jobId} completed successfully`);
            this.logger.log(`   Items scraped: ${targetType === 'category' ? result.products?.length : result.length || 0}`);
            this.logger.log(`   Items saved: ${savedCount}`);
            this.logger.log(`═══════════════════════════════════════`);
        }
        catch (error) {
            scrapeJob.status = scrape_job_entity_1.ScrapeStatus.FAILED;
            scrapeJob.finishedAt = new Date();
            scrapeJob.errorLog = error.message;
            this.logger.error(`❌ Scrape job ${jobId} FAILED`);
            this.logger.error(`   Error: ${error.message}`);
            this.logger.error(`   Stack: ${error.stack}`);
            this.logger.log(`═══════════════════════════════════════`);
            await this.scrapeJobRepository.save(scrapeJob);
        }
    }
    async saveNavigationData(navigationItems) {
        this.logger.log(`💾 Starting to save navigation data...`);
        this.logger.log(`   Items received: ${navigationItems?.length || 0}`);
        if (!navigationItems || navigationItems.length === 0) {
            this.logger.warn(`⚠️  No navigation items to save!`);
            return 0;
        }
        let savedCount = 0;
        for (let i = 0; i < navigationItems.length; i++) {
            const item = navigationItems[i];
            try {
                this.logger.debug(`   Item ${i + 1}/${navigationItems.length}: ${item.title}`);
                let navigation = await this.navigationRepository.findOne({
                    where: { slug: item.slug }
                });
                if (!navigation) {
                    navigation = this.navigationRepository.create({
                        title: item.title,
                        slug: item.slug,
                        sourceUrl: item.url,
                        lastScrapedAt: new Date(),
                    });
                    await this.navigationRepository.save(navigation);
                    savedCount++;
                    this.logger.debug(`     ✅ Saved: ${item.title}`);
                }
                else {
                    this.logger.debug(`     ⏭️  Already exists: ${item.title}`);
                }
            }
            catch (error) {
                this.logger.error(`   ❌ Failed to save navigation item ${item.title}: ${error.message}`);
            }
        }
        this.logger.log(`✅ Navigation data saved! New items: ${savedCount}`);
        return savedCount;
    }
    async saveCategoryProducts(data, categoryUrl) {
        this.logger.log(`💾 Starting to save products...`);
        this.logger.log(`   Source URL: ${categoryUrl}`);
        this.logger.log(`   Products received: ${data?.products?.length || 0}`);
        let savedCount = 0;
        const products = data.products || [];
        if (!products || products.length === 0) {
            this.logger.warn(`⚠️  No products to save! Data structure:`, JSON.stringify(data, null, 2));
            return 0;
        }
        let navigation = await this.navigationRepository.findOne({
            where: {}
        });
        if (!navigation) {
            this.logger.log(`📝 Creating default navigation item...`);
            navigation = this.navigationRepository.create({
                title: 'World of Books',
                slug: 'world-of-books',
                sourceUrl: 'https://www.worldofbooks.com',
                lastScrapedAt: new Date(),
            });
            await this.navigationRepository.save(navigation);
            this.logger.log(`✅ Created navigation: ${navigation.id}`);
        }
        else {
            this.logger.log(`✅ Found existing navigation: ${navigation.id}`);
        }
        const defaultCategoryName = 'All Books';
        this.logger.log(`🔍 Looking for category: ${defaultCategoryName}`);
        let category = await this.categoryRepository.findOne({
            where: { title: defaultCategoryName }
        });
        if (!category) {
            this.logger.log(`📝 Creating category: ${defaultCategoryName}`);
            category = this.categoryRepository.create({
                title: defaultCategoryName,
                slug: 'all-books',
                sourceUrl: categoryUrl,
                navigationId: navigation.id,
                lastScrapedAt: new Date(),
                productCount: 0,
            });
            await this.categoryRepository.save(category);
            this.logger.log(`✅ Created category: ${category.id} (${category.title})`);
        }
        else {
            this.logger.log(`✅ Found existing category: ${category.id} (${category.title})`);
        }
        this.logger.log(`🔄 Processing ${products.length} products...`);
        for (let i = 0; i < products.length; i++) {
            const productData = products[i];
            try {
                this.logger.debug(`   Product ${i + 1}/${products.length}: ${productData.title?.substring(0, 50)} (ID: ${productData.sourceId})`);
                let product = await this.productRepository.findOne({
                    where: { sourceId: productData.sourceId }
                });
                if (!product) {
                    this.logger.debug(`     Creating new product...`);
                    product = this.productRepository.create({
                        sourceId: productData.sourceId,
                        categoryId: category.id,
                        title: productData.title,
                        author: productData.author,
                        price: productData.price || 0,
                        currency: 'GBP',
                        imageUrl: productData.imageUrl,
                        sourceUrl: productData.sourceUrl,
                        lastScrapedAt: new Date(),
                    });
                    await this.productRepository.save(product);
                    savedCount++;
                    if (savedCount % 10 === 0) {
                        this.logger.log(`   ✅ Saved ${savedCount} products so far...`);
                    }
                }
                else {
                    this.logger.debug(`     Product already exists, skipping`);
                }
            }
            catch (error) {
                this.logger.error(`   ❌ Failed to save product ${productData.title}: ${error.message}`);
                this.logger.error(`      Product data:`, JSON.stringify(productData, null, 2));
            }
        }
        const totalProducts = await this.productRepository.count({
            where: { categoryId: category.id }
        });
        category.productCount = totalProducts;
        await this.categoryRepository.save(category);
        this.logger.log(`✅ Category products saved!`);
        this.logger.log(`   New products saved: ${savedCount}`);
        this.logger.log(`   Total products in category: ${totalProducts}`);
        return savedCount;
    }
    async saveProductDetail(detailData, productUrl) {
        try {
            const product = await this.productRepository.findOne({
                where: { sourceUrl: productUrl }
            });
            if (!product) {
                this.logger.warn(`Product not found for URL: ${productUrl}`);
                return 0;
            }
            let productDetail = await this.productDetailRepository.findOne({
                where: { productId: product.id }
            });
            if (!productDetail) {
                productDetail = this.productDetailRepository.create({
                    productId: product.id,
                    description: detailData.description,
                    specs: detailData.specs,
                    ratingsAvg: detailData.ratingsAvg,
                    reviewsCount: detailData.reviewsCount,
                });
            }
            else {
                productDetail.description = detailData.description;
                productDetail.specs = detailData.specs;
                productDetail.ratingsAvg = detailData.ratingsAvg;
                productDetail.reviewsCount = detailData.reviewsCount;
            }
            await this.productDetailRepository.save(productDetail);
            if (detailData.reviews && detailData.reviews.length > 0) {
                for (const reviewData of detailData.reviews) {
                    const review = this.reviewRepository.create({
                        productId: product.id,
                        author: reviewData.author,
                        rating: reviewData.rating || 0,
                        text: reviewData.text,
                    });
                    await this.reviewRepository.save(review);
                }
            }
            product.lastScrapedAt = new Date();
            await this.productRepository.save(product);
            this.logger.log(`Saved product details for: ${product.title}`);
            return 1;
        }
        catch (error) {
            this.logger.error(`Failed to save product detail: ${error.message}`);
            return 0;
        }
    }
};
exports.ScraperProcessor = ScraperProcessor;
__decorate([
    (0, bull_1.Process)('scrape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScraperProcessor.prototype, "handleScrape", null);
exports.ScraperProcessor = ScraperProcessor = ScraperProcessor_1 = __decorate([
    (0, bull_1.Processor)('scraper'),
    __param(0, (0, typeorm_1.InjectRepository)(scrape_job_entity_1.ScrapeJob)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(3, (0, typeorm_1.InjectRepository)(navigation_entity_1.Navigation)),
    __param(4, (0, typeorm_1.InjectRepository)(product_detail_entity_1.ProductDetail)),
    __param(5, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        scraper_service_1.ScraperService])
], ScraperProcessor);
//# sourceMappingURL=scraper.processor.js.map