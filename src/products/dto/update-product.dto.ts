import { IsString, IsInt, IsNumber, Min, Max, MaxLength, IsUUID, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

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
  @IsOptional()
  quantity?: number;

  @IsInt()
  @Min(0, { message: 'El umbral mínimo no puede ser negativo' })
  @IsOptional()
  minThreshold?: number;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(5)
  imageZoom?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  imagePositionX?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  imagePositionY?: number;
}
