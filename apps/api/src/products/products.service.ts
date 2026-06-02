import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseServce: DatabaseService ) {}

  async create(dto: CreateProductDto, userId: string) {
    try {
      console.log(userId)
      const product = await this.databaseServce.product.create({
        data: {
          ...dto,
          userId
        }
      })

      console.log(product)

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      console.error(error.message)
      throw new InternalServerErrorException('Error creating product: ', error)
    }
  }

  async findAll() {
    try {
      return this.databaseServce.product.findMany({
        where: {
          deletedAt: null
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error finding products: ', error)
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.databaseServce.product.findUnique({
        where: {
          id
        }
      })

      if (!product) {
        throw new NotFoundException('Product not found')
      }

      return product
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error finding product: ', error)
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      await this.findOne(id)

      return this.databaseServce.product.update({
        where: {
          id
        },
        data: dto
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error updating product: ', error)
    }
  } 
  
  async remove(id: string) {
    try {
      await this.findOne(id)

      return this.databaseServce.product.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date(Date.now() + 30 * 60 * 1000)
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error removing product: ', error)
    }
  }

  async hardDelete(id: string) {
    try {
      await this.findOne(id)

      return this.databaseServce.product.delete({
        where: {
          id
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error hard deleting product: ', error)
    }
  }

  async restore(id: string) {
    try {
      await this.findOne(id)

      return this.databaseServce.product.update({
        where: {
          id
        },
        data: {
          deletedAt: null
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error restoring product: ', error)
    }
  }

  async findAllWithDeleted() {
    try {
      return this.databaseServce.product.findMany({
        where: {
          deletedAt: {
            not: null
          }
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error finding products: ', error)
    }
  }
}
