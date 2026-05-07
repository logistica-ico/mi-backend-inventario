import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.warehouse, {
    cascade: true,
    eager: false,
  })
  products: Product[];
}
