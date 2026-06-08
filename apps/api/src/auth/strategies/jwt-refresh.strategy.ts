import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });

  }

  async validate(req: Request, payload: TokenPayloadDto) {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { ...user, refreshToken };
  }
}