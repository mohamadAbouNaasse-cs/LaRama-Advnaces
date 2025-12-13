import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<ProductEntity | null> {
    return this.repo.findOneBy({ id });
  }

  create(product: Partial<ProductEntity>) {
    const ent = this.repo.create(product as ProductEntity);
    return this.repo.save(ent);
  }
}
