"use client"

import { useEffect, useState } from "react"
import type { Medicine } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar } from "lucide-react"

interface MedicineBrowserProps {
  recipientId: string
  onClaimClick: (medicine: Medicine) => void
}

export function MedicineBrowser({ recipientId, onClaimClick }: MedicineBrowserProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("/api/medicines?filter=available")
        const data = await response.json()
        setMedicines(data.data || [])
        setFilteredMedicines(data.data || [])
      } catch (error) {
        console.error("Failed to fetch medicines:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  useEffect(() => {
    let filtered = medicines

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (cityFilter) {
      filtered = filtered.filter((m) => m.location.city.toLowerCase().includes(cityFilter.toLowerCase()))
    }

    setFilteredMedicines(filtered)
  }, [searchQuery, cityFilter, medicines])

  const isExpiringSoon = (expiryDate: Date) => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return new Date(expiryDate) <= thirtyDaysFromNow
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading available food...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search food by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Input placeholder="Filter by city..." value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
      </div>

      {filteredMedicines.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <p>No food available matching your search.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{medicine.name}</h3>
                    {isExpiringSoon(medicine.expiryDate) && (
                      <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">{medicine.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Available</p>
                      <p className="font-semibold">
                        {medicine.quantity} {medicine.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Donor Name</p>
                      <p className="font-semibold text-xs">{medicine.manufacturer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {medicine.location.city}, {medicine.location.state}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Expires: {new Date(medicine.expiryDate).toLocaleString()}
                  </div>

                  <Button className="w-full" onClick={() => onClaimClick(medicine)}>
                    Claim Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
