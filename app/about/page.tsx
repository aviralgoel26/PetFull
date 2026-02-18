"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function AboutPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MediConnect
          </Link>
          <div className="flex gap-4">
            {user ? (
              <Link href={user.role === "donor" ? "/dashboard/donor" : "/dashboard/recipient"}>
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">About PetFull</h1>
            <p className="text-lg text-gray-600">
              PetFull is a revolutionary platform dedicated to reducing food wastage and improving healthcare
              accessibility across communities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-600">
              We believe that no food should go to waste. Our mission is to create a sustainable ecosystem where
              unused food from donors can reach recipients who need them, reducing food costs and
              environmental impact.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">1</div>
                <h3 className="font-semibold mb-2">Donors Register</h3>
                <p className="text-sm text-gray-600">
                  Food donors create an account and list their unused food with details like expiry date and
                  quantity.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">2</div>
                <h3 className="font-semibold mb-2">Recipients Search</h3>
                <p className="text-sm text-gray-600">
                  Recipients browse available food using our intelligent search and matching algorithms.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">3</div>
                <h3 className="font-semibold mb-2">Claims & Distribution</h3>
                <p className="text-sm text-gray-600">
                  Recipients submit claims, donors approve them, and food are distributed safely and securely.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Advanced matching algorithm to find the best food for recipients</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Priority queue system for food expiring soon</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Real-time tracking of donations and claims</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Comprehensive analytics and impact tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Secure and verified donor-recipient connections</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Impact</h2>
            <p className="text-gray-600">
              Since our launch, PetFull has helped distribute thousands kgs of food to those in need, reducing
              waste and improving healthcare accessibility. Every food donated makes a real difference in someone's
              life.
            </p>
          </section>

          <section className="bg-blue-50 p-8 rounded-lg border border-blue-200 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Join Our Community</h2>
            <p className="text-gray-600">
              Whether you have food to donate or need affordable food, PetFull is here to help. Join
              thousands of donors and recipients making a difference.
            </p>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started Today</Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
