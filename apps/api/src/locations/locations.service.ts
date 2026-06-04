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

@Injectable()
export class LocationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateLocationDto) {
    try {
      const locationExists = await this.findByName(dto.name);

      if (locationExists) {
        throw new ConflictException('Location already exists');
      }

      const location = await this.databaseService.location.create({
        data: dto
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
      return this.databaseService.location.findMany()
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

  async update(id: number, dto: UpdateLocationDto) {
    try {
      await this.findOne(id);

      return this.databaseService.location.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating location', error);
    }
  }

  async delete(id: number) {
    try {
      await this.findOne(id);

      return this.databaseService.location.delete({
        where: { id },
      });
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting location', error);
    }
  }
}
