import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'products' })
export class ProductEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true, name: 'description' })
  description?: string | null;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'price' })
  price: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 1024, nullable: true, name: 'image_url' })
  imageUrl?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'category' })
  category?: string | null;

  @Field()
  @Column({ type: 'int', default: 1, name: 'stock_quantity' })
  stockQuantity: number;

  @Field()
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
