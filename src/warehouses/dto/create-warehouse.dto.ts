import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del almacén es requerido' })
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
