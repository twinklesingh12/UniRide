import type {
  AppNotification,
  Booking,
  ChatMessage,
  DriverVerification,
  EmergencyContact,
  FareBreakdown,
  LatLng,
  PublicUser,
  ReportedIssue,
  Role,
  SosIncident,
  StudentVerification,
  TripShare,
  Vehicle,
  VerificationStatus } from
'../types';
import type { HydratedRide } from '../server/controllers/rideController';
import { http } from './http';

export interface SessionResponse {
  token: string;
  user: PublicUser;
  verification: {student: VerificationStatus;driver: VerificationStatus;};
}

export interface MeResponse {
  user: PublicUser;
  verification: {student: VerificationStatus;driver: VerificationStatus;};
  studentApproved: boolean;
  driverApproved: boolean;
}

export type BookingWithRide = Booking & {ride: HydratedRide;};
export type BookingRequestRow = BookingWithRide & {
  passenger: PublicUser;
  student_verified: boolean;
};

export interface ChatThread {
  ride_id: string;
  route: string;
  ride_status: string;
  departure: string;
  participant: PublicUser;
  online: boolean;
  unread: number;
  last_message: ChatMessage | null;
}

export interface AdminStats {
  totals: Record<string, number>;
  activity: Array<{day: string;rides: number;bookings: number;}>;
  rideMix: Array<{name: string;value: number;}>;
}

export type AdminUserRow = PublicUser & {
  student_verified: boolean;
  driver_verified: boolean;
  vehicles: number;
};

export interface VerificationRow {
  type: 'student' | 'driver';
  record: StudentVerification | DriverVerification;
  user: PublicUser;
  vehicles: Vehicle[];
}

export interface UploadDescriptor {
  name: string;
  type: string;
  sizeMb: number;
  previewUrl?: string;
}

export const api = {
  auth: {
    register: (data: {
      full_name: string;
      email: string;
      phone: string;
      password: string;
      confirm_password: string;
      role: Exclude<Role, 'admin'>;
    }) => http.post<SessionResponse>('/api/auth/register', data),
    login: (data: {email: string;password: string;}) =>
    http.post<SessionResponse>('/api/auth/login', data),
    me: () => http.get<MeResponse>('/api/auth/me'),
    forgotPassword: (email: string) =>
    http.post<{message: string;resetToken: string | null;}>(
      '/api/auth/forgot-password',
      { email }
    ),
    resetPassword: (data: {email: string;password: string;confirm_password: string;}) =>
    http.post<{message: string;}>('/api/auth/reset-password', data)
  },
  users: {
    updateProfile: (data: {full_name?: string;phone?: string;avatar_url?: string;}) =>
    http.patch<PublicUser>('/api/users/me', data),
    changePassword: (data: {
      current_password: string;
      password: string;
      confirm_password: string;
    }) => http.post<{message: string;}>('/api/users/me/password', data)
  },
  rides: {
    search: (params: Record<string, unknown>) =>
    http.get<HydratedRide[]>('/api/rides', { params }),
    get: (id: string) => http.get<HydratedRide>(`/api/rides/${id}`),
    mine: () => http.get<HydratedRide[]>('/api/rides/mine'),
    active: () => http.get<(HydratedRide & {booking?: Booking;}) | null>('/api/rides/active'),
    fareQuote: (id: string, seats: number) =>
    http.get<FareBreakdown>(`/api/rides/${id}/fare-quote`, { params: { seats } }),
    create: (data: Record<string, unknown>) => http.post<HydratedRide>('/api/rides', data),
    update: (id: string, data: Record<string, unknown>) =>
    http.patch<HydratedRide>(`/api/rides/${id}`, data),
    cancel: (id: string) => http.post<HydratedRide>(`/api/rides/${id}/cancel`),
    setStage: (id: string, stage: string) =>
    http.post<HydratedRide>(`/api/rides/${id}/status`, { stage }),
    pushLocation: (id: string, coords: LatLng) =>
    http.post<{ok: boolean;updatedAt: string;}>(`/api/rides/${id}/location`, coords),
    passengers: (id: string) =>
    http.get<
      Array<{booking: Booking;passenger: PublicUser;student_verified: boolean;}>>(
      `/api/rides/${id}/passengers`),
    share: (id: string) => http.post<TripShare>(`/api/rides/${id}/share`)
  },
  bookings: {
    create: (ride_id: string, seats: number) =>
    http.post<BookingWithRide>('/api/bookings', { ride_id, seats }),
    mine: () => http.get<BookingWithRide[]>('/api/bookings/mine'),
    get: (id: string) => http.get<BookingWithRide>(`/api/bookings/${id}`),
    cancel: (id: string) => http.post<BookingWithRide>(`/api/bookings/${id}/cancel`),
    requests: () => http.get<BookingRequestRow[]>('/api/bookings/requests'),
    decide: (id: string, decision: 'accept' | 'reject') =>
    http.post<BookingWithRide>(`/api/bookings/${id}/decision`, { decision })
  },
  students: {
    me: () => http.get<StudentVerification>('/api/students/me'),
    submit: (data: {
      college_name: string;
      enrollment_no: string;
      file: UploadDescriptor;
    }) => http.post<StudentVerification>('/api/students/verify', data)
  },
  drivers: {
    verification: () => http.get<DriverVerification>('/api/drivers/me/verification'),
    submit: (data: {
      licence_number: string;
      gov_id_type: string;
      licence_file: UploadDescriptor;
      gov_id_file: UploadDescriptor;
    }) => http.post<DriverVerification>('/api/drivers/verify', data)
  },
  vehicles: {
    list: () => http.get<Vehicle[]>('/api/vehicles'),
    create: (data: Record<string, unknown>) => http.post<Vehicle>('/api/vehicles', data),
    update: (id: string, data: Record<string, unknown>) =>
    http.patch<Vehicle>(`/api/vehicles/${id}`, data),
    remove: (id: string) => http.delete<{ok: boolean;}>(`/api/vehicles/${id}`)
  },
  notifications: {
    list: () => http.get<AppNotification[]>('/api/notifications'),
    read: (id: string) => http.post<AppNotification>(`/api/notifications/${id}/read`),
    readAll: () => http.post<{ok: boolean;}>('/api/notifications/read-all')
  },
  chat: {
    threads: () => http.get<ChatThread[]>('/api/chat/threads'),
    messages: (rideId: string, userId: string) =>
    http.get<ChatMessage[]>(`/api/chat/${rideId}/${userId}`),
    send: (rideId: string, receiver_id: string, body: string) =>
    http.post<ChatMessage>(`/api/chat/${rideId}`, { receiver_id, body })
  },
  emergency: {
    list: () => http.get<EmergencyContact[]>('/api/emergency'),
    add: (data: {name: string;relationship: string;phone: string;}) =>
    http.post<EmergencyContact>('/api/emergency', data),
    remove: (id: string) => http.delete<{ok: boolean;}>(`/api/emergency/${id}`)
  },
  sos: {
    trigger: (data: {ride_id: string | null;location: LatLng | null;}) =>
    http.post<SosIncident>('/api/sos', data),
    mine: () => http.get<SosIncident[]>('/api/sos/mine')
  },
  trips: {
    share: (token: string) => http.get<any>(`/api/trip-shares/${token}`)
  },
  issues: {
    report: (data: {category: string;description: string;ride_id?: string | null;}) =>
    http.post<ReportedIssue>('/api/issues', data)
  },
  admin: {
    stats: () => http.get<AdminStats>('/api/admin/stats'),
    users: (params: Record<string, unknown>) =>
    http.get<AdminUserRow[]>('/api/admin/users', { params }),
    setUserStatus: (id: string, status: string) =>
    http.patch<PublicUser>(`/api/admin/users/${id}/status`, { status }),
    verifications: (params: Record<string, unknown>) =>
    http.get<VerificationRow[]>('/api/admin/verifications', { params }),
    review: (
    id: string,
    data: {type: 'student' | 'driver';decision: 'approve' | 'reject';remarks?: string;}) =>
    http.post<StudentVerification | DriverVerification>(
      `/api/admin/verifications/${id}/review`,
      data
    ),
    rides: (params: Record<string, unknown>) =>
    http.get<HydratedRide[]>('/api/admin/rides', { params }),
    bookings: (params: Record<string, unknown>) =>
    http.get<any[]>('/api/admin/bookings', { params }),
    issues: () => http.get<{issues: any[];sos: any[];}>('/api/admin/issues'),
    updateIssue: (id: string, status: string) =>
    http.patch<ReportedIssue>(`/api/admin/issues/${id}`, { status })
  }
};

export type { HydratedRide };