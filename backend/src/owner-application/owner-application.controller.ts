import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerApplicationService } from './owner-application.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RejectOwnerApplicationDto } from './dto/reject-owner-application.dto';

@Controller('owner-application')
export class OwnerApplicationController {
  constructor(
    private readonly ownerApplicationsService: OwnerApplicationService,
  ) {}

  // create application
  @Post()
  @UseGuards(JwtAuthGuard)
  createApplication(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
      };
    },
    @Body() dto: CreateOwnerApplicationDto,
  ) {
    return this.ownerApplicationsService.createApplication(
      req.user.userId,
      dto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getPendingApplications() {
    return this.ownerApplicationsService.getPendingApplication();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  approvalApplication(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
      };
    },
  ) {
    return this.ownerApplicationsService.approveApplication(
      id,
      req.user.userId,
    );
  }
   @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  rejectApplication(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
      };
    },
     @Body() dto: RejectOwnerApplicationDto,
  ) {
    return this.ownerApplicationsService.rejectApplication(id, req.user.userId, dto);
  }
}
