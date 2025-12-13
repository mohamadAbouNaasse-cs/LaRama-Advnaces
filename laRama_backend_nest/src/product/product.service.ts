import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async create(input: CreateProductInput): Promise<ProductEntity> {
    const ent = this.repo.create({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      imageUrl: input.imageUrl ?? null,
      category: input.category ?? null,
      stockQuantity: input.stockQuantity ?? 1,
      isActive: typeof input.isActive === 'boolean' ? input.isActive : true,
    } as Partial<ProductEntity>);

    return this.repo.save(ent);
  }

  async update(input: UpdateProductInput): Promise<ProductEntity> {
    const existing = await this.repo.findOneBy({ id: input.id });
    if (!existing) throw new NotFoundException('Product not found');

    const merged = this.repo.merge(existing, {
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      price: input.price ?? existing.price,
      imageUrl: input.imageUrl ?? existing.imageUrl,
      category: input.category ?? existing.category,
      stockQuantity: input.stockQuantity ?? existing.stockQuantity,
      isActive: typeof input.isActive === 'boolean' ? input.isActive : existing.isActive,
    } as Partial<ProductEntity>);

    return this.repo.save(merged);
  }

  async remove(id: string): Promise<ProductEntity> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Product not found');
    await this.repo.remove(existing);
    return existing;
  }
}
