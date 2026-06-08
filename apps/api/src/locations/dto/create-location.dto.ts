import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: 'Location name',
    description: 'Location name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}