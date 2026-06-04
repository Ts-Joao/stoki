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

@UseGuards(AuthTokenGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
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
  ) {
    return this.locationsService.update(locationId, dto);
  }

  @Delete(':locationId')
  remove(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.locationsService.delete(locationId);
  }
}
