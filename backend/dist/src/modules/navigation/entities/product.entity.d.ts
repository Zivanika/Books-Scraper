import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';
export declare class Product {
    id: string;
    sourceId: string;
    categoryId: string;
    category: Category;
    title: string;
    author: string;
    price: number;
    currency: string;
    imageUrl: string;
    sourceUrl: string;
    lastScrapedAt: Date;
    detail: ProductDetail;
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
}
