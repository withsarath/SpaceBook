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
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Request } from 'express';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Book a workspace (any logged-in user)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Req() req: Request & { user: { userId: string; email: string } },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }

  // Get user's own bookings
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    return this.bookingsService.getMyBookings(req.user.userId);
  }

  // Owner view bookings for their workspace
  @Get('workspace/:workspaceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async getWorkspaceBookings(
    @Param('workspaceId') workspaceId: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    return this.bookingsService.getWorkspaceBookings(workspaceId, req.user.userId);
  }

  // Cancel booking
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    return this.bookingsService.cancelBooking(id, req.user.userId);
  }
}
