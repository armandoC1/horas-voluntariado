import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./db"

const JWT_SECRET = process.env.JWT_SECRET ;

if(!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getUserFromToken(token) {
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  try {
    const users = await query("SELECT id, email, name FROM users WHERE id = $1", [decoded.userId])
    return users[0] || null
  } catch (error) {
    return null
  }
}
