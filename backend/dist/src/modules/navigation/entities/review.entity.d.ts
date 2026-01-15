import { Product } from './product.entity';
export declare class Review {
    id: string;
    productId: string;
    product: Product;
    author: string;
    rating: number;
    text: string;
    createdAt: Date;
}
