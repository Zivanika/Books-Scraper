import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '../navigation/entities/product.entity';
import { ProductDetail } from '../navigation/entities/product-detail.entity';
import { Review } from '../navigation/entities/review.entity';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail, Review]),
    ScraperModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
