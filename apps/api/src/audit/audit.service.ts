import {
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAudit(
    tx: Prisma.TransactionClient,
    data: CreateAuditDto
  ) {
    try {
      return tx.audit.create({
        data: {
          ...data
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating audit: ', error);
    }
  }

  async findAll() {
    try {
      return await this.databaseService.audit.findMany({
        orderBy: {
          timestamp: 'desc'
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding audits: ', error);
    }
  }
}
