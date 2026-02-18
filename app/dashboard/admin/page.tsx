"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { ClaimsManagement } from "@/components/admin/claims-management"
import { UsersManagement } from "@/components/admin/users-management"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              MediConnect
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin: {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform, users, and claims</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Analytics</h2>
              <AnalyticsDashboard />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Claims Management</h2>
              <ClaimsManagement />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Users</h2>
              <UsersManagement />
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
