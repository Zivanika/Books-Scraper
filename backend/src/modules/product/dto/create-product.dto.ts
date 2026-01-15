import { IsString, IsNumber, IsOptional, IsUrl, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'WOB-12345' })
  @IsString()
  sourceId: string;

  @ApiProperty({ example: 'uuid-category-id' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Harry Potter and the Philosopher\'s Stone' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.K. Rowling', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'GBP' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.worldofbooks.com/product/12345' })
  @IsUrl()
  sourceUrl: string;
}