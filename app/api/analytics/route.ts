import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, getAllMedicines, getAllClaims } from "@/lib/db"
import type { Analytics } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const users = getAllUsers()
    const medicines = getAllMedicines()
    const claims = getAllClaims()

    const analytics: Analytics = {
      totalDonations: medicines.length,
      totalClaims: claims.length,
      totalUsers: users.length,
      medicinesDistributed: claims.filter((c) => c.status === "completed").length,
      wasteReduced: medicines.filter((m) => m.status === "distributed").reduce((sum, m) => sum + m.quantity, 0),
      activeDonors: users.filter((u) => u.role === "donor").length,
      activeRecipients: users.filter((u) => u.role === "recipient").length,
    }

    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
