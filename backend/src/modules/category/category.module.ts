import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../navigation/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
