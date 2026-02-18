"use client"

import { useEffect, useState } from "react"
import type { Analytics } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics")
        const data = await response.json()
        if (data.success) {
          setAnalytics(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">Failed to load analytics</div>
  }

  const stats = [
    { label: "Total Users", value: analytics.totalUsers, color: "bg-blue-100 text-blue-800" },
    { label: "Total Donations", value: analytics.totalDonations, color: "bg-green-100 text-green-800" },
    { label: "Total Claims", value: analytics.totalClaims, color: "bg-purple-100 text-purple-800" },
    { label: "Food Distributed", value: analytics.medicinesDistributed, color: "bg-orange-100 text-orange-800" },
    { label: "Active Donors", value: analytics.activeDonors, color: "bg-indigo-100 text-indigo-800" },
    { label: "Active Recipients", value: analytics.activeRecipients, color: "bg-pink-100 text-pink-800" },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className={`p-4 rounded-lg ${stat.color} mb-4`}>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Food quantity Distributed</p>
              <p className="text-4xl font-bold text-green-600">{analytics.wasteReduced}</p>
              <p className="text-xs text-gray-500 mt-2">quantity of food saved from waste</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Success Rate</p>
              <p className="text-4xl font-bold text-blue-600">
                {analytics.totalClaims > 0
                  ? Math.round((analytics.medicinesDistributed / analytics.totalClaims) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500 mt-2">of claims successfully completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
