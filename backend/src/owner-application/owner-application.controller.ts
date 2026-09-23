import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerApplicationService } from './owner-application.service';

@Controller('owner-application')
export class OwnerApplicationController {
  constructor(
    private readonly ownerApplicationsService: OwnerApplicationService,
  ) {}
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
}
