import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-movements')
  async getRecentMovements() {
    return this.dashboardService.getRecentMovements();
  }

  @Get('top-categories')
  async getTopCategories() {
    return this.dashboardService.getTopCategories();
  }

  @Get('monthly-movements')
  async getMonthlyMovements() {
    return this.dashboardService.getMonthlyMovements();
  }
}
