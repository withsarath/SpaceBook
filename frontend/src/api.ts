// API helper for SpaceBook
// Simple and beginner-friendly fetch calls

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Helper to get access token from browser storage
export function getToken(): string | null {
  return localStorage.getItem('spacebook_token');
}

// Helper to save token
export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('spacebook_token', token);
  } else {
    localStorage.removeItem('spacebook_token');
  }
}

// Generic request helper with JSON parsing and error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message || (Array.isArray(data?.message) ? data.message.join(', ') : 'Something went wrong');
    throw new Error(errorMessage);
  }

  return data as T;
}

// Auth API calls
export const authApi = {
  // Register a new customer
  register: (name: string, email: string, password: string, phone?: string) =>
    request<{
      id: string;
      name: string;
      email: string;
      roles: string[];
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    }),

  // Login user and get tokens
  login: (email: string, password: string) =>
    request<{
      accessToken: string;
      refreshToken: string;
      id: string;
      name: string;
      email: string;
      roles: string[];
      phone?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get current logged-in user profile
  getMe: () =>
    request<{
      id: string;
      name: string;
      email: string;
      roles: string[];
      phone?: string;
    }>('/auth/me'),

  // Logout
  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
};

// Workspaces API calls
export const workspacesApi = {
  // Get all active workspaces (public)
  getAll: () => request<any[]>('/workspaces'),

  // Get workspace details by ID
  getById: (id: string) => request<any>(`/workspaces/${id}`),

  // Get workspaces owned by current user
  getMyWorkspaces: () => request<any[]>('/workspaces/my'),

  // Create a new workspace (Owner only)
  create: (data: {
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    amenities: string[];
    imageUrl?: string;
  }) =>
    request<any>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update a workspace (Owner only)
  update: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      address: string;
      city: string;
      country: string;
      amenities: string[];
      imageUrl?: string;
    }>,
  ) =>
    request<any>(`/workspaces/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Delete a workspace (Owner only)
  delete: (id: string) =>
    request<{ message: string }>(`/workspaces/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings API calls
export const bookingsApi = {
  // Book a workspace
  create: (data: {
    workspaceId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    seats?: number;
    notes?: string;
  }) =>
    request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get current user's bookings
  getMyBookings: () => request<any[]>('/bookings/my'),

  // Owner view bookings for a workspace
  getWorkspaceBookings: (workspaceId: string) =>
    request<any[]>(`/bookings/workspace/${workspaceId}`),

  // Cancel a booking
  cancel: (id: string) =>
    request<any>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    }),
};

// Owner Applications API calls
export const ownerApplicationsApi = {
  // Get current user's owner application
  getMyApplication: () => request<any>('/owner-application/me'),

  // Submit new application to become an owner
  apply: (data: { businessName: string; description: string; reason: string }) =>
    request<any>('/owner-application', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin: Get all pending applications
  getPending: () => request<any[]>('/owner-application'),

  // Admin: Approve application
  approve: (id: string) =>
    request<any>(`/owner-application/${id}/approve`, {
      method: 'PATCH',
    }),

  // Admin: Reject application
  reject: (id: string, reason: string) =>
    request<any>(`/owner-application/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),
};
