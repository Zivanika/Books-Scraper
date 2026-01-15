import { ProductService } from './product.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { ProductIdDto } from './dto/product-id.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(query: QueryProductsDto): Promise<{
        items: import("../navigation/entities/product.entity").Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(params: ProductIdDto): Promise<import("../navigation/entities/product.entity").Product>;
    refreshProduct(params: ProductIdDto): Promise<import("../navigation/entities/product.entity").Product>;
}
