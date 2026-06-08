import { DatabaseService } from "src/database/database.service";
import { LocationsService } from "./locations.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateLocationDto } from "./dto/create-location.dto";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { AuditService } from "src/audit/audit.service";
import { EntityType } from "@prisma/client";

describe('LocationsService', () => {
  let locationFindUniqueMock: jest.Mock;
  let locationFindManyMock: jest.Mock;
  let locationCreateMock: jest.Mock;
  let locationUpdateMock: jest.Mock;
  let locationDeleteMock: jest.Mock;
  let auditCreateMock: jest.Mock;
  let transactionMock: jest.Mock;

  let locationsService: LocationsService;
  let databaseService: DatabaseService;
  let auditService: AuditService;

  const mockLocation = {
    id: 1,
    name: 'Localização A',
    products: [],
  };

  beforeEach(async () => {
    locationFindUniqueMock = jest.fn().mockResolvedValue(mockLocation);
    locationFindManyMock = jest.fn().mockResolvedValue([mockLocation]);
    locationCreateMock = jest.fn().mockResolvedValue(mockLocation);
    locationUpdateMock = jest.fn().mockResolvedValue(mockLocation);
    locationDeleteMock = jest.fn().mockResolvedValue(mockLocation);
    auditCreateMock = jest.fn().mockResolvedValue({ id: 'audit-id' });

    transactionMock = jest.fn().mockImplementation(async (callback) => {
      return callback({
        location: {
          create: locationCreateMock,
          update: locationUpdateMock,
          delete: locationDeleteMock,
        },
        audit: {
          createAudit: auditCreateMock,
        },
      });
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: DatabaseService,
          useValue: {
            $transaction: transactionMock,
            location: {
              findUnique: locationFindUniqueMock,
              findMany: locationFindManyMock,
              create: locationCreateMock,
              update: locationUpdateMock,
              delete: locationDeleteMock,
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

    locationsService = module.get<LocationsService>(LocationsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(locationsService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateLocationDto = { name: 'Localização A' } 

    it('should create a location successfully', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      const result = await locationsService.create(dto, 'user-id')

      expect(transactionMock).toHaveBeenCalledTimes(1)
      expect(locationFindUniqueMock).toHaveBeenCalledWith({
        where: {
          name: dto.name
        }
      })
      expect(locationCreateMock).toHaveBeenCalledWith({
        data: { name: dto.name }
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'CREATE',
          entityType: EntityType.LOCATION,
          entityId: (mockLocation.id).toString(),
          userId: 'user-id',
          details: { name: dto.name }
        }
      )
      expect(result).toEqual(mockLocation)
    })

    it('should throw ConflictException when location already exists', async () =>{
      locationFindUniqueMock.mockResolvedValue(mockLocation)

      await expect(locationsService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        ConflictException
      )

      expect(locationCreateMock).not.toHaveBeenCalledWith({
        data: { name: dto.name }
      })
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(null)
      locationCreateMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.create(dto, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('findAll', () => {
    it('should find all locations', async () => {
      const result = await locationsService.findAll()

      expect(locationFindManyMock).toHaveBeenCalled()
      expect(result).toEqual([mockLocation])
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindManyMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.findAll()).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('findOne', () => {
    it('should find a location by id', async () => {
      const result = await locationsService.findOne(1)

      expect(locationFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(result).toEqual(mockLocation)
    })

    it('should throw NotFoundException when location not found', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      await expect(locationsService.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.findOne(1)).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('update', () => {
    const dto: UpdateLocationDto = { name: 'Localização A' }

    it('should update a location successfully', async () => {
      const result = await locationsService.update(1, dto, 'user-id')

      expect(locationFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(locationUpdateMock).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'UPDATE',
          entityType: EntityType.LOCATION,
          entityId: (mockLocation.id).toString(),
          userId: 'user-id',
          details: { name: dto.name }
        }
      )
      expect(result).toEqual(mockLocation)
    })

    it('should throw NotFoundException when location not found', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      await expect(locationsService.update(1, dto, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(mockLocation)
      locationUpdateMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.update(1, dto, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('delete', () => {
    it('should delete a location successfully', async () => {
      const result = await locationsService.delete(1, 'user-id')

      expect(locationFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            where: {
              deletedAt: null
            }
          }
        }
      })
      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'DELETE',
          entityType: EntityType.LOCATION,
          entityId: (mockLocation.id).toString(),
          userId: 'user-id',
          details: { name: mockLocation.name }
        }
      )
      expect(locationDeleteMock).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockLocation)
    })

    it('should throw NotFoundException when location not found', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      await expect(locationsService.delete(1, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(mockLocation)
      locationDeleteMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.delete(1, 'user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })
})