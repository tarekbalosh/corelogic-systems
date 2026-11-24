import {
  getWhatsAppApiVersion,
  isWhatsAppEnabled,
  normalizeDigitsOnlyPhone,
  WHATSAPP_CONFIG,
} from "@/lib/whatsapp/config";
import { maskPhone, safeLogError, safeLogInfo, safeLogWarn } from "@/lib/security/mask";

export type WhatsAppTemplateParameter =
  | { type: "text"; text: string }
  | { type: "payload"; payload: string };

export type WhatsAppTemplateComponent =
  | {
      type: "body" | "header";
      parameters: WhatsAppTemplateParameter[];
    }
  | {
      type: "button";
      sub_type: "quick_reply";
      index: "0" | "1" | "2";
      parameters: Array<{ type: "payload"; payload: string }>;
    };

export interface SendTemplateParams {
  to: string;
  name: string;
  languageCode: string;
  components?: WhatsAppTemplateComponent[];
}

export interface SendTextParams {
  to: string;
  body: string;
}

export interface WhatsAppClientOptions {
  fetchFn?: typeof fetch;
  phoneNumberId?: string;
  accessToken?: string;
  apiVersion?: string;
  enabled?: boolean;
  timeoutMs?: number;
  maxRetries?: number;
  initialBackoffMs?: number;
}

export interface WhatsAppSendResult {
  skipped: boolean;
  messageId: string | null;
}

export class WhatsAppApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WhatsAppApiError";
    this.status = status;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

async function postGraphMessages(
  payload: Record<string, unknown>,
  recipientForLog: string,
  options: WhatsAppClientOptions = {}
): Promise<WhatsAppSendResult> {
  const enabled = options.enabled ?? isWhatsAppEnabled();
  if (!enabled) {
    safeLogInfo("whatsapp.send.skipped_disabled", {
      to: maskPhone(recipientForLog),
      type: payload.type,
    });
    return { skipped: true, messageId: null };
  }

  const phoneNumberId =
    options.phoneNumberId ?? process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? "";
  const accessToken =
    options.accessToken ?? process.env.WHATSAPP_ACCESS_TOKEN?.trim() ?? "";

  if (!phoneNumberId || !accessToken) {
    throw new WhatsAppApiError(
      "Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN.",
      500
    );
  }

  const apiVersion = options.apiVersion ?? getWhatsAppApiVersion();
  const fetchImpl = options.fetchFn ?? fetch;
  const timeoutMs = options.timeoutMs ?? WHATSAPP_CONFIG.requestTimeoutMs;
  const maxRetries = options.maxRetries ?? WHATSAPP_CONFIG.maxRetries;
  const initialBackoffMs =
    options.initialBackoffMs ?? WHATSAPP_CONFIG.initialBackoffMs;

  const url = `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(
    phoneNumberId
  )}/messages`;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          messages?: Array<{ id?: string }>;
        };
        const messageId = data.messages?.[0]?.id ?? null;
        safeLogInfo("whatsapp.send.ok", {
          to: maskPhone(recipientForLog),
          type: payload.type,
          messageId,
          attempt,
        });
        return { skipped: false, messageId };
      }

      if (isTransientStatus(response.status) && attempt < maxRetries) {
        const delay = initialBackoffMs * Math.pow(2, attempt);
        safeLogWarn("whatsapp.send.retry_transient", {
          to: maskPhone(recipientForLog),
          status: response.status,
          attempt,
          delayMs: delay,
        });
        await sleep(delay);
        continue;
      }

      const errBody = await response.text().catch(() => "");
      throw new WhatsAppApiError(
        `Meta WhatsApp Graph API returned HTTP ${response.status}: ${errBody.slice(0, 200)}`,
        response.status
      );
    } catch (error) {
      lastError = error;
      const isAbort =
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError");

      if (
        !(error instanceof WhatsAppApiError) &&
        (isAbort || error instanceof TypeError) &&
        attempt < maxRetries
      ) {
        const delay = initialBackoffMs * Math.pow(2, attempt);
        safeLogWarn("whatsapp.send.retry_network", {
          to: maskPhone(recipientForLog),
          attempt,
          delayMs: delay,
          isTimeout: isAbort,
        });
        await sleep(delay);
        continue;
      }

      safeLogError("whatsapp.send.failed", error, {
        to: maskPhone(recipientForLog),
        type: payload.type,
        attempt,
      });
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new WhatsAppApiError("WhatsApp send failed after retries.", 502);
}

/**
 * Sends a pre-approved Meta WhatsApp Utility Template message.
 */
export async function sendTemplate(
  params: SendTemplateParams,
  options: WhatsAppClientOptions = {}
): Promise<WhatsAppSendResult> {
  const recipientDigits = normalizeDigitsOnlyPhone(params.to);
  if (!recipientDigits) {
    throw new WhatsAppApiError("Recipient WhatsApp number is empty.", 400);
  }

  return postGraphMessages(
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientDigits,
      type: "template",
      template: {
        name: params.name,
        language: { code: params.languageCode },
        ...(params.components && params.components.length > 0
          ? { components: params.components }
          : {}),
      },
    },
    recipientDigits,
    options
  );
}

/**
 * Sends a free-form WhatsApp text reply inside an active 24-hour customer/owner window.
 */
export async function sendText(
  params: SendTextParams,
  options: WhatsAppClientOptions = {}
): Promise<WhatsAppSendResult> {
  const recipientDigits = normalizeDigitsOnlyPhone(params.to);
  if (!recipientDigits) {
    throw new WhatsAppApiError("Recipient WhatsApp number is empty.", 400);
  }

  return postGraphMessages(
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientDigits,
      type: "text",
      text: {
        preview_url: false,
        body: params.body.slice(0, 4096),
      },
    },
    recipientDigits,
    options
  );
}
