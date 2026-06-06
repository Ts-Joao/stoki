import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { AuditAction, EntityType } from '@prisma/client';

export class CreateAuditDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsEnum(AuditAction)
  action: AuditAction;

  @IsString()
  entityId: string;

  @IsObject()
  @IsOptional()
  details?: object;

  @IsString()
  @IsOptional()
  userId?: string;
}