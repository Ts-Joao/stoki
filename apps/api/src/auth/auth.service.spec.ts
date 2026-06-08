import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let databaseService: DatabaseService;
  let hashingService: HashingServiceProtocol;

  let userFindUniqueMock: jest.Mock;
  let userUpdateMock: jest.Mock;
  let hashingCompareMock: jest.Mock;
  let hashingHashMock: jest.Mock;
  let jwtSignMock: jest.Mock;
  let configGetMock: jest.Mock;

  const mockUser = {
    id: 'user-id',
    name: 'user',
    password: 'hashed-password',
    role: 'USER',
    refreshToken: 'hashed-refresh-token',
  };

  beforeEach(async () => {
    userFindUniqueMock = jest.fn().mockResolvedValue(mockUser);
    userUpdateMock = jest.fn().mockResolvedValue(mockUser);
    hashingCompareMock = jest.fn().mockResolvedValue(true);
    hashingHashMock = jest.fn().mockResolvedValue('hashed-token');
    jwtSignMock = jest.fn().mockReturnValue('token');
    configGetMock = jest.fn().mockReturnValue('config-value');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: userFindUniqueMock,
              update: userUpdateMock,
            },
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            compare: hashingCompareMock,
            hash: hashingHashMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jwtSignMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: configGetMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticate', () => {
    const loginDto: LoginDto = { name: 'user', password: 'password' };

    it('should authenticate user successfully', async () => {
      const result = await authService.authenticate(loginDto);

      expect(userFindUniqueMock).toHaveBeenCalledWith({
        where: { name: loginDto.name },
      });
      expect(hashingCompareMock).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtSignMock).toHaveBeenCalledTimes(2);
      expect(hashingHashMock).toHaveBeenCalledWith('token');
      expect(userUpdateMock).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshToken: 'hashed-token' },
      });
      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userFindUniqueMock.mockResolvedValue(null);

      await expect(authService.authenticate(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(hashingCompareMock).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      hashingCompareMock.mockResolvedValue(false);

      await expect(authService.authenticate(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(jwtSignMock).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when database fails', async () => {
      userFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(authService.authenticate(loginDto)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await authService.logout('user-id');

      expect(userUpdateMock).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { refreshToken: null },
      });
    });

    it('should throw InternalServerErrorException when database fails', async () => {
      userUpdateMock.mockRejectedValue(new Error('Database error'));

      await expect(authService.logout('user-id')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      userFindUniqueMock.mockResolvedValue({
        name: mockUser.name,
        role: mockUser.role,
        refreshToken: 'hashed-refresh-token',
      });

      const result = await authService.refreshTokens('user-id', 'refresh-token');

      expect(userFindUniqueMock).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        select: { name: true, role: true, refreshToken: true },
      });
      expect(hashingCompareMock).toHaveBeenCalledWith('refresh-token', 'hashed-refresh-token');
      expect(jwtSignMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userFindUniqueMock.mockResolvedValue(null);

      await expect(
        authService.refreshTokens('user-id', 'refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user has no refresh token stored', async () => {
      userFindUniqueMock.mockResolvedValue({
        name: mockUser.name,
        role: mockUser.role,
        refreshToken: null,
      });

      await expect(
        authService.refreshTokens('user-id', 'refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token does not match', async () => {
      userFindUniqueMock.mockResolvedValue({
        name: mockUser.name,
        role: mockUser.role,
        refreshToken: 'hashed-refresh-token',
      });
      hashingCompareMock.mockResolvedValue(false);

      await expect(
        authService.refreshTokens('user-id', 'refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when database fails', async () => {
      userFindUniqueMock.mockRejectedValue(new Error('Database error'));

      await expect(
        authService.refreshTokens('user-id', 'refresh-token'),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});