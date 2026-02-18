"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"

interface DonationFormProps {
  donorId: string
  onSuccess?: () => void
}

export function DonationForm({ donorId, onSuccess }: DonationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    batchNumber: "",
    manufacturer: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId,
          ...formData,
          quantity: Number.parseInt(formData.quantity),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create donation")
      }

      setSuccess("Food donation created successfully!")
      setFormData({
        name: "",
        description: "",
        quantity: "",
        unit: "kg",
        expiryDate: "",
        batchNumber: "",
        manufacturer: "",
        city: "",
        state: "",
        pincode: "",
      })

      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create donation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donate Food</CardTitle>
        <CardDescription>Fill in the details of the Food you want to donate</CardDescription>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Food Name *</label>
              <Input name="name" placeholder="e.g., Paratha" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Donor Name</label>
              <Input
                name="manufacturer"
                placeholder="e.g., Koi bhi Kitchen"
                value={formData.manufacturer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Describe the food and its ingredients"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                name="quantity"
                type="number"
                placeholder="100"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="tablets">kg</option>
                <option value="capsules">g</option>
                <option value="ml">L</option>
                <option value="grams">ml</option>
                <option value="units">pound</option>
                <option value="units">units</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date & Time *</label>
              <Input name="expiryDate" type="datetime-local" value={formData.expiryDate} onChange={handleChange} required />
            </div>
          </div>

          

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City *</label>
              <Input name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">State *</label>
              <Input name="state" placeholder="Maharashtra" value={formData.state} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pincode *</label>
              <Input name="pincode" placeholder="400001" value={formData.pincode} onChange={handleChange} required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating donation..." : "Create Donation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
