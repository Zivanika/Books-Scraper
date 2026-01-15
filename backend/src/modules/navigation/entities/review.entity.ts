import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { Product } from './product.entity';
  
  @Entity('review')
  export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    productId: string;
  
    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: 'productId' })
    product: Product;
  
    @Column({ type: 'varchar', length: 255 })
    author: string;
  
    @Column({ type: 'int' })
    rating: number;
  
    @Column({ type: 'text', nullable: true })
    text: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }