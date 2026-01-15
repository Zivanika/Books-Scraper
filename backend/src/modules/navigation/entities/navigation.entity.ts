import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  import { Category } from './category.entity';
  
  @Entity('navigation')
  export class Navigation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    @Index()
    slug: string;
  
    @Column({ type: 'varchar', length: 500, nullable: true })
    sourceUrl: string;
  
    @Column({ type: 'timestamp', nullable: true })
    @Index()
    lastScrapedAt: Date;
  
    @OneToMany(() => Category, (category) => category.navigation)
    categories: Category[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }