import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { db } from '../database/db';
import { ownerApplications, roles, userRoles, users } from '../database/schema';
import { and, desc, eq } from 'drizzle-orm';
import { RejectOwnerApplicationDto } from './dto/reject-owner-application.dto';

@Injectable()
export class OwnerApplicationService {
  //creating owner application
  async createApplication(userId: string, dto: CreateOwnerApplicationDto) {
    const existingApplication = await db.query.ownerApplications.findFirst({
      where: and(
        eq(ownerApplications.userId, userId),
        eq(ownerApplications.status, 'pending'),
      ),
    });
    if (existingApplication) {
      throw new ConflictException(
        'You already have one pending owner application!',
      );
    }
    const ownerApplication = await db
      .insert(ownerApplications)
      .values({
        userId: userId,
        businessName: dto.businessName,
        description: dto.description,
        reason: dto.reason,
      })
      .returning();

    return ownerApplication[0];
  }

  async getPendingApplication() {
    return db
      .select({
        application: ownerApplications,
        applicant: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(ownerApplications)
      .innerJoin(users, eq(ownerApplications.userId, users.id))
      .where(eq(ownerApplications.status, 'pending'))
      .orderBy(desc(ownerApplications.createdAt));
  }

  async approveApplication(applicationId: string, adminId: string) {
    return db.transaction(async (tx) => {
      // 1. Find the application
      const [application] = await tx
        .select()
        .from(ownerApplications)
        .where(eq(ownerApplications.id, applicationId))
        .limit(1);

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // 2. Ensure the application is still pending
      if (application.status !== 'pending') {
        throw new ConflictException(
          'This application has already been reviewed',
        );
      }

      // 3. Find the owner role
      const [ownerRole] = await tx
        .select()
        .from(roles)
        .where(eq(roles.name, 'owner'))
        .limit(1);

      if (!ownerRole) {
        throw new InternalServerErrorException('Owner role not found');
      }

      // 4. Assign the owner role without duplicating it
      await tx
        .insert(userRoles)
        .values({
          userId: application.userId,
          roleId: ownerRole.id,
        })
        .onConflictDoNothing();

      // 5. Update the application status
      const [updatedApplication] = await tx
        .update(ownerApplications)
        .set({
          status: 'approved',
          reviewedBy: adminId,
          reviewedAt: new Date(),
        })
        .where(eq(ownerApplications.id, applicationId))
        .returning();

      return updatedApplication;
    });
  }
 async rejectApplication(applicationId: string, adminId: string, dto: RejectOwnerApplicationDto) {
    return db.transaction(async (tx) => {
      // 1. Find the application
      const [application] = await tx
        .select()
        .from(ownerApplications)
        .where(eq(ownerApplications.id, applicationId))
        .limit(1);

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // 2. Ensure the application is still pending
      if (application.status !== 'pending') {
        throw new ConflictException(
          'This application has already been reviewed',
        );
      }


      // 5. Update the application status
      const [updatedApplication] = await tx
        .update(ownerApplications)
        .set({
          status: 'rejected',
          rejectionReason: dto.reason,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        })
        .where(eq(ownerApplications.id, applicationId))
        .returning();

      return updatedApplication;
    });
  }
}
