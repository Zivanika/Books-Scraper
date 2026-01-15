import { Navigation } from './navigation.entity';
import { Product } from './product.entity';
export declare class Category {
    id: string;
    navigationId: string;
    navigation: Navigation;
    parentId: string;
    parent: Category;
    children: Category[];
    title: string;
    slug: string;
    sourceUrl: string;
    productCount: number;
    lastScrapedAt: Date;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
