"use client"

import { useEffect, useState } from "react"
import type { Medicine } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2 } from "lucide-react"

interface DonationsListProps {
  donorId: string
  refreshTrigger?: number
}

export function DonationsList({ donorId, refreshTrigger }: DonationsListProps) {
  const [donations, setDonations] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`/api/medicines?donorId=${donorId}`)
        const data = await response.json()
        setDonations(data.data || [])
      } catch (error) {
        console.error("Failed to fetch donations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [donorId, refreshTrigger])

  const handleDelete = async (medicineId: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return

    try {
      const response = await fetch(`/api/medicines/?id=${medicineId}`, { method: "DELETE" })
      if (response.ok) {
        setDonations(donations.filter((d) => d.id !== medicineId))
      }
    } catch (error) {
      console.error("Failed to delete donation:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "claimed":
        return "bg-blue-100 text-blue-800"
      case "distributed":
        return "bg-purple-100 text-purple-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading donations...</div>
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>No donations yet. Create your first donation above!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Donations</h3>
      {donations.map((donation) => (
        <Card key={donation.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{donation.name}</h4>
                <p className="text-sm text-gray-600">{donation.description}</p>
              </div>
              <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-semibold">
                  {donation.quantity} {donation.unit}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Expiry Date</p>
                <p className="font-semibold">{new Date(donation.expiryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Donor Name</p>
                <p className="font-semibold">{donation.manufacturer || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-semibold">
                  {donation.location.city}, {donation.location.state}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(donation.id)}
                disabled={donation.status !== "available"}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
