export type UserRole = 'owner' | 'occupant';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
};

export type Property = {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
};

export type Room = {
  id: string;
  propertyId: string;
  name: string;
  capacity: number;
  monthlyRate: number;
  status: 'available' | 'occupied' | 'maintenance';
};

export type Reservation = {
  id: string;
  occupantId: string;
  roomId: string;
  propertyId: string;
  startDate: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'converted';
};

export type Rental = {
  id: string;
  occupantId: string;
  roomId: string;
  propertyId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'ended' | 'transferred';
};

export type Bill = {
  id: string;
  rentalId: string;
  occupantId: string;
  period: string;
  totalAmount: number;
  paidAmount: number;
  status: 'unpaid' | 'partial' | 'paid';
};

export type Payment = {
  id: string;
  rentalId: string;
  billId?: string;
  amount: number;
  method: string;
  referenceNumber?: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'voided';
  createdAt: string;
};

export type Collectable = {
  id: string;
  ownerId: string;
  propertyId: string;
  rentalId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
