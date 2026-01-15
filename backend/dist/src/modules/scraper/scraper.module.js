"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const scraper_service_1 = require("./scraper.service");
const scraper_processor_1 = require("./scraper.processor");
const scraper_controller_1 = require("./scraper.controller");
const scrape_job_entity_1 = require("../navigation/entities/scrape-job.entity");
const product_entity_1 = require("../navigation/entities/product.entity");
const category_entity_1 = require("../navigation/entities/category.entity");
const navigation_entity_1 = require("../navigation/entities/navigation.entity");
const product_detail_entity_1 = require("../navigation/entities/product-detail.entity");
const review_entity_1 = require("../navigation/entities/review.entity");
let ScraperModule = class ScraperModule {
};
exports.ScraperModule = ScraperModule;
exports.ScraperModule = ScraperModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                scrape_job_entity_1.ScrapeJob,
                product_entity_1.Product,
                category_entity_1.Category,
                navigation_entity_1.Navigation,
                product_detail_entity_1.ProductDetail,
                review_entity_1.Review,
            ]),
            bull_1.BullModule.registerQueue({
                name: 'scraper',
            }),
        ],
        controllers: [scraper_controller_1.ScraperController],
        providers: [scraper_service_1.ScraperService, scraper_processor_1.ScraperProcessor],
        exports: [scraper_service_1.ScraperService],
    })
], ScraperModule);
//# sourceMappingURL=scraper.module.js.map