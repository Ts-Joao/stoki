import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll() {
    return this.auditService.findAll();
  }
}
