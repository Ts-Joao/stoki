import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ActiveUser } from './decorators/active-user.decorator';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user'
  })
  @Get('me')
  async me(@ActiveUser() user: any) {
    return user;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user'
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user'
  })
  @Post('logout')
  async logout(@ActiveUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token'
  })
  @Post('refresh')
  async refresh(@ActiveUser() user: any) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
