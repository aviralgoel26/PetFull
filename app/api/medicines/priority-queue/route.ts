import { type NextRequest, NextResponse } from "next/server"
import { getAvailableMedicines } from "@/lib/db"
import { PriorityQueue } from "@/lib/dsa"

export async function GET(request: NextRequest) {
  try {
    const medicines = getAvailableMedicines()

    // Create priority queue based on urgency (expiring soon = higher priority)
    const pq = new PriorityQueue<{ medicineId: string; name: string; priority: number }>()
    const now = new Date()

    medicines.forEach((medicine) => {
      const daysUntilExpiry = Math.floor((medicine.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Higher priority for medicines expiring soon
      let priority = 0
      if (daysUntilExpiry <= 7) priority = 100
      else if (daysUntilExpiry <= 30) priority = 50
      else if (daysUntilExpiry <= 90) priority = 25
      else priority = 10

      pq.enqueue(
        {
          medicineId: medicine.id,
          name: medicine.name,
          priority,
        },
        priority,
      )
    })

    // Extract all items from priority queue
    const prioritized = []
    while (!pq.isEmpty()) {
      const item = pq.dequeue()
      if (item) prioritized.push(item)
    }

    return NextResponse.json({
      success: true,
      data: prioritized,
      message: "Medicines sorted by priority (expiring soon first)",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get priority queue" }, { status: 500 })
  }
}
