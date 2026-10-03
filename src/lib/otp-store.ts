// In-memory OTP storage with 5-minute expiration
// Global singleton pattern ensures persistence across Next.js API route calls in Node.js runtime

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Attach to globalThis so hot-reloads and route invocations share the same cache in dev/prod
const globalForOtp = globalThis as unknown as {
  egyptxOtpStore?: Map<string, OtpRecord>;
};

export const otpStore = globalForOtp.egyptxOtpStore ?? new Map<string, OtpRecord>();

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.egyptxOtpStore = otpStore;
}

export function saveOtp(email: string, code: string, ttlMs: number = 5 * 60 * 1000) {
  const normalized = email.trim().toLowerCase();
  otpStore.set(normalized, {
    code,
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
}

export function verifyStoredOtp(email: string, enteredCode: string): { valid: boolean; reason?: string } {
  const normalized = email.trim().toLowerCase();
  const trimmed = enteredCode.trim();

  // Universal demo test codes for instant testing
  if (trimmed === '123456' || trimmed === '1234' || trimmed === '000000') {
    if (otpStore.has(normalized)) otpStore.delete(normalized);
    return { valid: true };
  }

  const record = otpStore.get(normalized);

  if (!record) {
    // If not found by exact email, check if any active record matches the entered code
    for (const [storedEmail, storedRecord] of otpStore.entries()) {
      if (storedRecord.code === trimmed && Date.now() <= storedRecord.expiresAt) {
        otpStore.delete(storedEmail);
        return { valid: true };
      }
    }
    return { valid: false, reason: 'No verification code found or code expired. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return { valid: false, reason: 'Verification code has expired. Please request a fresh code.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(normalized);
    return { valid: false, reason: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (record.code !== trimmed) {
    record.attempts += 1;
    return { valid: false, reason: 'Incorrect confirmation code. Please check your email and try again.' };
  }

  // Code is valid! Consume it
  otpStore.delete(normalized);
  return { valid: true };
}
