import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async getAllWorkspaces() {
    return this.workspaceService.getAllWorkspaces();
  }

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
  async getWorkspace(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    return this.workspaceService.getWorkspace(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async updateWorkspace(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async deleteWorkspace(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    return this.workspaceService.deleteWorkspce(id, req.user.userId)
  }
}