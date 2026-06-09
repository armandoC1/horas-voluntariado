import { query } from "@/lib/db";
import { requireAuth, createErrorResponse, createSuccessResponse } from "@/lib/api-auth";
import { verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return createErrorResponse("Ambas contraseñas son obligatorias", 400);
    }
    
    if (newPassword.length < 6) {
      return createErrorResponse("La nueva contraseña debe tener al menos 6 caracteres", 400);
    }
    
    // Verificar contraseña actual
    const users = await query("SELECT password FROM users WHERE id = $1", [user.id]);
    if (users.length === 0) {
      return createErrorResponse("Usuario no encontrado", 404);
    }
    
    const validPassword = await verifyPassword(currentPassword, users[0].password);
    if (!validPassword) {
      return createErrorResponse("La contraseña actual es incorrecta", 401);
    }
    
    // Actualizar contraseña
    const hashedPassword = await hashPassword(newPassword);
    await query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
    
    return createSuccessResponse({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Change password error:", error);
    return createErrorResponse("Error al cambiar contraseña", 500);
  }
}
