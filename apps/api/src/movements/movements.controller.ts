import {
  Controller,
  Get,
  Param,
  UseGuards
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get()
  async findAll() {
    return this.movementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }
}
