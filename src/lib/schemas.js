import { z } from "zod";

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Schema para registro
export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Schema para verificación OTP
export const verifyOtpSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().length(6, "El código debe tener 6 dígitos"),
});

// Schema para recuperación de contraseña (solicitud)
export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

// Schema para actualización de contraseña
export const resetPasswordUpdateSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().length(6, "El código debe tener 6 dígitos"),
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Schema para crear/editar actividad (esquema anterior, antes de 2026)
export const activitySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)"),
  location: z.string().min(1, "El lugar es obligatorio").max(255),
  cycle: z.number().int().min(1).max(20),
  hours: z.number().min(0).max(24),
  manual_hours: z.boolean().default(false),
});

// Schema para actividades del nuevo esquema 2026
export const activity2026Schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().nullable(),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().nullable(),
  location: z.string().min(1).max(255),
  cycle: z.number().int().min(1).max(20),
  hours: z.number().min(0).max(24).optional().nullable(),
  manual_hours: z.boolean().default(false),
  activity_type: z.enum(["GRANDE", "PEQUEÑA"]),
});

// Función helper para validar
export function validate(data, schema) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join("."),
      message: err.message,
    }));
    
    return {
      success: false,
      errors,
      message: errors[0]?.message || "Datos inválidos",
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}
