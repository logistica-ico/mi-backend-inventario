import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  MaxLength,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @MaxLength(200)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  unit?: string;

  @IsInt()
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  quantity: number;

  @IsInt()
  @Min(0, { message: 'El umbral mínimo no puede ser negativo' })
  minThreshold: number;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  imageZoom?: number;
}
