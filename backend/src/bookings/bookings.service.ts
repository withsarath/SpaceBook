import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../database/db';
import { bookings, users, workspaces } from '../database/schema';
import { and, desc, eq } from 'drizzle-orm';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  // Create a new booking for a workspace
  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Check if workspace exists
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, dto.workspaceId))
      .limit(1);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (!workspace.isActive) {
      throw new BadRequestException('This workspace is currently inactive');
    }

    // 2. Insert booking into database
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId,
        workspaceId: dto.workspaceId,
        bookingDate: dto.bookingDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        seats: dto.seats ?? 1,
        notes: dto.notes,
        status: 'confirmed',
      })
      .returning();

    return {
      ...newBooking,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        address: workspace.address,
        city: workspace.city,
        imageUrl: workspace.imageUrl,
      },
    };
  }

  // Get all bookings made by the logged-in user
  async getMyBookings(userId: string) {
    const userBookings = await db
      .select({
        id: bookings.id,
        workspaceId: bookings.workspaceId,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        seats: bookings.seats,
        status: bookings.status,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        workspaceName: workspaces.name,
        workspaceAddress: workspaces.address,
        workspaceCity: workspaces.city,
        workspaceCountry: workspaces.country,
        workspaceImageUrl: workspaces.imageUrl,
      })
      .from(bookings)
      .innerJoin(workspaces, eq(bookings.workspaceId, workspaces.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));

    return userBookings;
  }

  // Get bookings for an owner's workspace
  async getWorkspaceBookings(workspaceId: string, ownerId: string) {
    // Verify that this workspace belongs to the owner
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)))
      .limit(1);

    if (!workspace) {
      throw new ForbiddenException('You do not have access to this workspace bookings');
    }

    const list = await db
      .select({
        id: bookings.id,
        workspaceId: bookings.workspaceId,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        seats: bookings.seats,
        status: bookings.status,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        customerName: users.name,
        customerEmail: users.email,
        customerPhone: users.phone,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.userId, users.id))
      .where(eq(bookings.workspaceId, workspaceId))
      .orderBy(desc(bookings.createdAt));

    return list;
  }

  // Cancel an existing booking
  async cancelBooking(bookingId: string, userId: string) {
    const [existing] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Booking not found');
    }

    if (existing.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return updated;
  }
}
