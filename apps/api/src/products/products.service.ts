import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LocationsService } from 'src/locations/locations.service';
import { CategoriesService } from 'src/categories/categories.service';
import { TypeCreateMoviment } from '../movements/types/create-moviment.type';
import { AuditAction, EntityType, Prisma, Product, StockMoventType } from '@prisma/client';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly databaseServce: DatabaseService,
    private readonly categoriesService: CategoriesService,
    private readonly locationsService: LocationsService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateProductDto, userId: string) {
    try {
      await this.categoriesService.findOne(dto.categoryId);
      await this.locationsService.findOne(dto.locationId);

      const product = await this.databaseServce.$transaction(async (tx) => {
        const newProduct = await tx.product.create({
          data: {
            ...dto,
            userId,
          },
        });

        await this.createStockMovement(tx, {
          productId: newProduct.id,
          userId,
          quantity: dto.stock,
          type: 'IN',
          note: dto.description ?? 'Produto adicionado ao estoque',
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.PRODUCT,
          entityId: newProduct.id,
          action: AuditAction.CREATE,
          userId,
          details: { stock: dto.stock },
        });

        return newProduct;
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating product: ', error);
    }
  }

  async findAll() {
    try {
      return await this.databaseServce.product.findMany({
        where: {
          deletedAt: null,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding products: ', error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.databaseServce.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding product: ', error);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);

      let movType: StockMoventType = 'ADJUSTMENT';
      let quantityDiff: number;
      let note: string = 'Produto ajustado';

      const updatedProduct = await this.databaseServce.$transaction(
        async (tx) => {
          if (dto.stock !== undefined && dto.stock > 0) {
            const movement = this.getStockAdjustment(product, dto.stock);

            if (movement) {
              movType = movement.type;
              quantityDiff = movement.diff;
              note = movement.note;
            }
          }

          const productUpdated = await tx.product.update({
            where: {
              id,
            },
            data: dto,
          });

          await this.createStockMovement(tx, {
            productId: productUpdated.id,
            userId: productUpdated.userId,
            quantity: quantityDiff,
            note: note,
            type: movType,
          });

          await this.auditService.createAudit(tx, {
            entityType: EntityType.PRODUCT,
            entityId: productUpdated.id,
            action: AuditAction.UPDATE,
            userId: productUpdated.userId,
            details: {
              oldStock: product.stock,
              newStock: productUpdated.stock,
              difference: quantityDiff,
              type: movType,
              note,
            },
          });

          return productUpdated;
        },
      );

      return updatedProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating product: ', error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return this.databaseServce.$transaction(async (tx) => {
        const productUpdated = await tx.product.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(Date.now() + 30 * 60 * 1000),
          },
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.PRODUCT,
          entityId: productUpdated.id,
          action: AuditAction.DELETE,
          userId: productUpdated.userId,
          details: { stock: productUpdated.stock },
        });

        return productUpdated;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error removing product: ', error);
    }
  }

  async restore(id: string) {
    try {
      await this.findOne(id);

      return this.databaseServce.$transaction(async (tx) => {
        const productUpdated = await tx.product.update({
          where: {
            id,
          },
          data: {
            deletedAt: null,
          },
        });

        await this.auditService.createAudit(tx, {
          entityType: EntityType.PRODUCT,
          entityId: productUpdated.id,
          action: AuditAction.RESTORE,
          userId: productUpdated.userId,
          details: { stock: productUpdated.stock },
        });

        return productUpdated;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error restoring product: ',
        error,
      );
    }
  }

  async findAllWithDeleted() {
    try {
      const products = await this.databaseServce.product.findMany({
        where: {
          deletedAt: { not: null },
        },
      });

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding products: ', error);
    }
  }

  private async createStockMovement(
    tx: Prisma.TransactionClient,
    data: TypeCreateMoviment,
  ) {
    return tx.stockMovent.create({ data });
  }

  private getStockAdjustment(product: Product, dtoStock: number) {
    return this.calculateStockDifference(dtoStock, product.stock);
  }

  private calculateStockDifference(newStock: number, oldStock: number) {
    if (newStock > oldStock) {
      return { diff: newStock - oldStock, type: 'IN' as StockMoventType, note: 'Produto adicionado ao estoque' };
    }

    if (newStock < oldStock) {
      return { diff: oldStock - newStock, type: 'OUT' as StockMoventType, note: 'Produto abaixado do estoque' };
    }

    return null;
  }
}
