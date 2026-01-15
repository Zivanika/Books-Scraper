import { Product } from './product.entity';
export declare class ProductDetail {
    id: string;
    productId: string;
    product: Product;
    description: string;
    specs: Record<string, any>;
    ratingsAvg: number;
    reviewsCount: number;
    recommendedProducts: string[];
}
