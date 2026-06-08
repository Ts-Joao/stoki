import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { AuditService } from 'src/audit/audit.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, AuditService],
  exports: [LocationsService]
})
export class LocationsModule {}
