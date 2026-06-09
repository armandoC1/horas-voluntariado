import { query } from "@/lib/db";
import { requireAuth, createErrorResponse, createSuccessResponse } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    
    const users = await query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [user.id]
    );
    
    if (users.length === 0) {
      return createErrorResponse("Usuario no encontrado", 404);
    }
    
    return createSuccessResponse({ profile: users[0] });
  } catch (error) {
    console.error("Get profile error:", error);
    return createErrorResponse("Error al obtener perfil", 500);
  }
}

export async function PUT(request) {
  try {
    const user = await requireAuth(request);
    const { name } = await request.json();
    
    if (!name || !name.trim()) {
      return createErrorResponse("El nombre es obligatorio", 400);
    }
    
    await query(
      "UPDATE users SET name = $1 WHERE id = $2",
      [name.trim(), user.id]
    );
    
    return createSuccessResponse({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Update profile error:", error);
    return createErrorResponse("Error al actualizar perfil", 500);
  }
}
