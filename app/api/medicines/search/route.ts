import { type NextRequest, NextResponse } from "next/server"
import { getAllMedicines } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const city = searchParams.get("city")?.toLowerCase() || ""
    const status = searchParams.get("status") || ""

    let medicines = getAllMedicines()

    if (query) {
      medicines = medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.manufacturer.toLowerCase().includes(query),
      )
    }

    if (city) {
      medicines = medicines.filter((m) => m.location.city.toLowerCase().includes(city))
    }

    if (status) {
      medicines = medicines.filter((m) => m.status === status)
    }

    return NextResponse.json({ success: true, data: medicines })
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
