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

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateCategoryDto) {
    try {
      const categoryExists = await this.findByName(dto.name);

      if (categoryExists) {
        throw new ConflictException('Category already exists');
      }

      const category = await this.databaseService.category.create({
        data: dto,
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

  async update(id: number, dto: UpdateCategoryDto) {
    try {
      await this.findOne(id);

      const category = await this.databaseService.category.update({
        where: { id },
        data: dto,
      });

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to update category', error)
    }
  }

  async delete(id: number) {
    try {
      await this.findOne(id)

      const category = await this.databaseService.category.delete({
        where: { id },
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
