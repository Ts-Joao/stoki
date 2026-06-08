import { DatabaseService } from 'src/database/database.service';
import { UsersService } from './users.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditService } from 'src/audit/audit.service';
import { EntityType } from '@prisma/client';

describe('UsersService', () => {
  let usersFindUniqueMock: jest.Mock;
  let usersFindManyMock: jest.Mock;
  let usersCreateMock: jest.Mock;
  let usersUpdateMock: jest.Mock;
  let usersDeleteMock: jest.Mock;
  let transactionMock: jest.Mock;
  let auditCreateMock: jest.Mock;

  let usersService: UsersService; 
  let databaseService: DatabaseService;
  let hashingService: HashingServiceProtocol;
  let auditService: AuditService;

  const mockUsers = {
    id: 'user-id',
    name: 'User A',
    password: 'password',
  }

  beforeEach(async () => {
    usersFindUniqueMock = jest.fn().mockResolvedValue(mockUsers);
    usersFindManyMock = jest.fn().mockResolvedValue([mockUsers]);
    usersCreateMock = jest.fn().mockResolvedValue(mockUsers);
    usersUpdateMock = jest.fn().mockResolvedValue(mockUsers);
    usersDeleteMock = jest.fn().mockResolvedValue(mockUsers);
    auditCreateMock = jest.fn().mockResolvedValue({ id: 'audit-id' });

    transactionMock = jest.fn().mockImplementation(async (callback) => {
      return callback({
        user: {
          findUnique: usersFindUniqueMock,
          findMany: usersFindManyMock,
          create: usersCreateMock,
          update: usersUpdateMock,
          delete: usersDeleteMock,
        },
        audit: {
          createAudit: auditCreateMock,
        },
      })
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: {
            $transaction: transactionMock,
            user: {
              findUnique: usersFindUniqueMock,
              findMany: usersFindManyMock,
              create: usersCreateMock,
              update: usersUpdateMock,
              delete: usersDeleteMock,
            }
          }
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashed_password'),
          }
        },
        {
          provide: AuditService,
          useValue: {
            createAudit: auditCreateMock,
          }
        }
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      name: 'User A',
      password: 'password',
    }

    it('should create a user successfully', async () => {
      usersFindUniqueMock.mockResolvedValue(null)

      const result = await usersService.create(dto);

      expect(transactionMock).toHaveBeenCalledTimes(1)
      expect(usersCreateMock).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          password: 'hashed_password',
        },
      });

      expect(auditService.createAudit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'CREATE',
          entityType: EntityType.USER,
          entityId: mockUsers.id,
          userId: 'user-id',
          details: { name: dto.name }
        }
      );

      expect(result).toEqual(mockUsers);
    });

    it('should throw ConflictException when user already exists', async () => {
      usersFindUniqueMock.mockResolvedValue(mockUsers);

      await expect(usersService.create(dto)).rejects.toBeInstanceOf(
        ConflictException
      );

      expect(usersCreateMock).not.toHaveBeenCalledWith({
        data: {
          name: dto.name,
          password: 'hashed_password',
        },
      });
    })

    it('should throw InternalServerErrorException when database error', async () => {
      usersFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(usersService.create(dto)).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(usersCreateMock).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await usersService.findAll();

      expect(usersFindManyMock).toHaveBeenCalled();
      expect(result).toEqual([mockUsers]);
    });

    it('should throw InternalServerErrorException when database error', async () => {
      usersFindManyMock.mockRejectedValue(new Error('Database error'));

      await expect(usersService.findAll()).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(usersFindManyMock).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const result = await usersService.findById('user-id');

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersFindUniqueMock.mockResolvedValue(null);

      await expect(usersService.findById('user-id')).rejects.toThrow('User not found');

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
    });

    it('should throw InternalServerErrorException when database error', async () => {
      usersFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(usersService.findById('user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const result = await usersService.update('user-id', {
        name: 'User B',
      });

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersUpdateMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
        data: {
          name: 'User B',
        },
      });

      expect(auditService.createAudit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          action: 'UPDATE',
          entityType: EntityType.USER,
          entityId: mockUsers.id,
          userId: 'user-id',
          details: { name: 'User B' }
        }
      );

      expect(result).toEqual(mockUsers);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersFindUniqueMock.mockResolvedValue(null);

      await expect(usersService.update('user-id', {
        name: 'User B',
      })).rejects.toThrow('User not found');

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersUpdateMock).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when database error', async () => {
      usersFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(usersService.update('user-id', {
        name: 'User B',
      })).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const result = await usersService.delete('user-id');

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersDeleteMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersFindUniqueMock.mockResolvedValue(null);

      await expect(usersService.delete('user-id')).rejects.toThrow('User not found');

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersDeleteMock).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when database error', async () => {
      usersFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(usersService.delete('user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException
      );

      expect(usersFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });
      expect(usersDeleteMock).not.toHaveBeenCalled();
    });
  });
})