import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: number
  email: string
  isAgent: boolean  // Add this field
}

export function verifyAuth(request: NextRequest): AuthPayload | null {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) return null

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
    return decoded
  } catch {
    return null
  }
}

export function generateToken(userId: number, email: string, isAgent: boolean): string {
  return jwt.sign({ userId, email, isAgent }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}