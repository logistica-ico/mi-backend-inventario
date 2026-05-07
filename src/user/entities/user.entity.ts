import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryColumn('text')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // No devolver la contraseña en las consultas por defecto
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'text',
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
