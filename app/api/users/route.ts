import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const users = getAllUsers()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
