import { type NextRequest, NextResponse } from "next/server"
import { getAllMedicines } from "@/lib/db"
import { mergeSortByExpiry, quickSortByQuantity } from "@/lib/dsa"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "expiry"

    const medicines = getAllMedicines()

    let sorted = medicines
    if (sortBy === "expiry") {
      sorted = mergeSortByExpiry(medicines)
    } else if (sortBy === "quantity") {
      sorted = quickSortByQuantity(medicines)
    }

    return NextResponse.json({ success: true, data: sorted })
  } catch (error) {
    return NextResponse.json({ error: "Failed to sort medicines" }, { status: 500 })
  }
}
