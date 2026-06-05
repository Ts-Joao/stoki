import { DatabaseService } from "src/database/database.service";
import { LocationsService } from "./locations.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateLocationDto } from "./dto/create-location.dto";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateLocationDto } from "./dto/update-location.dto";

describe('LocationsService', () => {
  let locationFindUniqueMock: jest.Mock;
  let locationFindManyMock: jest.Mock;
  let locationCreateMock: jest.Mock;
  let locationUpdateMock: jest.Mock;
  let locationDeleteMock: jest.Mock;

  let locationsService: LocationsService;
  let databaseService: DatabaseService;

  const mockLocation = {
    id: 1,
    name: 'Localização 1',
    products: [],
  };

  beforeEach(async () => {
    locationFindUniqueMock = jest.fn().mockResolvedValue(mockLocation);
    locationFindManyMock = jest.fn().mockResolvedValue([mockLocation]);
    locationCreateMock = jest.fn().mockResolvedValue(mockLocation);
    locationUpdateMock = jest.fn().mockResolvedValue(mockLocation);
    locationDeleteMock = jest.fn().mockResolvedValue(mockLocation);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: DatabaseService,
          useValue: {
            location: {
              findUnique: locationFindUniqueMock,
              findMany: locationFindManyMock,
              create: locationCreateMock,
              update: locationUpdateMock,
              delete: locationDeleteMock,
            }
          }
        },
      ],
    }).compile();

    locationsService = module.get<LocationsService>(LocationsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(locationsService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateLocationDto = { name: 'Location A' } 

    it('should create a location successfully', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      const result = await locationsService.create(dto)

      expect(locationFindUniqueMock).toHaveBeenCalledWith({
        where: {
          name: dto.name
        }
      })
      expect(locationCreateMock).toHaveBeenCalledWith({
        data: { name: dto.name }
      })
      expect(result).toEqual(mockLocation)
    })

    it('should throw ConflictException when location already exists', async () =>{
      locationFindUniqueMock.mockResolvedValue(mockLocation)

      await expect(locationsService.create(dto)).rejects.toBeInstanceOf(
        ConflictException
      )

      expect(locationCreateMock).not.toHaveBeenCalledWith({
        data: { name: dto.name }
      })
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(null)
      locationCreateMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.create(dto)).rejects.toBeInstanceOf(
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
    const dto: UpdateLocationDto = { name: 'Location A' }

    it('should update a location successfully', async () => {
      const result = await locationsService.update(1, dto)

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
      expect(result).toEqual(mockLocation)
    })

    it('should throw NotFoundException when location not found', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      await expect(locationsService.update(1, dto)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(mockLocation)
      locationUpdateMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.update(1, dto)).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })

  describe('delete', () => {
    it('should delete a location successfully', async () => {
      const result = await locationsService.delete(1)

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
      expect(locationDeleteMock).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockLocation)
    })

    it('should throw NotFoundException when location not found', async () => {
      locationFindUniqueMock.mockResolvedValue(null)

      await expect(locationsService.delete(1)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })

    it('should throw InternalServerErrorException when database fails', async () => {
      locationFindUniqueMock.mockResolvedValue(mockLocation)
      locationDeleteMock.mockRejectedValue(new Error('Database error'))

      await expect(locationsService.delete(1)).rejects.toBeInstanceOf(
        InternalServerErrorException
      )
    })
  })
})