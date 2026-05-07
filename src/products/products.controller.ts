import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  BulkDeleteDto,
  MergeProductsDto,
  ImportProductsDto,
} from './dto/bulk-operations.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/products?warehouseId=&search=&status=
  @Get()
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'all' | 'low' | 'out',
  ) {
    return this.productsService.findAll({ warehouseId, search, status });
  }

  // GET /api/products/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // POST /api/products
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // POST /api/products/bulk-delete
  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() dto: BulkDeleteDto) {
    return this.productsService.bulkDelete(dto);
  }

  // POST /api/products/merge
  @Post('merge')
  @HttpCode(HttpStatus.OK)
  merge(@Body() dto: MergeProductsDto) {
    return this.productsService.mergeProducts(dto);
  }

  // POST /api/products/import
  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  import(@Body() dto: ImportProductsDto) {
    return this.productsService.importProducts(dto);
  }

  // PATCH /api/products/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /api/products/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
