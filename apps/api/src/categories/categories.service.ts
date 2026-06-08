import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuditService } from 'src/audit/audit.service';
import { AuditAction, EntityType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateCategoryDto, userId: string) {
    try {
      const categoryExists = await this.findByName(dto.name);

      if (categoryExists) {
        throw new ConflictException('Category already exists');
      }

      const category = await this.databaseService.$transaction(async (tx) => {
        const newCategory = await tx.category.create({
          data: dto,
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.CATEGORY,
          entityId: newCategory.id.toString(),
          action: AuditAction.CREATE,
          userId,
          details: { name: newCategory.name },
        });

        return newCategory;
      });

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to create category', error)
    }
  }

  async findAll() {
    try {
      const categories = await this.databaseService.category.findMany();

      return categories;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to find all categories', error)
    }
  }

  async findByName(name: string) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { name }
      });

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to find category', error)
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to find category', error)
    }
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    userId: string
  ) {
    try {
      await this.findOne(id);

      const category = await this.databaseService.$transaction(async (tx) => {
        const updatedCategory = await tx.category.update({
          where: { id },
          data: dto,
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.CATEGORY,
          entityId: updatedCategory.id.toString(),
          action: AuditAction.UPDATE,
          userId,
          details: { name: updatedCategory.name },
        });

        return updatedCategory;
      });

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to update category', error)
    }
  }

  async delete(id: number, userId: string) {
    try {
      await this.findOne(id)

      const category = await this.databaseService.$transaction(async (tx) => {
        const deletedCategory = await tx.category.delete({
          where: { id },
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.CATEGORY,
          entityId: deletedCategory.id.toString(),
          action: AuditAction.DELETE,
          userId,
          details: { name: deletedCategory.name },
        });

        return deletedCategory;
      });

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to delete category', error)
    }
  }
}
