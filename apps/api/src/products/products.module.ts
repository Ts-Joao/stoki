import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesService } from 'src/categories/categories.service';
import { LocationsService } from 'src/locations/locations.service';
import { AuditService } from 'src/audit/audit.service';

@Module({
  providers: [
    ProductsService,
    CategoriesService,
    LocationsService,
    AuditService,
  ],
  controllers: [ProductsController]
})
export class ProductsModule {}
