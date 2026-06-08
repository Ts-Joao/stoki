import {
  Controller,
  Get,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({
    summary: "Get all audits",
  })
  async findAll(@Query() pagination: PaginationDto) {
    return this.auditService.findAll(pagination);
  }
}
