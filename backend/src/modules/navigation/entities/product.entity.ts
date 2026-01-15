import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { Category } from './category.entity';
  import { ProductDetail } from './product-detail.entity';
  import { Review } from './review.entity';
  
  @Entity('product')
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    @Index()
    sourceId: string;
  
    @Column({ type: 'uuid' })
    @Index()
    categoryId: string;
  
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;
  
    @Column({ type: 'varchar', length: 500 })
    title: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @Column({ type: 'varchar', length: 10, default: 'GBP' })
    currency: string;
  
    @Column({ type: 'text', nullable: true })
    imageUrl: string;
  
    @Column({ type: 'varchar', length: 500, unique: true })
    @Index()
    sourceUrl: string;
  
    @Column({ type: 'timestamp', nullable: true })
    @Index()
    lastScrapedAt: Date;
  
    @OneToOne(() => ProductDetail, (detail) => detail.product, { cascade: true })
    detail: ProductDetail;
  
    @OneToMany(() => Review, (review) => review.product, { cascade: true })
    reviews: Review[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }