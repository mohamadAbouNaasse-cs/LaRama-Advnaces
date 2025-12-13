import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => ProductEntity)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductEntity])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductEntity, { nullable: true })
  product(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductEntity)
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input as any);
  }
}
