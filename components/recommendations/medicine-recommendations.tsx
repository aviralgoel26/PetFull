"use client"

import { useEffect, useState } from "react"
import type { Medicine } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"

interface MedicineRecommendationsProps {
  medicineName: string
  quantity: number
  city: string
  state: string
  onSelectMedicine: (medicine: Medicine) => void
}

export function MedicineRecommendations({
  medicineName,
  quantity,
  city,
  state,
  onSelectMedicine,
}: MedicineRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!medicineName) return

    const fetchRecommendations = async () => {
      setIsLoading(true)
      setError("")

      try {
        const params = new URLSearchParams({
          medicine: medicineName,
          quantity: quantity.toString(),
          city,
          state,
        })

        const response = await fetch(`/api/recommendations?${params}`)
        const data = await response.json()

        if (data.success) {
          setRecommendations(data.data.matches)
        } else {
          setError(data.error || "Failed to fetch recommendations")
        }
      } catch (err) {
        setError("Failed to fetch recommendations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [medicineName, quantity, city, state])

  if (!medicineName) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Matches</CardTitle>
        <CardDescription>
          Best matches for {medicineName} ({quantity} units) in {city || "your area"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Finding best matches...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!isLoading && recommendations.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>No matching food found. Try adjusting your search criteria.</p>
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((medicine, index) => (
              <div key={medicine.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">
                      #{index + 1} - {medicine.name}
                    </h4>
                    <p className="text-xs text-gray-600">{medicine.manufacturer}</p>
                  </div>
                  {index === 0 && <Badge className="bg-green-100 text-green-800">Best Match</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold ml-1">
                      {medicine.quantity} {medicine.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-semibold ml-1">{new Date(medicine.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full" onClick={() => onSelectMedicine(medicine)}>
                  Claim This Food
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
