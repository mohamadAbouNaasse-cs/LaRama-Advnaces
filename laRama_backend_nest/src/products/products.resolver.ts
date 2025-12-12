import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductsService, Product } from './products.service';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class ProductType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  description?: string;
}

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [ProductType])
  products(): Product[] {
    return this.productsService.findAll();
  }

  @Query(() => ProductType, { nullable: true })
  product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOne(id);
  }
}
