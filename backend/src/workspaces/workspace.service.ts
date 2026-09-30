import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { db } from '../database/db';
import { workspaces } from '../database/schema';
import { and, eq } from 'drizzle-orm';
import { UpdateWorkspaceDto } from './dto/update-workspaces.dto';

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
  async getWorkspace(id: string, userId: string) {
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
  async updateWorkspace(id: string, userId: string, dto: UpdateWorkspaceDto) {
  const existWorkspace = await db
    .select()
    .from(workspaces)
    .where(
      and(
        eq(workspaces.id, id),
        eq(workspaces.ownerId, userId),
      ),
    )
    .limit(1);

  if (existWorkspace.length === 0) {
    throw new NotFoundException('Workspace Not Found!!');
  }

  const updateData = {
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.description !== undefined && { description: dto.description }),
    ...(dto.address !== undefined && { address: dto.address }),
    ...(dto.city !== undefined && { city: dto.city }),
    ...(dto.country !== undefined && { country: dto.country }),
    ...(dto.amenities !== undefined && { amenities: dto.amenities }),
    ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
  };

  const [workspace] = await db
    .update(workspaces)
    .set(updateData)
    .where(
      and(
        eq(workspaces.id, id),
        eq(workspaces.ownerId, userId),
      ),
    )
    .returning();

  return workspace;
}
}
