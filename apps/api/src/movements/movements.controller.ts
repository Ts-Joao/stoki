import {
  Controller,
  Get,
  Param,
  UseGuards
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all movements',
  })
  async findAll() {
    return this.movementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a movement by id',
  })
  async findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }
}
