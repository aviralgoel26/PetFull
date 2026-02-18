"use client"

import { useEffect, useState } from "react"
import type { Claim } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ClaimsListProps {
  recipientId: string
  refreshTrigger?: number
}

export function ClaimsList({ recipientId, refreshTrigger }: ClaimsListProps) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(`/api/claims?recipientId=${recipientId}`)
        const data = await response.json()
        setClaims(data.data || [])
      } catch (error) {
        console.error("Failed to fetch claims:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [recipientId, refreshTrigger])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading your claims...</div>
  }

  if (claims.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>No claims yet. Browse food and submit a claim!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Claims</h3>
      {claims.map((claim) => (
        <Card key={claim.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">Claim #{claim.id.slice(-6)}</h4>
                <p className="text-sm text-gray-600">Submitted: {new Date(claim.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Quantity Requested</p>
                <p className="font-semibold">{claim.quantity}</p>
              </div>
              <div>
                <p className="text-gray-600">Reason</p>
                <p className="font-semibold">{claim.reason || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
