import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getStats(): Promise<DashboardResponseDto> {
    try {
      const [totalProducts, lowStockProducts, deletedProducts, movementsToday] =
        await Promise.all([
          this.getAllProducts(),
          this.getLowStockProducts(),
          this.getDeletedProducts(),
          this.getMovementsToday(),
        ]);

      return {
        totalProducts,
        lowStockProducts,
        deletedProducts,
        movementsToday,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get dashboard data');
    }
  }

  async getAllProducts() {
    try {
      const products = await this.databaseService.product.count({
        where: { deletedAt: null },
      });

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // console.error(error)
      throw new InternalServerErrorException('Failed to get all products');
    }
  }

  async getLowStockProducts() {
    try {
      const products = (await this.databaseService.$queryRaw`
      SELECT COUNT(*)
      FROM products
      WHERE deletedAt IS NULL
      AND stock <= min_stock
      `) as { count: bigint }[];

      const lowStockCount = Number(products[0].count);

      return lowStockCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to get low stock products',
      );
    }
  }

  async getDeletedProducts() {
    try {
      const products = await this.databaseService.product.count({
        where: {
          deletedAt: {
            not: null,
          },
        },
      });

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get deleted products');
    }
  }

  async getMovementsToday() {
    try {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const movements = await this.databaseService.stockMovent.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return movements;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get movements today');
    }
  }
}
