import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity('products')
export class Product {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', default: 'General' })
  category: string;

  @Column({ type: 'text', nullable: true })
  brand: string;

  @Column({ type: 'text', default: 'unidades' })
  unit: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'integer', name: 'min_threshold', default: 5 })
  minThreshold: number;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'float', name: 'image_zoom', default: 1 })
  imageZoom: number;

  @Column({ type: 'float', name: 'image_position_x', default: 0 })
  imagePositionX: number;

  @Column({ type: 'float', name: 'image_position_y', default: 0 })
  imagePositionY: number;

  @Column({ type: 'integer', nullable: true, name: 'order_index' })
  order: number;

  @Column({ type: 'text', name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
