import { RateLimiterRes, RateLimiterMemory } from 'rate-limiter-flexible';

// login: 5 intentos por IP cada 15 minutos
const loginLimiter = new RateLimiterMemory({
  keyPrefix: 'login_fail',
  points: 5,
  duration: 15 * 60,
});

// registro: 3 intentos por IP cada 1 hora
const registerLimiter = new RateLimiterMemory({
  keyPrefix: 'register',
  points: 3,
  duration: 60 * 60,
});

// recuperación de contraseña: 3 intentos por IP cada 1 hora
const resetPasswordLimiter = new RateLimiterMemory({
  keyPrefix: 'reset_password',
  points: 3,
  duration: 60 * 60,
});

export async function checkRateLimit(limiter, key) {
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (rejRes) {
    if (rejRes instanceof RateLimiterRes) {
      return {
        allowed: false,
        retryAfter: Math.round(rejRes.msBeforeNext / 1000),
      };
    }
    throw rejRes;
  }
}

export { loginLimiter, registerLimiter, resetPasswordLimiter };
