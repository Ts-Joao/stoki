import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AuditModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
