import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import { generateToken, validateEmail, validatePassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone, address, city, state, pincode } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const user = createUser({
      email,
      name,
      role: role as "donor" | "recipient" | "admin",
      phone: phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
    })

    const token = generateToken(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
