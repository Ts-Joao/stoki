import { DatabaseService } from "src/database/database.service";
import { CategoriesService } from "./categories.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AuditService } from "src/audit/audit.service";
import { EntityType } from "@prisma/client";

describe('CategoriesService', () => {
  let categoriesFindUniqueMock: jest.Mock;
  let categoriesFindManyMock: jest.Mock;
  let categoriesCreateMock: jest.Mock;
  let categoriesUpdateMock: jest.Mock;
  let categoriesDeleteMock: jest.Mock;
  let auditCreateMock: jest.Mock;
  let transactionMock: jest.Mock;

  let categoriesService: CategoriesService; 
  let databaseService: DatabaseService;
  let auditService: AuditService;

  const mockCategory = {
    id: 1,
    name: 'Category A',
    products: [],
  }

  beforeEach(async () => {
    categoriesFindUniqueMock = jest.fn().mockResolvedValue(mockCategory)
    categoriesFindManyMock = jest.fn().mockResolvedValue([mockCategory])
    categoriesCreateMock = jest.fn().mockResolvedValue(mockCategory)
    categoriesUpdateMock = jest.fn().mockResolvedValue(mockCategory)
    categoriesDeleteMock = jest.fn().mockResolvedValue(mockCategory)
    auditCreateMock = jest.fn().mockResolvedValue({ id: 'audit-id' })

    transactionMock = jest.fn().mockImplementation(async (callback) => {
      return callback({
        category: {
          create: categoriesCreateMock,
          update: categoriesUpdateMock,
          delete: categoriesDeleteMock,
        },
        audit: {
          createAudit: auditCreateMock,
        },
      });
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: DatabaseService,
          useValue: {
            $transaction: transactionMock,
            category: {
              findUnique: categoriesFindUniqueMock,
              findMany: categoriesFindManyMock,
              create: categoriesCreateMock,
              update: categoriesUpdateMock,
              delete: categoriesDeleteMock,
            }
          }
        },
        {
          provide: AuditService,
          useValue: {
            createAudit: auditCreateMock,
          },
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateCategoryDto = { name: 'Category A' }

    it('should create a category successfully', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      const result = await categoriesService.create(dto, 'user-id')

      expect(categoriesFindUniqueMock).toHaveBeenCalledWith({
        where: {
          name: dto.name
        }
      })
      expect(transactionMock).toHaveBeenCalledTimes(1)
      expect(categoriesCreateMock).toHaveBeenCalledWith({
        data: { name: dto.name }
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'CREATE',
          entityType: EntityType.CATEGORY,
          entityId: (mockCategory.id).toString(),
          userId: 'user-id',
          details: { name: dto.name }
        }
      )
      expect(result).toEqual(mockCategory)
    })

    it('should throw ConflictException when category already exists', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)

      await expect(categoriesService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        ConflictException
      )

      expect(categoriesCreateMock).not.toHaveBeenCalledWith({
        data: { name: dto.name }
      })
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)
      categoriesCreateMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('findAll', () => {
    it('should find all categories successfully', async () => {
      const result = await categoriesService.findAll()

      expect(categoriesFindManyMock).toHaveBeenCalled()
      expect(result).toEqual([mockCategory])
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindManyMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.findAll()).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('findOne', () => {
    it('should find one category successfully', async () => {
      const result = await categoriesService.findOne(mockCategory.id)

      expect(categoriesFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException when category not found', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      await expect(categoriesService.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.findOne(1)).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('update', () => {
    it('should update a category successfully', async () => {
      const dto: UpdateCategoryDto = { name: 'Category A' }

      const result = await categoriesService.update(1, dto, 'user-id')

      expect(categoriesFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(transactionMock).toHaveBeenCalledTimes(1)
      expect(categoriesUpdateMock).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'UPDATE',
          entityType: EntityType.CATEGORY,
          entityId: (mockCategory.id).toString(),
          userId: 'user-id',
          details: { name: dto.name }
        }
      )
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException when category not found', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      await expect(categoriesService.update(1, {}, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)
      categoriesUpdateMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.update(1, {}, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      const result = await categoriesService.delete(mockCategory.id, 'user-id')

      expect(categoriesFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(transactionMock).toHaveBeenCalledTimes(1)
      expect(categoriesDeleteMock).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'DELETE',
          entityType: EntityType.CATEGORY,
          entityId: (mockCategory.id).toString(),
          userId: 'user-id',
          details: { name: mockCategory.name }
        }
      )
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException when category not found', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      await expect(categoriesService.delete(1, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)
      categoriesDeleteMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.delete(1, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })
});