"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { DonationForm } from "@/components/donor-dashboard/donation-form"
import { DonationsList } from "@/components/donor-dashboard/donations-list"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function DonorDashboard() {
  const { user, logout } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute requiredRole="donor">
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              PetFull
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your food donations and track their impact</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <DonationForm donorId={user?.id || ""} onSuccess={() => setRefreshTrigger((t) => t + 1)} />
            </div>

            <div className="lg:col-span-2">
              <DonationsList donorId={user?.id || ""} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
