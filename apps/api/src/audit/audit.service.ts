import {
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { Prisma } from '@prisma/client';
import { getPagination } from 'src/common/pagination/pagination.helper';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { buildPaginationResponse } from 'src/common/pagination/pagination-response.helper';

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

  async findAll(pagination: PaginationDto) {
    try {
      const { skip, take } = getPagination(pagination);
      
      const [data, total] = await Promise.all([
        this.databaseService.audit.findMany({
          skip,
          take,
          orderBy: {
            timestamp: 'desc'
          },
        }),
        this.databaseService.audit.count()
      ]);

      return buildPaginationResponse(
        data,
        total,
        pagination
      )
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding audits: ', error);
    }
  }
}
