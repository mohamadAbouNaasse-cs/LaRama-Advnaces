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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductService = class ProductService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find();
    }
    async findOne(id) {
        return this.repo.findOneBy({ id });
    }
    async create(input) {
        const ent = this.repo.create({
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            imageUrl: input.imageUrl ?? null,
            category: input.category ?? null,
            stockQuantity: input.stockQuantity ?? 0,
            isActive: typeof input.isActive === 'boolean' ? input.isActive : true,
        });
        return this.repo.save(ent);
    }
    async update(input) {
        const existing = await this.repo.findOneBy({ id: input.id });
        if (!existing)
            throw new common_1.NotFoundException('Product not found');
        const merged = this.repo.merge(existing, {
            name: input.name ?? existing.name,
            description: input.description ?? existing.description,
            price: input.price ?? existing.price,
            imageUrl: input.imageUrl ?? existing.imageUrl,
            category: input.category ?? existing.category,
            stockQuantity: input.stockQuantity ?? existing.stockQuantity,
            isActive: typeof input.isActive === 'boolean' ? input.isActive : existing.isActive,
        });
        return this.repo.save(merged);
    }
    async remove(id) {
        const existing = await this.repo.findOneBy({ id });
        if (!existing)
            throw new common_1.NotFoundException('Product not found');
        await this.repo.remove(existing);
        return existing;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map