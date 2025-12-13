import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'products' })
export class ProductEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;
}
