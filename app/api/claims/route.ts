import { type NextRequest, NextResponse } from "next/server"
import { createClaim, getAllClaims, getClaimsByRecipient, updateClaim, getMedicineById, updateMedicine } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get("recipientId")

    const claims = recipientId ? getClaimsByRecipient(recipientId) : getAllClaims()

    return NextResponse.json({ success: true, data: claims })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { medicineId, recipientId, quantity, reason } = await request.json()

    if (!medicineId || !recipientId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const medicine = getMedicineById(medicineId)
    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }

    if (medicine.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient quantity available" }, { status: 400 })
    }

    const claim = createClaim({
      medicineId,
      recipientId,
      quantity,
      status: "pending",
      reason: reason || "",
    })

    return NextResponse.json({ success: true, data: claim }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { claimId, status } = await request.json()

    if (!claimId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const claim = updateClaim(claimId, { status })

    if (status === "approved" && claim) {
      const medicine = getMedicineById(claim.medicineId)
      if (medicine) {
        updateMedicine(medicine.id, {
          quantity: medicine.quantity - claim.quantity,
          status: medicine.quantity - claim.quantity === 0 ? "distributed" : "available",
        })
      }
    }

    return NextResponse.json({ success: true, data: claim })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}
