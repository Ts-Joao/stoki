import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { AuditService } from 'src/audit/audit.service';
import { AuditAction, EntityType } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateLocationDto, userId: string) {
    try {
      const locationExists = await this.findByName(dto.name);

      if (locationExists) {
        throw new ConflictException('Location already exists');
      }

      const location = await this.databaseService.$transaction(async (tx) => {
        const newLocation = await tx.location.create({
          data: dto
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.LOCATION,
          entityId: newLocation.id.toString(),
          action: AuditAction.CREATE,
          userId,
          details: { name: newLocation.name },
        });

        return newLocation;
      });

      return location;
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating location', error)
    }
  }

  async findAll() {
    try {
      return await this.databaseService.location.findMany()
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding locations', error);
    }
  }

  async findOne(id: number) {
    try {
      const location = await this.databaseService.location.findUnique({
        where: { id },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      return location;
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding location', error);
    }
  }

  async findByName(name: string) {
    try {
      const location = await this.databaseService.location.findUnique({
        where: { name },
      });

      return location;
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding location', error);
    }
  }

  async update(
    id: number,
    dto: UpdateLocationDto,
    userId: string
  ) {
    try {
      await this.findOne(id);

      const location = await this.databaseService.$transaction(async (tx) => {
        const updatedLocation = await tx.location.update({
          where: { id },
          data: dto,
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.LOCATION,
          entityId: updatedLocation.id.toString(),
          action: AuditAction.UPDATE,
          userId,
          details: { name: updatedLocation.name },
        });

        return updatedLocation;
      });

      return location;
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating location', error);
    }
  }

  async delete(id: number, userId: string) {
    try {
      await this.findOne(id);

      const deleteLocation = await this.databaseService.$transaction(async (tx) => {
        const location = await tx.location.delete({
          where: { id },
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.LOCATION,
          entityId: location.id.toString(),
          action: AuditAction.DELETE,
          userId,
          details: { name: location.name },
        });

        return location;
      });

      return deleteLocation;
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting location', error);
    }
  }
}
