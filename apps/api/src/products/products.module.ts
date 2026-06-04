import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesService } from 'src/categories/categories.service';
import { LocationsService } from 'src/locations/locations.service';

@Module({
  providers: [
    ProductsService,
    CategoriesService,
    LocationsService
  ],
  controllers: [ProductsController]
})
export class ProductsModule {}
