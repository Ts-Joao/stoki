import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  findOneByName(@Query('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Get(':id')
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthTokenGuard, SelfOrAdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthTokenGuard, SelfOrAdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
}
