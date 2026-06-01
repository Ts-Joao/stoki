import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string, refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }
}
