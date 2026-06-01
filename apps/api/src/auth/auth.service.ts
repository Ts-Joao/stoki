import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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

      const passwordMatch = await this.hashingService.compare(loginDto.password, user!.password)

      if (!user || !passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = ""
      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error authenticating user');
    }
  }

  private generateTokens(payload: TokenPayloadDto) {
      
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
    const tokenHash = this.hashingService.hash(token);

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        refreshToken: tokenHash,
      }
    })

  }

  private deleteToken(userId: string, token: string) : void {
    const 
  }
}
