import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(loginDto: LoginDto) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { name: loginDto.name }
      })

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await this.hashingService.compare(loginDto.password, user!.password)

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload : TokenPayloadDto = {
        sub: user.id,
        name: user.name,
        role: user.role
      }

      const tokens = this.generateTokens(payload)

      await this.saveToken(user.id, tokens.refreshToken)

      return { accessToken: tokens.accessToken }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error authenticating user');
    }
  }

  async logout(userId: string) {
    try {
      await this.databaseService.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        }
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error logging out user');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          role: true,
          refreshToken: true
        }
      })

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const refreshTokenMatches = await this.hashingService.compare(refreshToken, user.refreshToken)

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload : TokenPayloadDto = {
        sub: userId,
        name: user.name,
        role: user.role
      }

      const tokens = this.generateTokens(payload)

      await this.saveToken(userId, tokens.refreshToken)

      return { accessToken: tokens.accessToken }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error refreshing tokens');
    }
  }

  private generateTokens(payload: TokenPayloadDto) {
    const refreshToken = this.generateRefreshToken(payload)
    const accessToken = this.generateAccessToken(payload)

    return { refreshToken, accessToken }
  }

  private generateRefreshToken(payload: TokenPayloadDto) : string {
    const refreshToken = this.jwtService.sign(payload,
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<number>('JWT_REFRESH_TTL')
      });
    return refreshToken;
  }

  private generateAccessToken(payload: TokenPayloadDto) : string {
    const accessToken = this.jwtService.sign(payload,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<number>('JWT_TTL')
      });
    return accessToken;
  }

  private async saveToken(userId: string, token: string) : Promise<void> {
    const tokenHash = await this.hashingService.hash(token);

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        refreshToken: tokenHash,
      }
    })
  }
}
