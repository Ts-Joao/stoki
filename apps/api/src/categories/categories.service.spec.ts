import { DatabaseService } from "src/database/database.service";
import { CategoriesService } from "./categories.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";

describe('CategoriesService', () => {
  let categoriesFindUniqueMock: jest.Mock;
  let categoriesFindManyMock: jest.Mock;
  let categoriesCreateMock: jest.Mock;
  let categoriesUpdateMock: jest.Mock;
  let categoriesDeleteMock: jest.Mock;

  let categoriesService: CategoriesService; 
  let databaseService: DatabaseService;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: DatabaseService,
          useValue: {
            category: {
              findUnique: categoriesFindUniqueMock,
              findMany: categoriesFindManyMock,
              create: categoriesCreateMock,
              update: categoriesUpdateMock,
              delete: categoriesDeleteMock,
            }
          }
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateCategoryDto = { name: 'Category A' }

    it('should create a category successfully', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      const result = await categoriesService.create(dto)

      expect(categoriesFindUniqueMock).toHaveBeenCalledWith({
        where: {
          name: dto.name
        }
      })
      expect(categoriesCreateMock).toHaveBeenCalledWith({
        data: { name: dto.name }
      })
      expect(result).toEqual(mockCategory)
    })

    it('should throw ConflictException when category already exists', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)

      await expect(categoriesService.create(dto)).rejects.toBeInstanceOf(
        ConflictException
      )

      expect(categoriesCreateMock).not.toHaveBeenCalledWith({
        data: { name: dto.name }
      })
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)
      categoriesCreateMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.create(dto)).rejects.toBeInstanceOf(
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

      const result = await categoriesService.update(1, dto)

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
      expect(categoriesUpdateMock).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      })
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException when category not found', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      await expect(categoriesService.update(1, {})).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)
      categoriesUpdateMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.update(1, {})).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      const result = await categoriesService.delete(mockCategory.id)

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
      expect(categoriesDeleteMock).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException when category not found', async () => {
      categoriesFindUniqueMock.mockResolvedValue(null)

      await expect(categoriesService.delete(1)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      categoriesFindUniqueMock.mockResolvedValue(mockCategory)
      categoriesDeleteMock.mockRejectedValue(new Error ('Database error'))

      await expect(categoriesService.delete(1)).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })
});