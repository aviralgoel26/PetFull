"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { MedicineBrowser } from "@/components/recipient-dashboard/medicine-browser"
import { ClaimModal } from "@/components/recipient-dashboard/claim-modal"
import { ClaimsList } from "@/components/recipient-dashboard/claims-list"
import { PriorityMedicines } from "@/components/recommendations/priority-medicines"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import type { Medicine } from "@/lib/types"

export default function RecipientDashboard() {
  const { user, logout } = useAuth()
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute requiredRole="recipient">
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              PetFull
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recipient Dashboard</h1>
            <p className="text-gray-600 mt-2">Browse available food and submit claims</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <MedicineBrowser recipientId={user?.id || ""} onClaimClick={setSelectedMedicine} />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <PriorityMedicines />
              <ClaimsList recipientId={user?.id || ""} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>

        <ClaimModal
          medicine={selectedMedicine}
          recipientId={user?.id || ""}
          onClose={() => setSelectedMedicine(null)}
          onSuccess={() => setRefreshTrigger((t) => t + 1)}
        />
      </div>
    </ProtectedRoute>
  )
}
