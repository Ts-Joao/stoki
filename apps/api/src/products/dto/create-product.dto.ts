import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product name',
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  readonly description?: string

  @ApiProperty({
    example: 10,
    description: 'Product stock',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly stock: number

  @ApiProperty({
    example: 5,
    description: 'Product minimum stock',
  })
  @IsOptional()
  @IsNumber()
  readonly minStock?: number

  @ApiProperty({
    example: 1,
    description: 'Product location id',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly locationId: number

  @ApiProperty({
    example: 1,
    description: 'Product category id',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly categoryId: number
}