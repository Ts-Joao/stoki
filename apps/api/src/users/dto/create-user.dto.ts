import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'password',
    description: 'User password',
  })
  @IsString()
  password: string;
}