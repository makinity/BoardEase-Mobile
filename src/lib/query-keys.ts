export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  dashboard: {
    owner: () => ['dashboard', 'owner'] as const,
    occupant: () => ['dashboard', 'occupant'] as const,
  },
  properties: {
    all: () => ['properties'] as const,
    detail: (id: string) => ['properties', id] as const,
    rooms: (id: string) => ['properties', id, 'rooms'] as const,
  },
  rooms: {
    all: () => ['rooms'] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  reservations: {
    all: () => ['reservations'] as const,
    detail: (id: string) => ['reservations', id] as const,
  },
  rentals: {
    all: () => ['rentals'] as const,
    detail: (id: string) => ['rentals', id] as const,
  },
  bills: {
    all: () => ['bills'] as const,
    detail: (id: string) => ['bills', id] as const,
  },
  payments: {
    all: () => ['payments'] as const,
    detail: (id: string) => ['payments', id] as const,
  },
  collectables: {
    all: () => ['collectables'] as const,
    detail: (id: string) => ['collectables', id] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },
  profile: {
    me: () => ['profile', 'me'] as const,
  },
  reports: {
    all: () => ['reports'] as const,
    detail: (id: string) => ['reports', id] as const,
  },
  occupants: {
    all: () => ['occupants'] as const,
    detail: (id: string) => ['occupants', id] as const,
  },
};
