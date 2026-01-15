import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
  // import { CacheInterceptor } from '@nestjs/cache-manager';
  import { ProductService } from './product.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { QueryProductsDto } from './dto/query-products.dto';
  import { ProductIdDto } from './dto/product-id.dto';
  import { ThrottlerGuard } from '@nestjs/throttler';
  
  @ApiTags('products')
  @Controller('api/v1/products')
  @UseGuards(ThrottlerGuard)
  // @UseInterceptors(CacheInterceptor)
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all products with filtering and pagination' })
    @ApiResponse({ status: 200, description: 'Returns paginated products' })
    @ApiResponse({ status: 400, description: 'Invalid query parameters' })
    findAll(@Query() query: QueryProductsDto) {
      return this.productService.findAll(query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Product UUID' })
    @ApiResponse({ status: 200, description: 'Returns product details' })
    @ApiResponse({ status: 400, description: 'Invalid UUID format' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param() params: ProductIdDto) {
      return this.productService.findOne(params.id);
    }
  
    @Post(':id/refresh')
    @ApiOperation({ summary: 'Trigger on-demand scrape for product' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Product UUID' })
    @ApiResponse({ status: 200, description: 'Scrape job queued' })
    @ApiResponse({ status: 400, description: 'Invalid UUID format' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    refreshProduct(@Param() params: ProductIdDto) {
      return this.productService.refreshProduct(params.id);
    }
  }