"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface PrioritizedMedicine {
  medicineId: string
  name: string
  priority: number
}

export function PriorityMedicines() {
  const [medicines, setMedicines] = useState<PrioritizedMedicine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPriority = async () => {
      try {
        const response = await fetch("/api/medicines/priority-queue")
        const data = await response.json()
        if (data.success) {
          setMedicines(data.data.slice(0, 5)) // Show top 5
        }
      } catch (error) {
        console.error("Failed to fetch priority medicines:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriority()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Urgent Food</CardTitle>
        <CardDescription>Food expiring soon - prioritize these claims</CardDescription>
      </CardHeader>
      <CardContent>
        {medicines.length === 0 ? (
          <p className="text-sm text-gray-500">No urgent Food at the moment.</p>
        ) : (
          <div className="space-y-2">
            {medicines.map((medicine, index) => (
              <div key={medicine.medicineId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{medicine.name}</span>
                <Badge
                  className={
                    medicine.priority >= 100
                      ? "bg-red-100 text-red-800"
                      : medicine.priority >= 50
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  Priority: {medicine.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
