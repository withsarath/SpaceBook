import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspaces.dto';
import { db } from '../database/db';
import { workspaces } from '../database/schema';

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
}
