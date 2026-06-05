import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { DatabaseService } from '../database/database.service';
import { CategoriesService } from '../categories/categories.service';
import { LocationsService } from '../locations/locations.service';
import { CreateProductDto } from './dto/create-product.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let databaseService: DatabaseService;
  let categoriesService: CategoriesService;
  let locationsService: LocationsService;

  let productCreateMock: jest.Mock;
  let productFindUniqueMock: jest.Mock;
  let productFindManyMock: jest.Mock;
  let productUpdateMock: jest.Mock;
  let stockMovementCreateMock: jest.Mock;
  let transactionMock: jest.Mock;

  const mockProduct = {
    id: 'product-id',
    name: 'Product 1',
    stock: 10,
    categoryId: 1,
    locationId: 1,
    description: 'Product 1 description',
    minStock: 5,
    userId: 'user-id',
    deletedAt: null,
  };

  beforeEach(async () => {
    productCreateMock = jest.fn().mockResolvedValue(mockProduct);
    productFindUniqueMock = jest.fn().mockResolvedValue(mockProduct);
    productFindManyMock = jest.fn().mockResolvedValue([mockProduct]);
    productUpdateMock = jest.fn().mockResolvedValue(mockProduct);
    stockMovementCreateMock = jest.fn().mockResolvedValue({ id: 'movement-id' });

    transactionMock = jest.fn().mockImplementation(async (callback) => {
      return callback({
        product: {
          create: productCreateMock,
          update: productUpdateMock,
        },
        stockMovent: {
          create: stockMovementCreateMock,
        },
      });
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: DatabaseService,
          useValue: {
            $transaction: transactionMock,
            product: {
              findUnique: productFindUniqueMock,
              findMany: productFindManyMock,
              update: productUpdateMock,
            },
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Category 1' }),
          },
        },
        {
          provide: LocationsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Location 1' }),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateProductDto = {
      name: 'Product 1',
      stock: 10,
      categoryId: 1,
      locationId: 1,
      description: 'Product 1 description',
      minStock: 5,
    };

    it('should create a product successfully', async () => {
      const result = await productsService.create(dto, 'user-id');

      expect(categoriesService.findOne).toHaveBeenCalledWith(dto.categoryId);
      expect(locationsService.findOne).toHaveBeenCalledWith(dto.locationId);
      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(productCreateMock).toHaveBeenCalledWith({
        data: { ...dto, userId: 'user-id' },
      });
      expect(stockMovementCreateMock).toHaveBeenCalledWith({
        data: {
          productId: mockProduct.id,
          userId: 'user-id',
          quantity: dto.stock,
          type: 'IN',
          note: dto.description,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw InternalServerErrorException when transaction fails', async () => {
      transactionMock.mockRejectedValue(new Error('Transaction error'));

      await expect(productsService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });

    it('should rethrow HttpException from categoriesService.findOne', async () => {
      jest.spyOn(categoriesService, 'findOne').mockRejectedValue(
        new NotFoundException('Category not found'),
      );

      await expect(productsService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should rethrow HttpException from locationsService.findOne', async () => {
      jest.spyOn(locationsService, 'findOne').mockRejectedValue(
        new NotFoundException('Location not found'),
      );

      await expect(productsService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted products', async () => {
      const result = await productsService.findAll();

      expect(productFindManyMock).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toEqual([mockProduct]);
    });

    it('should throw InternalServerErrorException when findMany fails', async () => {
      productFindManyMock.mockRejectedValue(new Error('Database error'));

      await expect(productsService.findAll()).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const result = await productsService.findOne('product-id');

      expect(productFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 'product-id' },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productFindUniqueMock.mockResolvedValue(null);

      await expect(productsService.findOne('product-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when findUnique fails', async () => {
      productFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(productsService.findOne('product-id')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const dto: UpdateProductDto = {
      name: 'Product 1 Updated',
      stock: 15,
      categoryId: 1,
      locationId: 1,
      description: 'Updated description',
      minStock: 5,
    };

    it('should update a product successfully', async () => {
      const result = await productsService.update('product-id', dto);

      expect(productFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 'product-id' },
      });
      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(productUpdateMock).toHaveBeenCalledWith({
        where: { id: 'product-id' },
        data: dto,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should create IN movement when new stock is greater than current', async () => {
      await productsService.update('product-id', { stock: 20 });

      expect(stockMovementCreateMock).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'IN',
          quantity: 10, // 20 - 10
        }),
      });
    });

    it('should create OUT movement when new stock is less than current', async () => {
      await productsService.update('product-id', { stock: 5 });

      expect(stockMovementCreateMock).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'OUT',
          quantity: 5, // 10 - 5
        }),
      });
    });

    it('should create ADJUSTMENT movement when stock is not provided', async () => {
      await productsService.update('product-id', { name: 'New Name' });

      expect(stockMovementCreateMock).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'ADJUSTMENT',
        }),
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productFindUniqueMock.mockResolvedValue(null);

      await expect(productsService.update('product-id', dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when transaction fails', async () => {
      transactionMock.mockRejectedValue(new Error('Transaction error'));

      await expect(productsService.update('product-id', dto)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});