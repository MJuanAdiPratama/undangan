/**
 * In-memory sliding window rate limiter untuk membatasi request spam (5 req / menit per IP).
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Bersihkan data lama setiap 5 menit agar memori tetap hemat
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRequestMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 60_000);
      if (record.timestamps.length === 0) {
        ipRequestMap.delete(ip);
      }
    }
  }, 300_000);
}

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip) || { timestamps: [] };

  // Filter hanya timestamp dalam window 60 detik terakhir
  const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  validTimestamps.push(now);
  ipRequestMap.set(ip, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
  };
}

