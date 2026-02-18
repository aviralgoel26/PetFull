export type UserRole = "donor" | "recipient" | "admin"
export type MedicineStatus = "available" | "claimed" | "expired" | "distributed"
export type ClaimStatus = "pending" | "approved" | "rejected" | "completed"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  createdAt: Date
  updatedAt: Date
}

export interface Medicine {
  id: string
  donorId: string
  name: string
  description: string
  quantity: number
  unit: string
  expiryDate: Date
  // batchNumber: string
  manufacturer: string
  status: MedicineStatus
  location: {
    city: string
    state: string
    pincode: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Claim {
  id: string
  medicineId: string
  recipientId: string
  quantity: number
  status: ClaimStatus
  reason: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

export interface Analytics {
  totalDonations: number
  totalClaims: number
  totalUsers: number
  medicinesDistributed: number
  wasteReduced: number
  activeDonors: number
  activeRecipients: number
}
