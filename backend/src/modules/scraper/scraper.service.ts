import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ScrapeJob, ScrapeStatus, ScrapeTargetType } from '../navigation/entities/scrape-job.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly BASE_URL = 'https://www.worldofbooks.com';
  
  // Hardcoded category names based on World of Books website
  private readonly CATEGORY_NAMES = [
    'All Fiction Books',
    'Crime & Mystery',
    'Fantasy',
    'Modern Fiction',
    'Romance',
    'Adventure',
    'Thriller & Suspense',
    'Classic Fiction',
    'Erotic Fiction',
    'Fiction-Related Items',
    'Anthologies & Short Stories',
    'Graphic Novels',
    'Historical Fiction',
    'Horror & Ghost Stories',
    'Religious & Spiritual Fiction',
    'Sagas',
    'Science Fiction',
    'All Non-Fiction Books',
    'Biography & True Stories',
    'English Language Teaching',
    'Health & Personal Development',
    'Lifestyle, Cooking & Leisure',
    'Reference Books',
    'Arts Books',
    'Computing & IT',
    'Earth Sciences',
    'Economics & Finance',
    'Humanities Books',
    'Language',
    'Law',
    'Literature & Literary Studies',
    'Mathematics & Science',
    'Medicine',
    'Social Sciences',
    'Technology',
    'All Children\'s Books',
    'Children\'s Fiction & True Stories',
    'Children\'s Non-Fiction',
    'Activity, Early Learning & Picture Books',
    'Children\'s Reference Books',
    'Children\'s Education & Learning',
    'Children\'s Poetry & Anthologies',
    'Children\'s Personal & Social Issues',
    'Stationary & Miscellaneous Items',
  ];

  constructor(
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
    @InjectQueue('scraper')
    private scraperQueue: Queue,
  ) {}

  async queueScrapeJob(
    url: string,
    targetType: ScrapeTargetType,
    metadata?: Record<string, any>,
  ): Promise<ScrapeJob> {
    const job = this.scrapeJobRepository.create({
      targetUrl: url,
      targetType,
      metadata,
      status: ScrapeStatus.PENDING,
    });

    const savedJob = await this.scrapeJobRepository.save(job);
    
    await this.scraperQueue.add('scrape', {
      jobId: savedJob.id,
      url,
      targetType,
    });

    this.logger.log(`Queued scrape job ${savedJob.id} for ${url}`);
    return savedJob;
  }

  async scrapeNavigation(): Promise<any[]> {
    this.logger.log(`🔍 Starting navigation scrape for: ${this.BASE_URL}`);
    
    // Capture logger reference for use inside requestHandler
    const logger = this.logger;
    
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 60,
      maxConcurrency: 1,
      async requestHandler({ page, request }) {
        logger.log(`📄 Navigation page loaded`);
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for navigation to load
        logger.log(`🔎 Looking for navigation elements...`);
        await page.waitForSelector('nav, header', { timeout: 10000 }).catch(() => {
          logger.warn(`⚠️  Navigation elements not found`);
        });
        
        // Extract navigation items
        const navigationItems = await page.evaluate(() => {
          const items: Array<{ title: string; url: string | null; slug: string }> = [];
          
          // Try multiple selectors for navigation
          const navSelectors = [
            'nav a',
            'header nav a',
            '.header__menu a',
            '.navigation a',
            '[role="navigation"] a'
          ];
          
          let navLinks: NodeListOf<Element> | null = null;
          for (const selector of navSelectors) {
            navLinks = document.querySelectorAll(selector);
            if (navLinks.length > 0) break;
          }
          
          if (navLinks) {
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              const text = link.textContent?.trim();
              
              // Filter out empty, hash links, and non-category links
              if (href && text && !href.startsWith('#') && href.length > 1) {
                // Only include links that look like category links
                if (href.includes('/category/') || href.includes('/books') || href.includes('/en-gb/')) {
                  items.push({
                    title: text,
                    url: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                    slug: href.split('/').filter(Boolean).pop() || text.toLowerCase().replace(/\s+/g, '-'),
                  });
                }
              }
            });
          }
          
          return items;
        });

        await Dataset.pushData({ navigationItems });
      },
    });

    this.logger.log(`🚀 Starting crawler for navigation...`);
    await crawler.run([this.BASE_URL]);
    const dataset = await Dataset.getData();
    const result = dataset.items[0]?.navigationItems || [];
    
    this.logger.log(`✅ Navigation scrape complete. Found ${result.length} navigation items`);
    return result;
  }

  /**
   * Scrape products from homepage (base URL)
   * This method scrapes products directly from the homepage where they're displayed
   */
  async scrapeHomepageProducts(): Promise<any> {
    this.logger.log(`🔍 Starting homepage product scrape from: ${this.BASE_URL}`);
    
    // Capture logger reference for use inside requestHandler
    const logger = this.logger;
    
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 180, // 3 minutes total
      maxConcurrency: 1,
      launchContext: {
        launchOptions: {
          headless: true,
          timeout: 120000, // 2 minutes for browser launch
        },
      },
      async requestHandler({ page, request }) {
        logger.log(`📄 Loading homepage: ${request.url}`);
        
        try {
          // Set page timeouts BEFORE any operations
          page.setDefaultNavigationTimeout(120000); // 2 minutes for navigation
          page.setDefaultTimeout(120000); // 2 minutes for all operations
          
          logger.log(`⏳ Waiting for page to load (timeout: 90s)...`);
          
          // Wait for page to load with longer timeout
          await page.waitForLoadState('domcontentloaded', { timeout: 90000 });
          logger.log(`✅ Page DOM loaded`);
          
          // Wait for network to be idle (all resources loaded)
          try {
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            logger.log(`✅ Network idle`);
          } catch {
            logger.warn(`⚠️  Network idle timeout, continuing anyway...`);
          }
          
          // Wait a bit for dynamic content to load
          await page.waitForTimeout(5000);
          
          // Scroll to load more products if they're lazy-loaded
          logger.log(`📜 Scrolling page to load products...`);
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });
          await page.waitForTimeout(3000);
          
          // Scroll to bottom to trigger lazy loading
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          await page.waitForTimeout(2000);
        
          // Wait for product cards to load
          logger.log(`🔎 Looking for product cards on homepage...`);
          const cardsFound = await page.waitForSelector('.card.card--standard', { timeout: 30000 }).catch(() => {
            logger.warn(`⚠️  Product cards not found with primary selector`);
            return null;
          });
          
          if (cardsFound) {
            logger.log(`✅ Found product cards on homepage`);
          }
          
          // Extract products from homepage
          const homepageData = await page.evaluate(() => {
          const products: Array<{
            title: string;
            price: number | null;
            imageUrl: string | null | undefined;
            sourceUrl: string;
            author: string | undefined;
            sourceId: string;
          }> = [];
          
          const productCards = document.querySelectorAll('.card.card--standard[data-product-id]');
          console.log(`Found ${productCards.length} product cards on homepage`);
          
          productCards.forEach((card, index) => {
            try {
              const productId = card.getAttribute('data-product-id');
              const titleLink = card.querySelector('.card__heading a.full-unstyled-link');
              const title = titleLink?.getAttribute('data-item_name') || 
                           card.querySelector('.card__heading')?.textContent?.trim();
              const author = card.querySelector('.author')?.textContent?.trim();
              const priceElement = card.querySelector('.price-item');
              const priceText = priceElement?.textContent?.trim();
              const image = card.querySelector('.card__inner img')?.getAttribute('src');
              const link = titleLink?.getAttribute('href');
              
              if (title && link && productId) {
                products.push({
                  title: title,
                  price: priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null,
                  imageUrl: image ? (image.startsWith('http') ? image : `https://www.worldofbooks.com${image}`) : null,
                  sourceUrl: link.startsWith('http') ? link : `https://www.worldofbooks.com${link}`,
                  author: author || undefined,
                  sourceId: productId,
                });
              }
            } catch (error) {
              console.error(`Error processing product ${index + 1}:`, error);
            }
          });
          
          return { products };
        });

        logger.log(`📊 Extracted ${homepageData.products?.length || 0} products from homepage`);
        
        if (homepageData.products && homepageData.products.length > 0) {
          logger.log(`📝 Sample products:`, homepageData.products.slice(0, 3).map(p => ({
            title: p.title?.substring(0, 50),
            sourceId: p.sourceId,
            price: p.price
          })));
        }

          await Dataset.pushData(homepageData);
        } catch (error: any) {
          logger.error(`❌ Error during page processing: ${error.message}`);
          logger.error(`   Stack: ${error.stack}`);
          throw error;
        }
      },
      failedRequestHandler: async ({ request }) => {
        logger.error(`❌ Failed to process request: ${request.url}`);
        logger.error(`   Error: ${request.errorMessages?.join(', ')}`);
      },
      errorHandler: async ({ request, error }) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`❌ Crawler error for ${request.url}: ${errorMessage}`);
      },
    });

    this.logger.log(`🚀 Starting crawler for homepage...`);
    
    try {
      await crawler.run([this.BASE_URL]);
      const dataset = await Dataset.getData();
      const result = dataset.items[0] || { products: [] };
      
      this.logger.log(`✅ Homepage scraping complete. Found ${result.products?.length || 0} products`);
      return result;
    } catch (error: any) {
      this.logger.error(`❌ Crawler failed: ${error.message}`);
      throw error;
    }
  }

  async scrapeCategory(categoryUrl: string): Promise<any> {
    this.logger.log(`🔍 Starting category scrape for: ${categoryUrl}`);
    
    // Capture logger reference for use inside requestHandler
    const logger = this.logger;
    
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 180, // 3 minutes total
      maxConcurrency: 1,
      launchContext: {
        launchOptions: {
          headless: true,
          timeout: 120000, // 2 minutes for browser launch
        },
      },
      async requestHandler({ page, request }) {
        logger.log(`📄 Loading category page: ${request.url}`);
        
        try {
          // Set page timeouts BEFORE any operations
          page.setDefaultNavigationTimeout(120000); // 2 minutes for navigation
          page.setDefaultTimeout(120000); // 2 minutes for all operations
          
          logger.log(`⏳ Waiting for page to load (timeout: 90s)...`);
          await page.waitForLoadState('domcontentloaded', { timeout: 90000 });
          logger.log(`✅ Page DOM loaded`);
          
          // Wait for network to be idle
          try {
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            logger.log(`✅ Network idle`);
          } catch {
            logger.warn(`⚠️  Network idle timeout, continuing anyway...`);
          }
          
          // Wait a bit for dynamic content to load
          await page.waitForTimeout(5000);
          
          // Scroll to load more products if they're lazy-loaded
          logger.log(`📜 Scrolling page to load products...`);
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });
          await page.waitForTimeout(3000);
          
          // Scroll to bottom to trigger lazy loading
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          await page.waitForTimeout(2000);
        
          // Wait for product cards to load
          logger.log(`🔎 Looking for product cards with selector: .card.card--standard`);
          const cardsFound = await page.waitForSelector('.card.card--standard', { timeout: 30000 }).catch(() => {
            logger.warn(`⚠️  Product cards not found with primary selector, trying alternative selectors...`);
            return null;
          });
        
        if (!cardsFound) {
          // Try alternative selectors
          const altSelectors = [
            '.card[data-product-id]',
            '.product-card',
            '.product-item',
            '[data-product-id]'
          ];
          
          for (const selector of altSelectors) {
            const found = await page.$(selector).catch(() => null);
            if (found) {
              logger.log(`✅ Found products with selector: ${selector}`);
              break;
            }
          }
        } else {
          logger.log(`✅ Found product cards with primary selector`);
        }
        
        // Extract category information
        const categoryData = await page.evaluate(() => {
          const products: Array<{
            title: string;
            price: number | null;
            imageUrl: string | null | undefined;
            sourceUrl: string;
            author: string | undefined;
            sourceId: string;
          }> = [];
          
          // Updated selectors based on actual HTML structure
          const productCards = document.querySelectorAll('.card.card--standard[data-product-id]');
          
          console.log(`Found ${productCards.length} product cards`);
          
          productCards.forEach((card, index) => {
            try {
              // Get product ID from data attribute
              const productId = card.getAttribute('data-product-id');
              
              // Get title from the link inside card__heading
              const titleLink = card.querySelector('.card__heading a.full-unstyled-link');
              const title = titleLink?.getAttribute('data-item_name') || 
                           card.querySelector('.card__heading')?.textContent?.trim();
              
              // Get author from .author element
              const author = card.querySelector('.author')?.textContent?.trim();
              
              // Get price from .price-item
              const priceElement = card.querySelector('.price-item');
              const priceText = priceElement?.textContent?.trim();
              
              // Get image from card__inner
              const image = card.querySelector('.card__inner img')?.getAttribute('src');
              
              // Get link href
              const link = titleLink?.getAttribute('href');
              
              console.log(`Product ${index + 1}:`, {
                productId,
                title: title?.substring(0, 50),
                author,
                price: priceText,
                hasLink: !!link
              });
              
              if (title && link && productId) {
                products.push({
                  title: title,
                  price: priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null,
                  imageUrl: image ? (image.startsWith('http') ? image : `https://www.worldofbooks.com${image}`) : null,
                  sourceUrl: link.startsWith('http') ? link : `https://www.worldofbooks.com${link}`,
                  author: author || undefined,
                  sourceId: productId,
                });
              } else {
                console.warn(`Skipping product ${index + 1}: missing required fields`, {
                  hasTitle: !!title,
                  hasLink: !!link,
                  hasProductId: !!productId
                });
              }
            } catch (error) {
              console.error(`Error processing product card ${index + 1}:`, error);
            }
          });
          
          console.log(`Total products extracted: ${products.length}`);
          return { products };
        });

        logger.log(`📊 Extracted ${categoryData.products?.length || 0} products from page`);
        
        if (categoryData.products && categoryData.products.length > 0) {
          logger.log(`📝 Sample products:`, categoryData.products.slice(0, 3).map(p => ({
            title: p.title?.substring(0, 50),
            sourceId: p.sourceId,
            price: p.price
          })));
        } else {
          logger.warn(`⚠️  No products extracted! Checking page content...`);
          const pageTitle = await page.title();
          const pageUrl = page.url();
          logger.warn(`   Page title: ${pageTitle}`);
          logger.warn(`   Page URL: ${pageUrl}`);
          
          // Check what selectors exist on the page
          const selectorsInfo = await page.evaluate(() => {
            return {
              cardCount: document.querySelectorAll('.card').length,
              cardStandardCount: document.querySelectorAll('.card.card--standard').length,
              productIdCount: document.querySelectorAll('[data-product-id]').length,
              headingCount: document.querySelectorAll('.card__heading').length,
              priceItemCount: document.querySelectorAll('.price-item').length,
            };
          });
          logger.warn(`   Page selectors info:`, selectorsInfo);
          
          // Take a screenshot for debugging
          const screenshotPath = `/tmp/scraper-debug-${Date.now()}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
          logger.warn(`   Screenshot saved: ${screenshotPath}`);
        }

          await Dataset.pushData(categoryData);
        } catch (error: any) {
          logger.error(`❌ Error during category page processing: ${error.message}`);
          logger.error(`   Stack: ${error.stack}`);
          throw error;
        }
      },
      failedRequestHandler: async ({ request }) => {
        logger.error(`❌ Failed to process category request: ${request.url}`);
        logger.error(`   Error: ${request.errorMessages?.join(', ')}`);
      },
      errorHandler: async ({ request, error }) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`❌ Crawler error for ${request.url}: ${errorMessage}`);
      },
    });

    this.logger.log(`🚀 Starting crawler for category: ${categoryUrl}`);
    await crawler.run([categoryUrl]);
    const dataset = await Dataset.getData();
    const result = dataset.items[0] || { products: [] };
    
    this.logger.log(`✅ Category scraping complete. Found ${result.products?.length || 0} products`);
    return result;
  }

  /**
   * Get hardcoded category names
   */
  getCategoryNames(): string[] {
    return [...this.CATEGORY_NAMES];
  }

  async scrapeProductDetail(productUrl: string): Promise<any> {
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 60,
      maxConcurrency: 1,
      async requestHandler({ page }) {
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for product details to load
        await page.waitForSelector('.product-single, .product__info, main', { timeout: 10000 }).catch(() => {
          console.log('Product details container not found');
        });
        
        const productDetail = await page.evaluate(() => {
          // Try multiple selectors for description
          const description = 
            document.querySelector('.product__description')?.textContent?.trim() ||
            document.querySelector('.product-description')?.textContent?.trim() ||
            document.querySelector('[itemprop="description"]')?.textContent?.trim() ||
            document.querySelector('.description')?.textContent?.trim();
          
          // Try to find rating
          const rating = 
            document.querySelector('[itemprop="ratingValue"]')?.textContent?.trim() ||
            document.querySelector('.rating-value')?.textContent?.trim() ||
            document.querySelector('.product-rating')?.textContent?.trim();
          
          // Try to find review count
          const reviewCount = 
            document.querySelector('[itemprop="reviewCount"]')?.textContent?.trim() ||
            document.querySelector('.review-count')?.textContent?.trim();
          
          // Extract reviews
          const reviews: Array<{ author: string; rating: number | null; text: string }> = [];
          const reviewSelectors = [
            '.review',
            '.customer-review',
            '.product-review',
            '[itemprop="review"]'
          ];
          
          let reviewElements: NodeListOf<Element> | null = null;
          for (const selector of reviewSelectors) {
            reviewElements = document.querySelectorAll(selector);
            if (reviewElements.length > 0) break;
          }
          
          if (reviewElements) {
            reviewElements.forEach((review) => {
              const author = 
                review.querySelector('.author')?.textContent?.trim() ||
                review.querySelector('.reviewer-name')?.textContent?.trim() ||
                review.querySelector('[itemprop="author"]')?.textContent?.trim();
              
              const ratingText = 
                review.querySelector('.rating')?.textContent?.trim() ||
                review.querySelector('.stars')?.textContent?.trim() ||
                review.querySelector('[itemprop="ratingValue"]')?.textContent?.trim();
              
              const text = 
                review.querySelector('.review-text')?.textContent?.trim() ||
                review.querySelector('.comment')?.textContent?.trim() ||
                review.querySelector('[itemprop="reviewBody"]')?.textContent?.trim();
              
              if (author && text) {
                reviews.push({
                  author,
                  rating: ratingText ? parseInt(ratingText.replace(/[^0-9]/g, '')) : null,
                  text,
                });
              }
            });
          }
          
          // Extract specifications
          const specs: Record<string, string> = {};
          const specSelectors = [
            '.product-specs tr',
            '.product-details tr',
            '.specifications tr',
            '.product__info-list li'
          ];
          
          for (const selector of specSelectors) {
            const specElements = document.querySelectorAll(selector);
            if (specElements.length > 0) {
              specElements.forEach((row) => {
                const label = 
                  row.querySelector('th')?.textContent?.trim() ||
                  row.querySelector('.label')?.textContent?.trim() ||
                  row.querySelector('dt')?.textContent?.trim();
                
                const value = 
                  row.querySelector('td')?.textContent?.trim() ||
                  row.querySelector('.value')?.textContent?.trim() ||
                  row.querySelector('dd')?.textContent?.trim();
                
                if (label && value) {
                  specs[label] = value;
                }
              });
              break;
            }
          }
          
          return {
            description: description || null,
            ratingsAvg: rating ? parseFloat(rating.replace(/[^0-9.]/g, '')) : null,
            reviewsCount: reviewCount ? parseInt(reviewCount.replace(/[^0-9]/g, '')) : reviews.length,
            reviews,
            specs: Object.keys(specs).length > 0 ? specs : null,
          };
        });

        await Dataset.pushData(productDetail);
      },
    });

    await crawler.run([productUrl]);
    const dataset = await Dataset.getData();
    return dataset.items[0] || {};
  }
}