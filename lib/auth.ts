import type { User } from "./types"

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  token?: string
}

// Simple in-memory session storage
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map()

export const generateToken = (userId: string): string => {
  const token = `token-${userId}-${Date.now()}`
  sessions.set(token, {
    userId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })
  return token
}

export const verifyToken = (token: string): string | null => {
  const session = sessions.get(token)
  if (!session) return null
  if (new Date() > session.expiresAt) {
    sessions.delete(token)
    return null
  }
  return session.userId
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const hashPassword = (password: string): string => {
  // Simple hash for demo (in production, use bcrypt)
  return Buffer.from(password).toString("base64")
}

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}
