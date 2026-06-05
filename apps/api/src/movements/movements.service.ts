import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MovementsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    try {
      return this.databaseService.stockMovent.findMany()
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error finding movements: ', error)
    }
  }

  async findOne(id: string) {
    try {
      const movement = await this.databaseService.stockMovent.findUnique({
        where: { id }
      })

      if (!movement) {
        throw new NotFoundException('Movement not found')
      }

      return movement
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error finding movement: ', error)
    }
  }
}
