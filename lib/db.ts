import type { User, Medicine, Claim, Notification } from "./types"

interface Database {
  users: User[]
  medicines: Medicine[]
  claims: Claim[]
  notifications: Notification[]
}

// Initialize with sample data
const initialDB: Database = {
  users: [
    {
      id: "user-1",
      email: "donor@example.com",
      name: "John Donor",
      role: "donor",
      phone: "9876543210",
      address: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "user-2",
      email: "recipient@example.com",
      name: "Jane Recipient",
      role: "recipient",
      phone: "9876543211",
      address: "456 Oak Ave",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "user-3",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      phone: "9876543212",
      address: "789 Admin Rd",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400003",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  medicines: [
    {
      id: "food-1",
      donorId: "user-1",
      name: "Aaloo Parathe",
      description: "Stuffed aaloo parathas, homemade with dhaniya and spices.",
      quantity: 850,
      unit: "g",
      expiryDate: new Date("2025-12-31T23:59:59"),
      // batchNumber: "BATCH001",
      manufacturer: "Bhallas Kitchen",
      status: "available",
      location: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
  ],
  claims: [],
  notifications: [],
}

let db: Database = JSON.parse(JSON.stringify(initialDB))

export const getDB = (): Database => db

export const setDB = (newDB: Database): void => {
  db = newDB
}

export const resetDB = (): void => {
  db = JSON.parse(JSON.stringify(initialDB))
}

// User operations
export const createUser = (user: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  db.users.push(newUser)
  return newUser
}

export const getUserById = (id: string): User | undefined => {
  return db.users.find((u) => u.id === id)
}

export const getUserByEmail = (email: string): User | undefined => {
  return db.users.find((u) => u.email === email)
}

export const getAllUsers = (): User[] => db.users

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const user = db.users.find((u) => u.id === id)
  if (user) {
    Object.assign(user, updates, { updatedAt: new Date() })
  }
  return user
}

// Medicine operations
export const createMedicine = (medicine: Omit<Medicine, "id" | "createdAt" | "updatedAt">): Medicine => {
  const newMedicine: Medicine = {
    ...medicine,
    id: `med-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  console.log("Creating medicine:", newMedicine);
  db.medicines.push(newMedicine)
  return newMedicine
}

export const getMedicineById = (id: string): Medicine | undefined => {
  return db.medicines.find((m) => m.id === id)
}

export const getMedicinesByDonor = (donorId: string): Medicine[] => {
  return db.medicines.filter((m) => m.donorId === donorId)
}

export const getAvailableMedicines = (): Medicine[] => {
  return db.medicines.filter((m) => m.status === "available")
}

export const getAllMedicines = (): Medicine[] => db.medicines

// ...existing code...
export const updateMedicine = (id: string, updates: Partial<Medicine>): Medicine => {
  const medicine = db.medicines.find((m) => m.id === id)

  if (medicine) {
    Object.assign(medicine, updates, { updatedAt: new Date() })
    return medicine
  }

  // If medicine doesn't exist, create a new one using provided updates with sensible defaults
  const expiry = updates.expiryDate ? new Date(updates.expiryDate as any) : new Date()
  const newMedicine: Medicine = {
    id,
    donorId: (updates as any).donorId || "unknown",
    name: updates.name || "Unnamed Food",
    description: updates.description || "",
    quantity: typeof updates.quantity === "number" ? updates.quantity : Number(updates.quantity) || 0,
    unit: updates.unit || "units",
    expiryDate: expiry,
    manufacturer: updates.manufacturer || "",
    status: updates.status || "available",
    location: updates.location || { city: "", state: "", pincode: "" },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  db.medicines.push(newMedicine)
  return newMedicine
}
// ...existing code...

export const deleteMedicine = (id: string): boolean => {
  const index = db.medicines.findIndex((m) => m.id === id)
  console.log("Deleting medicine with id:", id, "Found at index:", index)
  if (index > -1) {
    db.medicines.splice(index, 1)
    return true
  }
  return false
}

// Claim operations
export const createClaim = (claim: Omit<Claim, "id" | "createdAt" | "updatedAt">): Claim => {
  const newClaim: Claim = {
    ...claim,
    id: `claim-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  db.claims.push(newClaim)
  return newClaim
}

export const getClaimById = (id: string): Claim | undefined => {
  return db.claims.find((c) => c.id === id)
}

export const getClaimsByRecipient = (recipientId: string): Claim[] => {
  return db.claims.filter((c) => c.recipientId === recipientId)
}

export const getClaimsByMedicine = (medicineId: string): Claim[] => {
  return db.claims.filter((c) => c.medicineId === medicineId)
}

export const getAllClaims = (): Claim[] => db.claims

export const updateClaim = (id: string, updates: Partial<Claim>): Claim | undefined => {
  const claim = db.claims.find((c) => c.id === id)
  if (claim) {
    Object.assign(claim, updates, { updatedAt: new Date() })
  }
  return claim
}

// Notification operations
export const createNotification = (notification: Omit<Notification, "id" | "createdAt">): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date(),
  }
  db.notifications.push(newNotification)
  return newNotification
}

export const getNotificationsByUser = (userId: string): Notification[] => {
  return db.notifications.filter((n) => n.userId === userId)
}

export const markNotificationAsRead = (id: string): Notification | undefined => {
  const notification = db.notifications.find((n) => n.id === id)
  if (notification) {
    notification.read = true
  }
  return notification
}
