import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user_settings')
export class UserSetting {
  @PrimaryColumn('text')
  key: string;

  @Column({ type: 'text' })
  value: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
