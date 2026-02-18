import { type NextRequest, NextResponse } from "next/server"
import { getAvailableMedicines } from "@/lib/db"
import { findBestMedicineMatches, mergeSortByExpiry, quickSortByQuantity } from "@/lib/dsa"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const medicineName = searchParams.get("medicine")
    const quantity = searchParams.get("quantity") || "1"
    const city = searchParams.get("city") || ""
    const state = searchParams.get("state") || ""

    if (!medicineName) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
    }

    const availableMedicines = getAvailableMedicines()

    // Use DSA matching algorithm
    const matches = findBestMedicineMatches(availableMedicines, medicineName, Number.parseInt(quantity), {
      city,
      state,
    })

    return NextResponse.json({
      success: true,
      data: {
        matches,
        totalMatches: matches.length,
        sortedByExpiry: mergeSortByExpiry(matches),
        sortedByQuantity: quickSortByQuantity(matches),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
