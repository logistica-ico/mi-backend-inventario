import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepo.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Almacén con id "${id}" no encontrado`);
    }
    return warehouse;
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehouseRepo.create({
      id: uuidv4(),
      name: dto.name,
    });
    return this.warehouseRepo.save(warehouse);
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, dto);
    return this.warehouseRepo.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Almacén con id "${id}" no encontrado`);
    }

    // Prevenir eliminar el único almacén
    const total = await this.warehouseRepo.count();
    if (total <= 1) {
      throw new BadRequestException(
        'No puedes eliminar el único almacén existente',
      );
    }

    // Al tener cascade: true, elimina también los productos asociados
    await this.warehouseRepo.remove(warehouse);
  }
}
