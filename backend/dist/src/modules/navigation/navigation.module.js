"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const navigation_entity_1 = require("./entities/navigation.entity");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const product_detail_entity_1 = require("./entities/product-detail.entity");
const review_entity_1 = require("./entities/review.entity");
const scrape_job_entity_1 = require("./entities/scrape-job.entity");
let NavigationModule = class NavigationModule {
};
exports.NavigationModule = NavigationModule;
exports.NavigationModule = NavigationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                navigation_entity_1.Navigation,
                category_entity_1.Category,
                product_entity_1.Product,
                product_detail_entity_1.ProductDetail,
                review_entity_1.Review,
                scrape_job_entity_1.ScrapeJob,
            ]),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], NavigationModule);
//# sourceMappingURL=navigation.module.js.map