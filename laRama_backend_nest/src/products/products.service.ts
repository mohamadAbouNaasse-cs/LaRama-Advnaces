import { Injectable } from '@nestjs/common';

export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Sample Product A', price: 19.99, description: 'Example product' },
    { id: 2, name: 'Sample Product B', price: 29.99 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
