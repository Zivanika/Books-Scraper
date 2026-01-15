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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
const query_products_dto_1 = require("./dto/query-products.dto");
const product_id_dto_1 = require("./dto/product-id.dto");
const throttler_1 = require("@nestjs/throttler");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    findAll(query) {
        return this.productService.findAll(query);
    }
    findOne(params) {
        return this.productService.findOne(params.id);
    }
    refreshProduct(params) {
        return this.productService.refreshProduct(params.id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated products' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_products_dto_1.QueryProductsDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid', description: 'Product UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns product details' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger on-demand scrape for product' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid', description: 'Product UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scrape job queued' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "refreshProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('api/v1/products'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map