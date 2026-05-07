import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateWarehouseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del almacén es requerido' })
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  name?: string;
}
