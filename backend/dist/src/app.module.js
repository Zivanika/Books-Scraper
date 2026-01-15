"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const throttler_1 = require("@nestjs/throttler");
const database_config_1 = require("./config/database.config");
const product_module_1 = require("./modules/product/product.module");
const category_module_1 = require("./modules/category/category.module");
const navigation_module_1 = require("./modules/navigation/navigation.module");
const scraper_module_1 = require("./modules/scraper/scraper.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot((0, database_config_1.databaseConfig)()),
            bull_1.BullModule.forRoot({
                redis: (() => {
                    if (process.env.REDIS_URL) {
                        try {
                            const url = new URL(process.env.REDIS_URL);
                            const config = {
                                host: url.hostname,
                                port: parseInt(url.port || '6379', 10),
                            };
                            if (url.password) {
                                config.password = url.password;
                            }
                            else if (url.username && url.username !== 'default') {
                                config.password = url.username;
                            }
                            if (url.protocol === 'rediss:') {
                                config.tls = {};
                            }
                            return config;
                        }
                        catch (error) {
                            console.warn('Failed to parse REDIS_URL, falling back to host/port');
                        }
                    }
                    const config = {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379', 10),
                    };
                    if (process.env.REDIS_PASSWORD) {
                        config.password = process.env.REDIS_PASSWORD;
                    }
                    return config;
                })(),
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            navigation_module_1.NavigationModule,
            scraper_module_1.ScraperModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map