import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WarehousesService } from '../warehouses/warehouses.service';
import { ProductsService } from '../products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';

/**
 * Script de seed: crea el almacén "Principal" y productos de ejemplo si la BD está vacía.
 * Ejecutar con: npx ts-node -r tsconfig-paths/register src/scripts/seed.ts
 */
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const warehouseRepo = app.get<Repository<Warehouse>>(
    getRepositoryToken(Warehouse),
  );
  const userRepo = app.get<Repository<User>>(
    getRepositoryToken(User),
  );
  const warehousesService = app.get(WarehousesService);
  const productsService = app.get(ProductsService);
  const userService = app.get(UserService);

  // Crear Admin por defecto si no hay usuarios
  const userCount = await userRepo.count();
  if (userCount === 0) {
    await userService.create({
      email: 'admin@inventario.com',
      password: 'admin1234',
      fullName: 'Administrador del Sistema',
      role: UserRole.ADMIN,
    });
    console.log('✅ Usuario Administrador creado: admin@inventario.com / admin1234');
  }

  // Si ya hay almacenes, no hacer nada
  const count = await warehouseRepo.count();
  if (count > 0) {
    console.log('✅ La base de datos ya tiene datos. Seed omitido.');
    await app.close();
    return;
  }

  // Crear almacén principal
  const warehouse = await warehousesService.create({ name: 'Principal' });
  console.log(`✅ Almacén creado: ${warehouse.name} (${warehouse.id})`);

  // Crear productos de ejemplo
  const sampleProducts = [
    { name: 'Papel A4 Repuesto', category: 'Papelería', quantity: 15, minThreshold: 20, warehouseId: warehouse.id },
    { name: 'Tóner Impresora L3110', category: 'Suministros', quantity: 2, minThreshold: 3, warehouseId: warehouse.id },
    { name: 'Lapiceros Azul (Caja)', category: 'Papelería', quantity: 50, minThreshold: 10, warehouseId: warehouse.id },
    { name: 'Carpetas Manila', category: 'Papelería', quantity: 30, minThreshold: 10, warehouseId: warehouse.id },
    { name: 'Engrapadora Estándar', category: 'Equipo de Oficina', quantity: 8, minThreshold: 3, warehouseId: warehouse.id },
    { name: 'USB 32GB Kingston', category: 'Electrónica', quantity: 0, minThreshold: 5, warehouseId: warehouse.id },
  ];

  for (const p of sampleProducts) {
    await productsService.create(p);
  }
  console.log(`✅ ${sampleProducts.length} productos de ejemplo creados.`);

  await app.close();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
