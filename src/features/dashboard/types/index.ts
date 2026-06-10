export type OwnerDashboardData = {
  propertyCount: number;
  activeRentals: number;
  pendingReservations: number;
  totalIncome: number;
};

export type OccupantDashboardData = {
  activeRental: unknown | null;
  pendingBills: number;
  pendingReservations: number;
};
