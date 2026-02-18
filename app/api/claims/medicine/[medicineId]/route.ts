import { type NextRequest, NextResponse } from "next/server"
import { getClaimsByMedicine } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { medicineId: string } }) {
  try {
    const claims = getClaimsByMedicine(params.medicineId)
    return NextResponse.json({ success: true, data: claims })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}
