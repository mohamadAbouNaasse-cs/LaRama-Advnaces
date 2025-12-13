import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => ProductEntity)
@UseGuards(AdminGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductEntity])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductEntity, { nullable: true })
  product(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductEntity)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input as any);
  }

  @Mutation(() => ProductEntity)
  updateProduct(@Args('input') input: UpdateProductInput) {
    return this.productService.update(input as any);
  }

  @Mutation(() => ProductEntity)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }
}
