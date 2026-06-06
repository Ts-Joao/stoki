import { IsNumber } from 'class-validator';

export class DashboardResponseDto {
  @IsNumber()
  totalProducts: number;

  @IsNumber()
  lowStockProducts: number;

  @IsNumber()
  deletedProducts: number;

  @IsNumber()
  movementsToday: number;
}
