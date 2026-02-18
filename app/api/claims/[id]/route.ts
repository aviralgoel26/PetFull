import { type NextRequest, NextResponse } from "next/server"
import { getClaimById, updateClaim } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const claim = getClaimById(params.id)
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: claim })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claim" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const claim = updateClaim(params.id, updates)

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: claim })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}
