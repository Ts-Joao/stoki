import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DashboardResponseDto {
  @ApiProperty({
    example: 10,
    description: 'Total products',
  })
  @IsNumber()
  totalProducts: number;

  @ApiProperty({
    example: 5,
    description: 'Low stock products',
  })
  @IsNumber()
  lowStockProducts: number;

  @ApiProperty({
    example: 2,
    description: 'Deleted products',
  })
  @IsNumber()
  deletedProducts: number;

  @ApiProperty({
    example: 3,
    description: 'Movements today',
  })
  @IsNumber()
  movementsToday: number;
}
