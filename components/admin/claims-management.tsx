"use client"

import { useEffect, useState } from "react"
import type { Claim } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ClaimsManagement() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch("/api/claims")
        const data = await response.json()
        setClaims(data.data || [])
      } catch (error) {
        console.error("Failed to fetch claims:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [])

  const handleApproveClaim = async (claimId: string) => {
    try {
      const response = await fetch("/api/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "approved" }),
      })

      if (response.ok) {
        setClaims(claims.map((c) => (c.id === claimId ? { ...c, status: "approved" } : c)))
      }
    } catch (error) {
      console.error("Failed to approve claim:", error)
    }
  }

  const handleRejectClaim = async (claimId: string) => {
    try {
      const response = await fetch("/api/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "rejected" }),
      })

      if (response.ok) {
        setClaims(claims.map((c) => (c.id === claimId ? { ...c, status: "rejected" } : c)))
      }
    } catch (error) {
      console.error("Failed to reject claim:", error)
    }
  }

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
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    )
  }

  const pendingClaims = claims.filter((c) => c.status === "pending")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claims Management</CardTitle>
        <CardDescription>Review and approve pending claims</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingClaims.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending claims to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingClaims.map((claim) => (
              <div key={claim.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Claim #{claim.id.slice(-6)}</h4>
                    <p className="text-sm text-gray-600">Submitted: {new Date(claim.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Medicine ID</p>
                    <p className="font-semibold">{claim.medicineId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity Requested</p>
                    <p className="font-semibold">{claim.quantity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Reason</p>
                    <p className="font-semibold">{claim.reason || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveClaim(claim.id)}
                  >
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRejectClaim(claim.id)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
