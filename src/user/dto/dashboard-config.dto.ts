import { IsArray, IsNotEmpty } from 'class-validator';

export class DashboardConfigDto {
  @IsArray()
  @IsNotEmpty()
  config: any[];
}
