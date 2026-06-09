import { query } from "./db";
import { sendOtpEmail } from "./mail";
import crypto from "crypto";

export async function generateAndSendOtp(email) {
  const token = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos desde ahora
  try {
    await query("DELETE FROM verification_tokens WHERE identifier = $1", [email]);

    await query(
        "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, $3)",
        [email, token, expires]
    );

    const sent = await sendOtpEmail(email, token);
    return sent;
  } catch (error) {
    console.error("Error generating or sending OTP:", error);
    return false;
  }
}

export async function verifyOTPCode(email, token) {
    const res = await query(
    "SELECT * FROM verification_tokens WHERE identifier = $1 AND token = $2", 
    [email, token]
  );

  const record = res[0];

    if (!record) {
        return {
        valid: false,
        message: "Código OTP inválido",
        }
    }

    if (new Date() > record.expires) {
        return {
        valid: false,
        message: "El código OTP ha expirado",
        }
    }

    await query("DELETE FROM verification_tokens WHERE identifier = $1", [email]);

    return {
    valid: true,
    message: "Código OTP verificado exitosamente",
    }
}