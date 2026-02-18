import { type NextRequest, NextResponse } from "next/server"
import { getAllMedicines } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const medicines = getAllMedicines()
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringMedicines = medicines.filter(
      (m) => m.expiryDate <= thirtyDaysFromNow && m.expiryDate > now && m.status === "available",
    )

    return NextResponse.json({ success: true, data: expiringMedicines })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expiring medicines" }, { status: 500 })
  }
}
