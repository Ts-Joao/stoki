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

  async getRecentMovements() {
    try {
      const movements = await this.databaseService.stockMovent.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return movements;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get recent movements');
    }
  }

  async getTopCategories() {
    try {
      const categories = await this.databaseService.category.findMany({
        include: {
          products: {
            select: {
              id: true,
              stock: true,
            },
          },
        },
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
        take: 5,
      });

      return categories;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get categories');
    }
  }

  async getMonthlyMovements() {
    try {
      const months = this.getMonthsAgo();
      const data: { month: string; entries: number; exits: number }[] = [];

      for (const month of months) {
        const movement = await this.databaseService.stockMovent.groupBy({
          by: ['type'],
          _sum: {
            quantity: true,
          },
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end,
            },
          },
          orderBy: {
            type: 'desc',
          },
        });

        data.push({
          month: month.start.toLocaleDateString('pt-BR', {
            month: 'short',
          }),
          entries: movement.find((m) => m.type === 'IN')?._sum.quantity ?? 0,
          exits: movement.find((m) => m.type === 'OUT')?._sum.quantity ?? 0,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get revenue');
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

      throw new InternalServerErrorException('Failed to get all products');
    }
  }

  async getLowStockProducts() {
    try {
      const products = (await this.databaseService.$queryRaw`
      SELECT COUNT(*)
      FROM product
      WHERE deleted_at IS NULL
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

  private getMonthsAgo() {
    const today = new Date();
    const months: { start: Date; end: Date }[] = [];

    for (let i = 0; i < 6; i++) {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);

      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      months.push({
        start,
        end,
      });
    }

    return months;
  }
}
