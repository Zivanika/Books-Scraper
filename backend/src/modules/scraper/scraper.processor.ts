import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeJob, ScrapeStatus } from '../navigation/entities/scrape-job.entity';
import { Product } from '../navigation/entities/product.entity';
import { Category } from '../navigation/entities/category.entity';
import { Navigation } from '../navigation/entities/navigation.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';
import { ScraperService } from './scraper.service';

@Processor('scraper')
export class ScraperProcessor {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private scraperService: ScraperService,
  ) {}

  @Process('scrape')
  async handleScrape(job: Job) {
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
      scrapeJob.status = ScrapeStatus.IN_PROGRESS;
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
          // Check if this is a homepage scrape
          const isHomepage = job.data.metadata?.isHomepage || url === 'https://www.worldofbooks.com';
          
          if (isHomepage) {
            this.logger.log(`🏠 Scraping homepage products...`);
            result = await this.scraperService.scrapeHomepageProducts();
          } else {
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
      
      scrapeJob.status = ScrapeStatus.COMPLETED;
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
    } catch (error) {
      scrapeJob.status = ScrapeStatus.FAILED;
      scrapeJob.finishedAt = new Date();
      scrapeJob.errorLog = error.message;
      
      this.logger.error(`❌ Scrape job ${jobId} FAILED`);
      this.logger.error(`   Error: ${error.message}`);
      this.logger.error(`   Stack: ${error.stack}`);
      this.logger.log(`═══════════════════════════════════════`);
      
      await this.scrapeJobRepository.save(scrapeJob);
    }
  }

  private async saveNavigationData(navigationItems: any[]): Promise<number> {
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
        
        // Check if navigation item already exists
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
        } else {
          this.logger.debug(`     ⏭️  Already exists: ${item.title}`);
        }
      } catch (error: any) {
        this.logger.error(`   ❌ Failed to save navigation item ${item.title}: ${error.message}`);
      }
    }

    this.logger.log(`✅ Navigation data saved! New items: ${savedCount}`);
    return savedCount;
  }

  private async saveCategoryProducts(data: any, categoryUrl: string): Promise<number> {
    this.logger.log(`💾 Starting to save products...`);
    this.logger.log(`   Source URL: ${categoryUrl}`);
    this.logger.log(`   Products received: ${data?.products?.length || 0}`);
    
    let savedCount = 0;
    const products = data.products || [];

    if (!products || products.length === 0) {
      this.logger.warn(`⚠️  No products to save! Data structure:`, JSON.stringify(data, null, 2));
      return 0;
    }

    // Ensure a default navigation exists (required for categories)
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
    } else {
      this.logger.log(`✅ Found existing navigation: ${navigation.id}`);
    }

    // Use "All Books" as default category for homepage products
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
        navigationId: navigation.id, // Required field - use the navigation we just ensured exists
        lastScrapedAt: new Date(),
        productCount: 0,
      });
      
      await this.categoryRepository.save(category);
      this.logger.log(`✅ Created category: ${category.id} (${category.title})`);
    } else {
      this.logger.log(`✅ Found existing category: ${category.id} (${category.title})`);
    }

    this.logger.log(`🔄 Processing ${products.length} products...`);
    
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      
      try {
        this.logger.debug(`   Product ${i + 1}/${products.length}: ${productData.title?.substring(0, 50)} (ID: ${productData.sourceId})`);
        
        // Check if product already exists
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
        } else {
          this.logger.debug(`     Product already exists, skipping`);
        }
      } catch (error: any) {
        this.logger.error(`   ❌ Failed to save product ${productData.title}: ${error.message}`);
        this.logger.error(`      Product data:`, JSON.stringify(productData, null, 2));
      }
    }

    // Update category product count
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

  private async saveProductDetail(detailData: any, productUrl: string): Promise<number> {
    try {
      // Find the product by URL
      const product = await this.productRepository.findOne({
        where: { sourceUrl: productUrl }
      });

      if (!product) {
        this.logger.warn(`Product not found for URL: ${productUrl}`);
        return 0;
      }

      // Create or update product detail
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
      } else {
        productDetail.description = detailData.description;
        productDetail.specs = detailData.specs;
        productDetail.ratingsAvg = detailData.ratingsAvg;
        productDetail.reviewsCount = detailData.reviewsCount;
      }

      await this.productDetailRepository.save(productDetail);

      // Save reviews
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

      // Update product last scraped time
      product.lastScrapedAt = new Date();
      await this.productRepository.save(product);

      this.logger.log(`Saved product details for: ${product.title}`);
      return 1;
    } catch (error) {
      this.logger.error(`Failed to save product detail: ${error.message}`);
      return 0;
    }
  }
}