import { type NextRequest, NextResponse } from "next/server"
import { getMedicineById, updateMedicine, deleteMedicine } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const medicine = getMedicineById(params.id)
    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: medicine })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch medicine" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const medicine = updateMedicine(params.id, updates)

    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: medicine })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update medicine" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = deleteMedicine(params.id)

    if (!success) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Medicine deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete medicine" }, { status: 500 })
  }
}
