import { AppState, Therapist, Service, Client, Product, Appointment } from "./types";

const mockTherapists: Therapist[] = [
  { id: "t1", name: "Sarah Jenkins", specialties: ["massage", "facial"], commissionRate: 0.4 },
  { id: "t2", name: "David Chen", specialties: ["hair", "waxing"], commissionRate: 0.45 },
  { id: "t3", name: "Emma Wilson", specialties: ["nail", "facial"], commissionRate: 0.35 },
  { id: "t4", name: "Michael Rodriguez", specialties: ["hair", "massage"], commissionRate: 0.4 },
  { id: "t5", name: "Jessica Taylor", specialties: ["waxing", "nail"], commissionRate: 0.4 },
  { id: "t6", name: "Oliver Brown", specialties: ["massage", "hair"], commissionRate: 0.5 },
];

const mockServices: Service[] = [
  // Hair
  { id: "s1", name: "Women's Haircut", category: "hair", duration: 60, price: 85 },
  { id: "s2", name: "Men's Haircut", category: "hair", duration: 45, price: 50 },
  { id: "s3", name: "Color & Highlights", category: "hair", duration: 120, price: 150 },
  { id: "s4", name: "Blowout", category: "hair", duration: 45, price: 45 },
  { id: "s5", name: "Keratin Treatment", category: "hair", duration: 150, price: 250 },
  { id: "s6", name: "Bridal Updo", category: "hair", duration: 90, price: 120 },
  // Facial
  { id: "s7", name: "Signature Facial", category: "facial", duration: 60, price: 95 },
  { id: "s8", name: "Anti-Aging Facial", category: "facial", duration: 75, price: 130 },
  { id: "s9", name: "Acne Clearing Facial", category: "facial", duration: 60, price: 105 },
  { id: "s10", name: "Express Glow", category: "facial", duration: 30, price: 55 },
  { id: "s11", name: "Microdermabrasion", category: "facial", duration: 45, price: 120 },
  { id: "s12", name: "Chemical Peel", category: "facial", duration: 45, price: 110 },
  // Massage
  { id: "s13", name: "Swedish Massage", category: "massage", duration: 60, price: 90 },
  { id: "s14", name: "Deep Tissue Massage", category: "massage", duration: 90, price: 135 },
  { id: "s15", name: "Hot Stone Massage", category: "massage", duration: 75, price: 125 },
  { id: "s16", name: "Aromatherapy Massage", category: "massage", duration: 60, price: 100 },
  { id: "s17", name: "Couples Massage", category: "massage", duration: 60, price: 190 },
  { id: "s18", name: "Reflexology", category: "massage", duration: 45, price: 75 },
  // Nail
  { id: "s19", name: "Classic Manicure", category: "nail", duration: 30, price: 25 },
  { id: "s20", name: "Gel Manicure", category: "nail", duration: 45, price: 45 },
  { id: "s21", name: "Spa Pedicure", category: "nail", duration: 60, price: 55 },
  { id: "s22", name: "Acrylic Full Set", category: "nail", duration: 90, price: 65 },
  { id: "s23", name: "Nail Art (Per Nail)", category: "nail", duration: 15, price: 5 },
  { id: "s24", name: "Polish Change", category: "nail", duration: 15, price: 15 },
  // Waxing
  { id: "s25", name: "Eyebrow Wax", category: "waxing", duration: 15, price: 20 },
  { id: "s26", name: "Lip & Chin Wax", category: "waxing", duration: 15, price: 25 },
  { id: "s27", name: "Half Leg Wax", category: "waxing", duration: 30, price: 45 },
  { id: "s28", name: "Full Leg Wax", category: "waxing", duration: 45, price: 75 },
  { id: "s29", name: "Bikini Wax", category: "waxing", duration: 30, price: 40 },
  { id: "s30", name: "Brazilian Wax", category: "waxing", duration: 45, price: 65 },
];

const mockClients: Client[] = Array.from({ length: 80 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Client ${i + 1}`,
  phone: `555-01${i.toString().padStart(2, "0")}`,
  email: `client${i + 1}@example.com`,
  loyaltyPoints: Math.floor(Math.random() * 500),
  notes: i % 5 === 0 ? "Allergic to lavender" : "",
  favoriteServices: [mockServices[Math.floor(Math.random() * mockServices.length)].id],
}));

const mockProducts: Product[] = [
  { id: "p1", name: "Revitalizing Shampoo", category: "Hair Care", price: 25, stock: 15, lowStockThreshold: 5 },
  { id: "p2", name: "Hydrating Conditioner", category: "Hair Care", price: 25, stock: 12, lowStockThreshold: 5 },
  { id: "p3", name: "Argan Oil Serum", category: "Hair Care", price: 35, stock: 4, lowStockThreshold: 5 },
  { id: "p4", name: "Anti-Aging Night Cream", category: "Skincare", price: 65, stock: 8, lowStockThreshold: 3 },
  { id: "p5", name: "Vitamin C Serum", category: "Skincare", price: 45, stock: 20, lowStockThreshold: 5 },
  { id: "p6", name: "Exfoliating Scrub", category: "Skincare", price: 30, stock: 10, lowStockThreshold: 5 },
  { id: "p7", name: "Muscle Relief Balm", category: "Body Care", price: 40, stock: 2, lowStockThreshold: 5 }, // Low stock
  { id: "p8", name: "Professional Blow Dryer", category: "Tools", price: 150, stock: 3, lowStockThreshold: 2 },
];

// Generate 1 week of bookings starting from today
const generateBookings = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const today = new Date();

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    mockTherapists.forEach((therapist) => {
      // 2-3 appointments per therapist per day
      const numAppts = Math.floor(Math.random() * 2) + 2;
      let currentHour = 9; // start at 9 AM

      for (let i = 0; i < numAppts; i++) {
        // Find a random service matching therapist specialty
        const validServices = mockServices.filter(s => therapist.specialties.includes(s.category));
        const service = validServices[Math.floor(Math.random() * validServices.length)];

        if (service && currentHour < 17) {
          const startTime = `${currentHour.toString().padStart(2, '0')}:00`;
          appointments.push({
            id: `a_${day}_${therapist.id}_${i}`,
            clientId: mockClients[Math.floor(Math.random() * mockClients.length)].id,
            therapistId: therapist.id,
            serviceId: service.id,
            date: dateStr,
            startTime,
            status: day === 0 && currentHour < new Date().getHours() ? "completed" : "booked",
          });
          currentHour += Math.ceil(service.duration / 60) + 1; // Add duration + 1 hr buffer
        }
      }
    });
  }
  return appointments;
};

const mockMemberships: Membership[] = [
  { id: "m1", clientId: "c1", type: "loyalty", name: "Gold Member" },
  { id: "m2", clientId: "c2", type: "package", name: "Massage 5-Pack", sessionsRemaining: 3 },
  { id: "m3", clientId: "c3", type: "package", name: "Facial 3-Pack", sessionsRemaining: 1 },
];

export const initialMockData: AppState = {
  services: mockServices,
  therapists: mockTherapists,
  clients: mockClients,
  appointments: generateBookings(),
  products: mockProducts,
  memberships: mockMemberships,
  transactions: [],
};
