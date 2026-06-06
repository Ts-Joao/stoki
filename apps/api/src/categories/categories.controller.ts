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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@UseGuards(AuthTokenGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.findOne(categoryId);
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto, userId);
  }

  @Delete(':categoryId')
  delete(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @ActiveUser('id') userId: string,
  ) {
    return this.categoriesService.delete(categoryId, userId);
  }
}
