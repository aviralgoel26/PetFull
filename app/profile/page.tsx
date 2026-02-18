"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              PetFull
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={user?.role === "donor" ? "/dashboard/donor" : "/dashboard/recipient"}>
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>View and manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <Input value={user?.name || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input value={user?.email || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <Input value={user?.role || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <Input value={user?.phone || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <Input value={user?.address || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <Input value={user?.city || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">State</label>
                  <Input value={user?.state || ""} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Pincode</label>
                  <Input value={user?.pincode || ""} disabled />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  Member since {new Date(user?.createdAt || "").toLocaleDateString()}
                </p>
                <Button disabled>Edit Profile (Coming Soon)</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
