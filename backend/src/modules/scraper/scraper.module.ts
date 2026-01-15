import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraper.service';
import { ScraperProcessor } from './scraper.processor';
import { ScraperController } from './scraper.controller';
import { ScrapeJob } from '../navigation/entities/scrape-job.entity';
import { Product } from '../navigation/entities/product.entity';
import { Category } from '../navigation/entities/category.entity';
import { Navigation } from '../navigation/entities/navigation.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScrapeJob,
      Product,
      Category,
      Navigation,
      ProductDetail,
      Review,
    ]),
    BullModule.registerQueue({
      name: 'scraper',
    }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService, ScraperProcessor],
  exports: [ScraperService],
})
export class ScraperModule {}
