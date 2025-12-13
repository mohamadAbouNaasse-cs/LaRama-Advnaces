"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
let ProductEntity = class ProductEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2, name: 'price' }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 1024, nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'category' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'stock_quantity' }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "stockQuantity", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], ProductEntity.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "updatedAt", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'products' })
], ProductEntity);
//# sourceMappingURL=product.entity.js.map