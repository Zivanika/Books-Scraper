import { IsOptional, IsString, IsNumber, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProductsDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false, description: 'Category UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiProperty({ example: 'Harry Potter', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 5.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ example: 20.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ example: 'J.K. Rowling', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ example: 4.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;
}
