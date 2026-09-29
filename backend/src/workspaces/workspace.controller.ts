import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async createWorkspace(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
      };
    },
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(req.user.userId, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async getWorkspace(@Param('id') id: string, @Req() req: Request & { user: { userId: string; email: string } }) {
    return this.workspaceService.getWorkspace(id, req.user.userId);
  }
}
