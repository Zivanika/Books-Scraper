export declare enum ScrapeStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum ScrapeTargetType {
    NAVIGATION = "navigation",
    CATEGORY = "category",
    PRODUCT_LIST = "product_list",
    PRODUCT_DETAIL = "product_detail"
}
export declare class ScrapeJob {
    id: string;
    targetUrl: string;
    targetType: ScrapeTargetType;
    status: ScrapeStatus;
    startedAt: Date;
    finishedAt: Date;
    errorLog: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
