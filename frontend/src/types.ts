export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roles: string[];
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  amenities: string[];
  imageUrl: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  workspaceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  seats: number;
  status: 'confirmed' | 'cancelled';
  notes?: string | null;
  createdAt?: string;
  workspaceName?: string;
  workspaceAddress?: string;
  workspaceCity?: string;
  workspaceCountry?: string;
  workspaceImageUrl?: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
}

export interface OwnerApplication {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  createdAt: string;
  applicant?: {
    id: string;
    name: string;
    email: string;
  };
}
