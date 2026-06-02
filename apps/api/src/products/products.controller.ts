import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(AuthTokenGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
    @ActiveUser('id') userId: string
  ) {
    return this.productsService.create(dto, userId)
  }

  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':productId')
  findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.findOne(productId)
  }

  @Patch(':productId')
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, dto)
  }

  @Delete(':productId')
  remove(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.remove(productId)
  }

  @Delete('hard-delete/:productId')
  hardDelete(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.hardDelete(productId)
  }

  @Patch('restore/:productId')
  restore(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.restore(productId)
  }

  @Get('with-deleted')
  findAllWithDeleted() {
    return this.productsService.findAllWithDeleted()
  }
}
