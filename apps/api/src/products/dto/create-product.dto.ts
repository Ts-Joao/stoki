import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string

  @IsNumber()
  @IsNotEmpty()
  readonly stock: number

  @IsOptional()
  @IsNumber()
  readonly minStock?: number

  @IsNumber()
  @IsNotEmpty()
  readonly locationId: number

  @IsNumber()
  @IsNotEmpty()
  readonly categoryId: number
}