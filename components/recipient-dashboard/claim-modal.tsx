"use client"

import type React from "react"

import { useState } from "react"
import type { Medicine } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface ClaimModalProps {
  medicine: Medicine | null
  recipientId: string
  onClose: () => void
  onSuccess?: () => void
}

export function ClaimModal({ medicine, recipientId, onClose, onSuccess }: ClaimModalProps) {
  const [quantity, setQuantity] = useState("1")
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!medicine) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: medicine.id,
          recipientId,
          quantity: Number.parseInt(quantity),
          reason,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create claim")
      }

      setSuccess("Claim submitted successfully! Waiting for donor approval.")
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create claim")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Claim Food</CardTitle>
            <CardDescription>{medicine.name}</CardDescription>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold">
                  {medicine.quantity} {medicine.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor Name:</span>
                <span className="font-semibold">{medicine.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-semibold">{new Date(medicine.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity Needed *</label>
              <Input
                type="number"
                min="1"
                max={medicine.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Claim</label>
              <textarea
                placeholder="Explain why you need this food..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
