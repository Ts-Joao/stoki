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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new location',
  })
  create(
    @Body() dto: CreateLocationDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all locations',
  })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':locationId')
  @ApiOperation({
    summary: 'Get a location by id',
  })
  findOne(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.locationsService.findOne(locationId);
  }

  @Patch(':locationId')
  @ApiOperation({
    summary: 'Update a location',
  })
  update(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpdateLocationDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.update(locationId, dto, userId);
  }

  @Delete(':locationId')
  @ApiOperation({
    summary: 'Delete a location',
  })
  remove(
    @Param('locationId', ParseIntPipe) locationId: number,
    @ActiveUser('id') userId: string,
  ) {
    return this.locationsService.delete(locationId, userId);
  }
}
