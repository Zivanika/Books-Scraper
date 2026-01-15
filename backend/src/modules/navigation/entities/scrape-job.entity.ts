import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum ScrapeStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
  }
  
  export enum ScrapeTargetType {
    NAVIGATION = 'navigation',
    CATEGORY = 'category',
    PRODUCT_LIST = 'product_list',
    PRODUCT_DETAIL = 'product_detail',
  }
  
  @Entity('scrape_job')
  export class ScrapeJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 500 })
    @Index()
    targetUrl: string;
  
    @Column({ type: 'enum', enum: ScrapeTargetType })
    targetType: ScrapeTargetType;
  
    @Column({ type: 'enum', enum: ScrapeStatus, default: ScrapeStatus.PENDING })
    @Index()
    status: ScrapeStatus;
  
    @Column({ type: 'timestamp', nullable: true })
    startedAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    finishedAt: Date;
  
    @Column({ type: 'text', nullable: true })
    errorLog: string;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }