import { getUserFromToken } from "./auth"
//
export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message)
    this.statusCode = 401
  }
}

export async function requireAuth(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  const user = await getUserFromToken(token)

  if (!user) {
    throw new UnauthorizedError()
  }

  return user
}

export function createErrorResponse(error, statusCode = 500) {
  return new Response(
    JSON.stringify({ message: error.message || "Error interno del servidor" }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    }
  )
}

export function createSuccessResponse(data, statusCode = 200) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    }
  )
}
