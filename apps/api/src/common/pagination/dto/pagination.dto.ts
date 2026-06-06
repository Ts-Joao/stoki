import {
  IsInt,
  IsOptional,
  Max,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  offset: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;
}