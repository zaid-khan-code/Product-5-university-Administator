export type ServiceCategory = "hair" | "facial" | "massage" | "nail" | "waxing";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // in minutes
  price: number;
}

export interface Therapist {
  id: string;
  name: string;
  specialties: ServiceCategory[];
  commissionRate: number; // e.g., 0.4 for 40%
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  notes: string;
  favoriteServices: string[]; // Service IDs
}

export interface Appointment {
  id: string;
  clientId: string;
  therapistId: string;
  serviceId: string;
  date: string; // ISO string for the day (e.g., '2024-05-20')
  startTime: string; // "HH:MM" e.g., "10:00"
  status: "booked" | "completed" | "cancelled";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface Membership {
  id: string;
  clientId: string;
  type: "loyalty" | "package";
  name: string;
  sessionsRemaining?: number; // for packages
}

export interface Transaction {
  id: string;
  date: string;
  clientId: string | null;
  items: {
    type: "service" | "product";
    itemId: string;
    price: number;
    therapistId?: string; // if service
  }[];
  total: number;
  discount: number;
  pointsEarned: number;
  pointsRedeemed: number;
}

export interface AppState {
  services: Service[];
  therapists: Therapist[];
  clients: Client[];
  appointments: Appointment[];
  products: Product[];
  memberships: Membership[];
  transactions: Transaction[];
}
