import crypto from "node:crypto";
import { formatInTimeZone } from "date-fns-tz";
import prisma from "@/lib/db";
import { getBusinessTimezone } from "@/lib/booking/availability";
import { safeLogWarn } from "@/lib/security/mask";

export const SESSION_RATE_LIMIT = 20;
export const SESSION_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const IP_RATE_LIMIT = 60;
export const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export const ADMIN_LOGIN_RATE_LIMIT = 10;
export const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const DEFAULT_DAILY_MODEL_CALL_LIMIT = 200;

export class DailyModelCapExceededError extends Error {
  public readonly code = "DAILY_MODEL_CAP_EXCEEDED";

  constructor() {
    super("Global daily model call limit reached.");
    this.name = "DailyModelCapExceededError";
  }
}

export interface RateLimitBucketState {
  count: number;
  expiresAt: Date;
}

export interface RateLimitStore {
  increment(
    key: string,
    windowMs: number,
    now?: Date
  ): Promise<RateLimitBucketState>;
  getCount(key: string, now?: Date): Promise<number>;
}

const memoryBuckets = new Map<string, RateLimitBucketState>();

export function createMemoryRateLimitStore(
  backingMap: Map<string, RateLimitBucketState> = new Map()
): RateLimitStore {
  return {
    async increment(key, windowMs, now = new Date()) {
      const existing = backingMap.get(key);
      if (!existing || existing.expiresAt.getTime() <= now.getTime()) {
        const fresh: RateLimitBucketState = {
          count: 1,
          expiresAt: new Date(now.getTime() + windowMs),
        };
        backingMap.set(key, fresh);
        return fresh;
      }
      const next: RateLimitBucketState = {
        count: existing.count + 1,
        expiresAt: existing.expiresAt,
      };
      backingMap.set(key, next);
      return next;
    },
    async getCount(key, now = new Date()) {
      const existing = backingMap.get(key);
      if (!existing || existing.expiresAt.getTime() <= now.getTime()) {
        return 0;
      }
      return existing.count;
    },
  };
}

const fallbackMemoryStore = createMemoryRateLimitStore(memoryBuckets);

/**
 * Postgres-backed atomic fixed-window counter (`agent_rate_limits` table),
 * falling back cleanly to module memory only if DATABASE_URL is unconfigured.
 */
export const postgresRateLimitStore: RateLimitStore = {
  async increment(key, windowMs, now = new Date()) {
    if (!process.env.DATABASE_URL?.trim()) {
      return fallbackMemoryStore.increment(key, windowMs, now);
    }

    const nextExpiry = new Date(now.getTime() + windowMs);
    try {
      const rows = await prisma.$queryRaw<
        Array<{ count: number; expiresAt: Date }>
      >`
        INSERT INTO "agent_rate_limits" ("key", "count", "expiresAt", "updatedAt")
        VALUES (${key}, 1, ${nextExpiry}, ${now})
        ON CONFLICT ("key") DO UPDATE
        SET
          "count" = CASE
            WHEN "agent_rate_limits"."expiresAt" <= ${now} THEN 1
            ELSE "agent_rate_limits"."count" + 1
          END,
          "expiresAt" = CASE
            WHEN "agent_rate_limits"."expiresAt" <= ${now} THEN ${nextExpiry}
            ELSE "agent_rate_limits"."expiresAt"
          END,
          "updatedAt" = ${now}
        RETURNING "count", "expiresAt";
      `;

      if (rows[0]) {
        return {
          count: Number(rows[0].count),
          expiresAt: new Date(rows[0].expiresAt),
        };
      }
    } catch (err) {
      safeLogWarn("security.ratelimit.db_fallback", {
        reason: err instanceof Error ? err.name : "unknown",
      });
    }

    return fallbackMemoryStore.increment(key, windowMs, now);
  },

  async getCount(key, now = new Date()) {
    if (!process.env.DATABASE_URL?.trim()) {
      return fallbackMemoryStore.getCount(key, now);
    }
    try {
      const rows = await prisma.$queryRaw<
        Array<{ count: number; expiresAt: Date }>
      >`
        SELECT "count", "expiresAt"
        FROM "agent_rate_limits"
        WHERE "key" = ${key}
        LIMIT 1;
      `;
      const row = rows[0];
      if (!row || new Date(row.expiresAt).getTime() <= now.getTime()) {
        return 0;
      }
      return Number(row.count);
    } catch {
      return fallbackMemoryStore.getCount(key, now);
    }
  },
};

export function hashIpAddress(ip: string): string {
  const salt = process.env.ADMIN_TOKEN?.slice(0, 12) ?? "corelogic-rl-v1";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip.trim()}`)
    .digest("hex")
    .slice(0, 24);
}

export function getDailyModelCallLimit(): number {
  const parsed = Number.parseInt(
    process.env.DAILY_MODEL_CALL_LIMIT ?? "",
    10
  );
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_DAILY_MODEL_CALL_LIMIT;
}

function getDailyBucketKey(now = new Date()): string {
  const tz = getBusinessTimezone();
  const dateKey = formatInTimeZone(now, tz, "yyyy-MM-dd");
  return `daily:model:${dateKey}`;
}

export type ChatRateLimitDecision =
  | { allowed: true }
  | {
      allowed: false;
      reason: "SESSION_LIMIT" | "IP_LIMIT" | "DAILY_CAP";
      retryAfterSeconds: number;
      message_en: string;
      message_ar: string;
      message_de: string;
    };

export async function checkChatRateLimits(params: {
  sessionId: string;
  clientIp: string;
  store?: RateLimitStore;
  now?: Date;
  dailyLimit?: number;
}): Promise<ChatRateLimitDecision> {
  const store = params.store ?? postgresRateLimitStore;
  const now = params.now ?? new Date();
  const dailyLimit = params.dailyLimit ?? getDailyModelCallLimit();

  // 1. Check global daily cap first before incrementing per-user buckets
  const dailyKey = getDailyBucketKey(now);
  const currentDaily = await store.getCount(dailyKey, now);
  if (currentDaily >= dailyLimit) {
    return {
      allowed: false,
      reason: "DAILY_CAP",
      retryAfterSeconds: 3600,
      message_en:
        "Our AI assistant has reached today's usage limit. Please contact our team directly via WhatsApp or the Contact page and we will respond promptly.",
      message_ar:
        "وصل المساعد الذكي إلى الحد اليومي للاستخدام. يرجى التواصل مع فريقنا مباشرة عبر واتساب أو صفحة تواصل معنا وسنرد عليك في أقرب وقت.",
      message_de:
        "Unser KI-Assistent hat das heutige Nutzungslimit erreicht. Bitte kontaktieren Sie unser Team direkt per WhatsApp oder über die Kontaktseite – wir melden uns zeitnah bei Ihnen.",
    };
  }

  // 2. Per-session limit: 20 messages per 10 minutes
  const sessionBucket = await store.increment(
    `chat:session:${params.sessionId}`,
    SESSION_WINDOW_MS,
    now
  );
  if (sessionBucket.count > SESSION_RATE_LIMIT) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((sessionBucket.expiresAt.getTime() - now.getTime()) / 1000)
    );
    return {
      allowed: false,
      reason: "SESSION_LIMIT",
      retryAfterSeconds,
      message_en:
        "You have sent many messages in a short period. Please wait a few minutes and try again.",
      message_ar:
        "لقد أرسلت عدداً كبيراً من الرسائل خلال وقت قصير. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
      message_de:
        "Sie haben in kurzer Zeit sehr viele Nachrichten gesendet. Bitte warten Sie einige Minuten und versuchen Sie es erneut.",
    };
  }

  // 3. Per-IP limit: 60 messages per hour
  const ipHash = hashIpAddress(params.clientIp);
  const ipBucket = await store.increment(
    `chat:ip:${ipHash}`,
    IP_WINDOW_MS,
    now
  );
  if (ipBucket.count > IP_RATE_LIMIT) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((ipBucket.expiresAt.getTime() - now.getTime()) / 1000)
    );
    return {
      allowed: false,
      reason: "IP_LIMIT",
      retryAfterSeconds,
      message_en:
        "Hourly message limit reached from this network. Please try again later or message us on WhatsApp.",
      message_ar:
        "تم الوصول إلى الحد المسموح للرسائل خلال الساعة من هذه الشبكة. يرجى المحاولة لاحقاً أو مراسلتنا عبر واتساب.",
      message_de:
        "Das stündliche Nachrichtenlimit für dieses Netzwerk wurde erreicht. Bitte versuchen Sie es später erneut oder schreiben Sie uns auf WhatsApp.",
    };
  }

  return { allowed: true };
}

export async function consumeDailyModelCall(params?: {
  store?: RateLimitStore;
  now?: Date;
  dailyLimit?: number;
}): Promise<void> {
  const store = params?.store ?? postgresRateLimitStore;
  const now = params?.now ?? new Date();
  const dailyLimit = params?.dailyLimit ?? getDailyModelCallLimit();
  const dailyKey = getDailyBucketKey(now);

  const state = await store.increment(dailyKey, 26 * 60 * 60 * 1000, now);
  if (state.count > dailyLimit) {
    throw new DailyModelCapExceededError();
  }
}

export async function checkAdminLoginRateLimit(params: {
  clientIp: string;
  store?: RateLimitStore;
  now?: Date;
}): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const store = params.store ?? postgresRateLimitStore;
  const now = params.now ?? new Date();
  const ipHash = hashIpAddress(params.clientIp);

  const bucket = await store.increment(
    `admin:login:${ipHash}`,
    ADMIN_LOGIN_WINDOW_MS,
    now
  );
  if (bucket.count > ADMIN_LOGIN_RATE_LIMIT) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((bucket.expiresAt.getTime() - now.getTime()) / 1000)
      ),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Tracks repeated `/api/chat` failures (3+ in 10 minutes) and returns `true`
 * at most once per 30 minutes so the owner gets an alert without spam.
 */
export async function recordChatErrorAndCheckAlertCooldown(params?: {
  store?: RateLimitStore;
  now?: Date;
}): Promise<boolean> {
  const store = params?.store ?? postgresRateLimitStore;
  const now = params?.now ?? new Date();

  const recentErrors = await store.increment(
    "errors:chat:10m",
    10 * 60 * 1000,
    now
  );
  if (recentErrors.count < 3) {
    return false;
  }

  const alertLock = await store.increment(
    "alert:chat_error:30m",
    30 * 60 * 1000,
    now
  );
  return alertLock.count === 1;
}
