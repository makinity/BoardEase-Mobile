// BoardEase Design System — matches prototype DESIGN.md
export const Colors = {
  primary: '#005EA1',
  primaryContainer: '#2178C3',
  background: '#F8F9FF',
  surface: '#FFFFFF',
  surfaceLow: '#EEF4FF',
  surfaceContainer: '#E4EFFF',
  onSurface: '#011D35',
  onSurfaceVariant: '#414751',
  outline: '#717782',
  outlineVariant: '#C0C7D3',
  secondary: '#006D40',
  secondaryContainer: '#8EF5B5',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  tertiary: '#7A5500',
  tertiaryContainer: '#996C00',
};

export const StatusColors = {
  available: { bg: '#DCFCE7', text: '#15803D' },
  occupied: { bg: '#FEE2E2', text: '#DC2626' },
  maintenance: { bg: '#FEF3C7', text: '#D97706' },
  pending: { bg: '#FEF9C3', text: '#A16207' },
  approved: { bg: '#DCFCE7', text: '#15803D' },
  rejected: { bg: '#FEE2E2', text: '#DC2626' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280' },
  converted: { bg: '#DBEAFE', text: '#1D4ED8' },
  active: { bg: '#DCFCE7', text: '#15803D' },
  partial: { bg: '#FEF3C7', text: '#D97706' },
  unpaid: { bg: '#FEE2E2', text: '#DC2626' },
  paid: { bg: '#DCFCE7', text: '#15803D' },
  ended: { bg: '#F3F4F6', text: '#6B7280' },
  transferred: { bg: '#DBEAFE', text: '#1D4ED8' },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const Radius = {
  sm: 4, md: 8, lg: 12, xl: 16, full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#011D35',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};
