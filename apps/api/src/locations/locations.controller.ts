import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@UseGuards(AuthTokenGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(
    @Body() dto: CreateLocationDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':locationId')
  findOne(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.locationsService.findOne(locationId);
  }

  @Patch(':locationId')
  update(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpdateLocationDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.update(locationId, dto, userId);
  }

  @Delete(':locationId')
  remove(
    @Param('locationId', ParseIntPipe) locationId: number,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.delete(locationId, userId);
  }
}
