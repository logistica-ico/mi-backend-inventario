import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    // Carga variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuración de SQLite con TypeORM
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || './database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // En producción usar migrations
      logging: false,
    }),

    WarehousesModule,
    ProductsModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
