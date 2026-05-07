import {
  IsArray,
  IsUUID,
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsInt,
  Min,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkDeleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  ids: string[];
}

export class MergeProductsDto {
  @IsUUID()
  targetId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  sourceIds: string[];
}

class ImportProductItemDto {
  @IsString()
  @IsNotEmpty()
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
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  minThreshold: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class ImportProductsDto {
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportProductItemDto)
  @ArrayMinSize(1)
  products: ImportProductItemDto[];
}
