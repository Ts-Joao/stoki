import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { DatabaseService } from 'src/database/database.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let databaseService: DatabaseService;

  let productCountMock: jest.Mock;
  let queryRawMock: jest.Mock;
  let stockMoventCountMock: jest.Mock;
  let stockMoventFindManyMock: jest.Mock;

  beforeEach(async () => {
    productCountMock = jest.fn().mockResolvedValue(0);
    queryRawMock = jest.fn().mockResolvedValue([ { count: BigInt(0) } ]);
    stockMoventCountMock = jest.fn().mockResolvedValue(0);
    stockMoventFindManyMock = jest.fn().mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: DatabaseService,
          useValue: {
            product: {
              count: productCountMock,
            },
            $queryRaw: queryRawMock,
            stockMovent: {
              count: stockMoventCountMock,
              findMany: stockMoventFindManyMock,
            },
          },
        },
      ],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(dashboardService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return the total number of products', async () => {
      productCountMock.mockResolvedValue(1);

      const products = await dashboardService.getAllProducts();

      expect(productCountMock).toHaveBeenCalledTimes(1);
      expect(products).toBe(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      productCountMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getAllProducts()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(productCountMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLowStockProducts', () => {
    it('should return the number of low stock products', async () => {
      const products = await dashboardService.getLowStockProducts();
      expect(products).toBe(0);

      expect(queryRawMock).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      queryRawMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getLowStockProducts()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(queryRawMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDeletedProducts', () => {
    it('should return the number of deleted products', async () => {
      const products = await dashboardService.getDeletedProducts();
      expect(products).toBe(0);

      expect(productCountMock).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      productCountMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getDeletedProducts()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(productCountMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMovementsToday', () => {
    it('should return the number of movements today', async () => {
      const movements = await dashboardService.getMovementsToday();
      expect(movements).toBe(0);

      expect(stockMoventCountMock).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      stockMoventCountMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getMovementsToday()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(stockMoventCountMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStats', () => {
    it('should return the correct statistics', async () => {
      productCountMock
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(2);
      queryRawMock.mockResolvedValue([{ count: BigInt(5) }]);
      stockMoventCountMock.mockResolvedValue(7);

      const stats = await dashboardService.getStats();

      expect(stats).toEqual({
        totalProducts: 10,
        lowStockProducts: 5,
        deletedProducts: 2,
        movementsToday: 7,
      });

      expect(productCountMock).toHaveBeenCalledTimes(2);
      expect(queryRawMock).toHaveBeenCalledTimes(1);
      expect(stockMoventCountMock).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      productCountMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getStats()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );
    });
  });

  describe('getRecentMovements', () => {
    it('should return the recent movements', async () => {
      const movements = await dashboardService.getRecentMovements();
      expect(movements).toEqual([]);

      expect(stockMoventFindManyMock).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      stockMoventFindManyMock.mockRejectedValue(new Error('Database error'));

      await expect(dashboardService.getRecentMovements()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(stockMoventFindManyMock).toHaveBeenCalledTimes(1);
    });
  });
});
