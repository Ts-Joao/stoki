import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthTokenGuard,
    RefreshTokenGuard,
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController],
  exports: [
    HashingServiceProtocol,
    AuthTokenGuard,
    RefreshTokenGuard,
  ]
})
export class AuthModule {}
