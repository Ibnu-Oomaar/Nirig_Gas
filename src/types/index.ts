import { Role, FuelType, TransactionType, TransactionStatus, PaymentMethod } from "@prisma/client";

export type { Role, FuelType, TransactionType, TransactionStatus, PaymentMethod };

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalStock: number;
  totalCustomers: number;
  todaySales: number;
  todayRevenue: number;
  lowStockProducts: number;
  pendingPayments: number;
}

export interface StockSummary {
  id: string;
  name: string;
  fuelType: FuelType;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  tankCapacity: number;
  sellingPrice: number;
  costPrice: number;
  tankNumber: string | null;
  isActive: boolean;
}

export interface SalesData {
  date: string;
  revenue: number;
  litres: number;
}

export interface FuelBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface UserWithCount {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  isActive: boolean;
  createdAt: string | Date;
  _count: {
    transactions: number;
    shifts: number;
  };
}
