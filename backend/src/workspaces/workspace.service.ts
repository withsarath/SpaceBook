import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { db } from '../database/db';
import { workspaces } from '../database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class WorkspaceService {
  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const [workspace] = await db
      .insert(workspaces)
      .values({
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        country: dto.country,
        amenities: dto.amenities ?? [],
        imageUrl: dto.imageUrl,
      })
      .returning();

    return workspace;
  }
  async getWorkspace(id: string, userId) {
    const workspace = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, id), eq(workspaces.ownerId, userId)))
      .limit(1);

    if (workspace.length === 0) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace[0];
  }
}
