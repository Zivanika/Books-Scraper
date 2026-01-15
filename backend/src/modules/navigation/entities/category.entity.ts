import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { Navigation } from './navigation.entity';
  import { Product } from './product.entity';
  
  @Entity('category')
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    navigationId: string;
  
    @ManyToOne(() => Navigation, (navigation) => navigation.categories)
    @JoinColumn({ name: 'navigationId' })
    navigation: Navigation;
  
    @Column({ type: 'uuid', nullable: true })
    @Index()
    parentId: string;
  
    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category;
  
    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'varchar', length: 255 })
    @Index()
    slug: string;
  
    @Column({ type: 'varchar', length: 500, nullable: true })
    sourceUrl: string;
  
    @Column({ type: 'int', default: 0 })
    productCount: number;
  
    @Column({ type: 'timestamp', nullable: true })
    @Index()
    lastScrapedAt: Date;
  
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }