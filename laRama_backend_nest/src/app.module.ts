import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './utils/db.utils';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ProductsModule,
    ProductModule,
  ],
})
export class AppModule {}
