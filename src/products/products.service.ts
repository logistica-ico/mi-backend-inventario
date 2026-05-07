import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  BulkDeleteDto,
  MergeProductsDto,
  ImportProductsDto,
} from './dto/bulk-operations.dto';

export interface ProductQueryParams {
  warehouseId?: string;
  search?: string;
  status?: 'all' | 'low' | 'out';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(params: ProductQueryParams): Promise<Product[]> {
    const { warehouseId, search, status } = params;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .orderBy('product.updatedAt', 'DESC');

    if (warehouseId) {
      qb.andWhere('product.warehouseId = :warehouseId', { warehouseId });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.category) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const products = await qb.getMany();

    // Filtrar por status en memoria (más simple para SQLite)
    if (status === 'low') {
      return products.filter(
        (p) => p.quantity > 0 && p.quantity <= p.minThreshold,
      );
    }
    if (status === 'out') {
      return products.filter((p) => p.quantity === 0);
    }

    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      id: uuidv4(),
      ...dto,
      quantity: Math.max(0, dto.quantity),
      minThreshold: Math.max(0, dto.minThreshold),
    });
    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Validar y normalizar campos numéricos
    if (dto.quantity !== undefined) {
      dto.quantity = Math.max(0, dto.quantity);
    }
    if (dto.minThreshold !== undefined) {
      dto.minThreshold = Math.max(0, dto.minThreshold);
    }
    if (dto.imageZoom !== undefined) {
      dto.imageZoom = Math.max(0.1, Math.min(5, dto.imageZoom));
    }
    if (dto.imagePositionX !== undefined) {
      dto.imagePositionX = Math.max(0, Math.min(100, dto.imagePositionX));
    }
    if (dto.imagePositionY !== undefined) {
      dto.imagePositionY = Math.max(0, Math.min(100, dto.imagePositionY));
    }

    console.log('Actualizando producto:', {
      id,
      dto,
      currentProduct: {
        imageZoom: product.imageZoom,
        imagePositionX: product.imagePositionX,
        imagePositionY: product.imagePositionY
      }
    });

    Object.assign(product, dto);
    await this.productRepo.save(product);
    
    const updatedProduct = await this.findOne(id);
    console.log('Producto actualizado exitosamente:', {
      id,
      imageZoom: updatedProduct.imageZoom,
      imagePositionX: updatedProduct.imagePositionX,
      imagePositionY: updatedProduct.imagePositionY
    });
    
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  // POST /api/products/bulk-delete
  async bulkDelete(dto: BulkDeleteDto): Promise<{ deleted: number }> {
    const result = await this.productRepo.delete({ id: In(dto.ids) });
    return { deleted: result.affected || 0 };
  }

  // POST /api/products/merge
  async mergeProducts(dto: MergeProductsDto): Promise<Product> {
    const { targetId, sourceIds } = dto;

    // Verificar que el target exista
    const target = await this.findOne(targetId);

    // Obtener fuentes
    const sources = await this.productRepo.find({
      where: { id: In(sourceIds) },
    });

    if (sources.length === 0) {
      throw new BadRequestException(
        'No se encontraron productos fuente válidos',
      );
    }

    if (sourceIds.includes(targetId)) {
      throw new BadRequestException(
        'El producto destino no puede estar en la lista de fuentes',
      );
    }

    // Sumar cantidades
    const totalQuantity = sources.reduce((sum, p) => sum + p.quantity, 0);
    target.quantity = target.quantity + totalQuantity;

    await this.productRepo.remove(sources);
    return this.productRepo.save(target);
  }

  // POST /api/products/import
  async importProducts(dto: ImportProductsDto): Promise<Product[]> {
    const products = dto.products.map((item) =>
      this.productRepo.create({
        id: uuidv4(),
        warehouseId: dto.warehouseId,
        name: item.name,
        category: item.category || 'General',
        brand: item.brand,
        unit: item.unit || 'unidades',
        quantity: Math.max(0, item.quantity),
        minThreshold: Math.max(0, item.minThreshold),
        imageUrl: item.imageUrl,
      }),
    );
    return this.productRepo.save(products);
  }
}
