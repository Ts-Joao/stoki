import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { AuditAction, EntityType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditDto {
  @ApiProperty({
    example: EntityType.PRODUCT,
    description: 'Entity type',
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({
    example: AuditAction.CREATE,
    description: 'Audit action',
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    example: 'entity id',
    description: 'Entity id',
  })
  @IsString()
  entityId: string;

  @ApiProperty({
    example: {},
    description: 'Audit details',
  })
  @IsObject()
  @IsOptional()
  details?: object;

  @ApiProperty({
    example: 'user id',
    description: 'User id',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}