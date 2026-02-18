"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const { user } = useAuth()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do I donate food?",
      answer:
        "Sign up as a donor, log in to your dashboard, and click 'Donate food'. Fill in the food details including name, quantity, expiry date, and location. Your donation will be listed for recipients to claim.",
    },
    {
      question: "Is it safe to receive food from donors?",
      answer:
        "Yes! All food on PetFull are verified by donors and must include expiry time/dates. We recommend checking the freshness and the ingredients before use.",
    },
    {
      question: "How does the matching algorithm work?",
      answer:
        "Our algorithm uses advanced data structures to find the best food matches based on: food name, required quantity, expiry date (prioritizing food expiring soon), and location proximity.",
    },
    {
      question: "What happens after I submit a claim?",
      answer:
        "Your claim goes to the donor for approval. Once approved, you'll be notified and can arrange pickup or delivery. The food status will update to 'distributed' once completed.",
    },
    {
      question: "Can I edit or delete my donations?",
      answer:
        "Yes, you can edit or delete donations that are still available. Once a donation has been claimed or distributed, it cannot be modified.",
    },
    {
      question: "How is food prioritized?",
      answer:
        "Food is prioritized based on expiry date using our priority queue system. Food expiring within 7 days get highest priority, followed by those expiring within 30 days, and so on.",
    },
    {
      question: "Is there a cost to use PetFull?",
      answer:
        "PetFull is completely free to use. Our mission is to reduce food wastage and improve healthcare accessibility for everyone.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team through the contact form on this page or email us at support@petfull.com. We typically respond within 24 hours.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            PetFull
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & FAQ</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about MediConnect</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
              {expandedFaq === index && (
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>We're here to help!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer you're looking for, please reach out to our support team.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
