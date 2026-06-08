import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get dashboard stats',
  })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-movements')
  @ApiOperation({
    summary: 'Get recent movements',
  })
  async getRecentMovements() {
    return this.dashboardService.getRecentMovements();
  }

  @Get('top-categories')
  @ApiOperation({
    summary: 'Get top categories',
  })
  async getTopCategories() {
    return this.dashboardService.getTopCategories();
  }

  @Get('monthly-movements')
  @ApiOperation({
    summary: 'Get monthly movements',
  })
  async getMonthlyMovements() {
    return this.dashboardService.getMonthlyMovements();
  }
}
