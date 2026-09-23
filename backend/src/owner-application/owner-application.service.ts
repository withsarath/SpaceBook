import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { db } from '../database/db';
import { ownerApplications } from '../database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class OwnerApplicationService {

   async createApplication(userId: string, dto:   CreateOwnerApplicationDto){
        const existingApplication = await db.query.ownerApplications.findFirst({
            where: and(
                eq(ownerApplications.userId, userId),
                eq(ownerApplications.status, 'pending')
            )
        })
        if(existingApplication){
            throw new ConflictException('You already have one pending owner application!')
        }
        const ownerApplication = await db.insert(ownerApplications).values({
            userId: userId,
            businessName: dto.businessName,
            description: dto.description,
            reason: dto.reason
        }).returning()

        return ownerApplication[0]
    }

}
