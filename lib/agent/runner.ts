import Anthropic from "@anthropic-ai/sdk";
import type { MessageRole } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/db";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import {
  executeTool,
  toolDefinitions,
  type ToolExecutionContext,
  type ToolExecutionResult,
} from "@/lib/agent/tools";
import type { AvailableSlot } from "@/lib/booking/availability";
import {
  safeLogError,
  safeLogInfo,
  safeLogWarn,
  stripControlChars,
} from "@/lib/security/mask";

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_TOOL_ITERATIONS = 6;
export const DEFAULT_MAX_TOKENS = 1024;

export const ChatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(MAX_MESSAGE_CHARS),
  clientLanguage: z.enum(["ar", "en"]).optional(),
  selectedSlot: z
    .string()
    .trim()
    .max(64)
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "selectedSlot must be a valid ISO timestamp",
    })
    .optional(),
  // Optional bot-protection fields (Step 10)
  website_url: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type ChatRequestPayload = z.infer<typeof ChatRequestSchema>;

export type ChatSseEvent =
  | { type: "text"; delta: string }
  | { type: "slots"; slots: AvailableSlot[]; moreAvailable?: boolean }
  | {
      type: "booking";
      bookingId: string;
      status: "PENDING";
      label: string;
      label_en: string;
      label_ar: string;
      startsAt: string;
    }
  | { type: "error"; code: string; message: string }
  | { type: "done" };

export interface ConversationPersistenceAdapter {
  findOrCreateConversation(
    sessionId: string,
    detectedLanguage: "ar" | "en"
  ): Promise<{
    id: string;
    sessionId: string;
    language: string | null;
    messageCount: number;
  }>;
  loadRecentMessages(
    conversationId: string,
    limit: number
  ): Promise<Array<{ role: MessageRole; content: string }>>;
  saveMessage(
    conversationId: string,
    role: MessageRole,
    content: string
  ): Promise<void>;
  updateConversationLanguage(
    conversationId: string,
    language: "ar" | "en"
  ): Promise<void>;
}

export const prismaConversationStore: ConversationPersistenceAdapter = {
  async findOrCreateConversation(sessionId, detectedLanguage) {
    const conv = await prisma.conversation.upsert({
      where: { sessionId },
      update: { language: detectedLanguage },
      create: { sessionId, language: detectedLanguage },
      include: {
        _count: { select: { messages: true } },
      },
    });
    return {
      id: conv.id,
      sessionId: conv.sessionId,
      language: conv.language,
      messageCount: conv._count.messages,
    };
  },
  async loadRecentMessages(conversationId, limit) {
    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { role: true, content: true },
    });
    return rows.reverse();
  },
  async saveMessage(conversationId, role, content) {
    await prisma.message.create({
      data: { conversationId, role, content },
    });
  },
  async updateConversationLanguage(conversationId, language) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { language },
    });
  },
};

export interface AnthropicStreamClient {
  messages: {
    create(
      params: Anthropic.Messages.MessageCreateParamsStreaming
    ): Promise<AsyncIterable<Anthropic.Messages.RawMessageStreamEvent>>;
  };
}

let cachedAnthropicClient: Anthropic | null = null;

function getDefaultAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  if (!cachedAnthropicClient) {
    cachedAnthropicClient = new Anthropic({
      apiKey,
      timeout: 45_000,
      maxRetries: 1,
    });
  }
  return cachedAnthropicClient;
}

/**
 * Detects message language ("ar" or "en") using Arabic vs Latin script character ratio.
 */
export function detectMessageLanguage(
  text: string,
  fallback?: "ar" | "en"
): "ar" | "en" {
  const arabicMatches = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g);
  const latinMatches = text.match(/[A-Za-z]/g);
  const arCount = arabicMatches?.length ?? 0;
  const enCount = latinMatches?.length ?? 0;
  const total = arCount + enCount;

  if (total === 0) {
    return fallback ?? "en";
  }
  return arCount / total >= 0.2 ? "ar" : "en";
}

export function getFriendlyErrorMessage(lang: "ar" | "en"): string {
  if (lang === "ar") {
    return "نعتذر، يواجه المساعد الذكي ضغطاً مؤقتاً حالياً. يرجى المحاولة مرة أخرى بعد قليل أو التواصل معنا مباشرة عبر صفحة اتصل بنا أو واتساب.";
  }
  return "Sorry, the assistant is temporarily unavailable right now. Please try again in a moment or reach our team directly via the Contact page or WhatsApp.";
}

function getLoopCapFallbackMessage(lang: "ar" | "en"): string {
  if (lang === "ar") {
    return "شكراً لك. لقد سجّلنا تفاصيل طلبك، وسيتابع فريق كورلوجيك سيستمز معك مباشرة لتأكيد الخطوة التالية.";
  }
  return "Thank you. I have recorded the details so far, and our team at Core Logic Systems can assist you directly with the next step.";
}

/**
 * Defense-in-depth output scrubber ensuring internal XML prompt tags, secret prefixes,
 * or private owner numbers (when distinct from public phone) are never leaked to clients.
 */
export function sanitizeAssistantOutput(text: string): string {
  let out = text
    .replace(
      /<\/?(?:role|knowledge|behavior|lead_collection|booking_flow|tools_usage|safety|language)>/gi,
      ""
    )
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "[REDACTED]")
    .replace(/EAA[A-Za-z0-9]{12,}/g, "[REDACTED]");

  const ownerDigits = process.env.OWNER_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const publicDigits = "601169397149";
  if (ownerDigits && ownerDigits.length >= 8 && ownerDigits !== publicDigits) {
    const escaped = ownerDigits.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\+?${escaped}`, "g"), "[protected]");
  }

  return out;
}

function sanitizeToolResultForModel(result: ToolExecutionResult): ToolExecutionResult {
  if (result.ok) {
    return result;
  }
  // Ensure only clean error codes/messages reach the model — never stack traces or env vars
  return {
    ok: false,
    error: result.error.slice(0, 300),
    ...(result.message ? { message: result.message.slice(0, 300) } : {}),
    ...(result.availableSlots ? { availableSlots: result.availableSlots } : {}),
  };
}

function coalesceAlternatingHistory(
  history: Array<{ role: MessageRole; content: string }>
): Anthropic.Messages.MessageParam[] {
  const messages: Anthropic.Messages.MessageParam[] = [];
  for (const item of history) {
    const clean = stripControlChars(item.content).trim();
    if (!clean) continue;

    const prev = messages[messages.length - 1];
    if (prev && prev.role === item.role && typeof prev.content === "string") {
      prev.content = `${prev.content}\n\n${clean}`;
    } else {
      messages.push({ role: item.role, content: clean });
    }
  }

  // Anthropic Messages API requires the first message to have role "user"
  while (messages.length > 0 && messages[0].role !== "user") {
    messages.shift();
  }

  return messages;
}

export interface RunChatTurnOptions {
  request: ChatRequestPayload;
  emit: (event: ChatSseEvent) => void;
  store?: ConversationPersistenceAdapter;
  anthropicClient?: AnthropicStreamClient;
  modelName?: string;
  systemPromptFn?: () => string;
  executeToolFn?: (
    name: string,
    input: unknown,
    ctx: ToolExecutionContext
  ) => Promise<ToolExecutionResult>;
  onModelCallRecorded?: () => Promise<void>;
  onUnhandledChatError?: (error: unknown) => Promise<void>;
}

/**
 * Executes a full streaming chat turn (context load -> save user message -> Anthropic
 * streaming tool loop capped at 6 iterations -> save assistant reply -> emit SSE events).
 */
export async function runChatTurn(options: RunChatTurnOptions): Promise<void> {
  const store = options.store ?? prismaConversationStore;
  const executeToolImpl = options.executeToolFn ?? executeTool;
  const systemPromptBuilder = options.systemPromptFn ?? (() => buildSystemPrompt());

  const cleanedUserText = stripControlChars(options.request.message).trim();
  if (!cleanedUserText) {
    options.emit({
      type: "error",
      code: "INVALID_MESSAGE",
      message: "Message cannot be empty.",
    });
    options.emit({ type: "done" });
    return;
  }

  const detectedLanguage = detectMessageLanguage(
    cleanedUserText,
    options.request.clientLanguage
  );

  // Append structured selected_slot marker when the UI sends a clicked slot
  const modelFacingUserText = options.request.selectedSlot
    ? `${cleanedUserText}\n[selected_slot: ${options.request.selectedSlot}]`
    : cleanedUserText;

  let conversationId = "";
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  try {
    const conversation = await store.findOrCreateConversation(
      options.request.sessionId,
      detectedLanguage
    );
    conversationId = conversation.id;

    const priorMessages = await store.loadRecentMessages(
      conversation.id,
      MAX_HISTORY_MESSAGES
    );

    // Save the visible user message before calling the model
    await store.saveMessage(conversation.id, "user", cleanedUserText);

    const model = (options.modelName ?? process.env.ANTHROPIC_MODEL ?? "").trim();
    if (!model) {
      throw new Error("ANTHROPIC_MODEL environment variable is not set.");
    }

    const client =
      options.anthropicClient ??
      (getDefaultAnthropicClient() as unknown as AnthropicStreamClient);

    const historyWithCurrent = coalesceAlternatingHistory([
      ...priorMessages,
      { role: "user", content: modelFacingUserText },
    ]);

    const systemPrompt = systemPromptBuilder();
    let finalAssistantText = "";
    let reachedLoopCap = true;

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
      if (options.onModelCallRecorded) {
        await options.onModelCallRecorded();
      }

      const stream = await client.messages.create({
        model,
        max_tokens: DEFAULT_MAX_TOKENS,
        system: systemPrompt,
        tools: toolDefinitions,
        messages: historyWithCurrent,
        stream: true,
      });

      const blockAccumulators = new Map<
        number,
        | { type: "text"; text: string }
        | { type: "tool_use"; id: string; name: string; inputJson: string }
      >();

      for await (const event of stream) {
        if (event.type === "message_start") {
          totalInputTokens += event.message.usage?.input_tokens ?? 0;
          totalOutputTokens += event.message.usage?.output_tokens ?? 0;
        } else if (event.type === "message_delta") {
          totalOutputTokens += event.usage?.output_tokens ?? 0;
        } else if (event.type === "content_block_start") {
          if (event.content_block.type === "text") {
            const initial = event.content_block.text ?? "";
            blockAccumulators.set(event.index, { type: "text", text: initial });
            if (initial) {
              const safeInitial = sanitizeAssistantOutput(initial);
              finalAssistantText += safeInitial;
              options.emit({ type: "text", delta: safeInitial });
            }
          } else if (event.content_block.type === "tool_use") {
            blockAccumulators.set(event.index, {
              type: "tool_use",
              id: event.content_block.id,
              name: event.content_block.name,
              inputJson: "",
            });
          }
        } else if (event.type === "content_block_delta") {
          const acc = blockAccumulators.get(event.index);
          if (
            acc &&
            acc.type === "text" &&
            event.delta.type === "text_delta"
          ) {
            const safeDelta = sanitizeAssistantOutput(event.delta.text);
            acc.text += safeDelta;
            finalAssistantText += safeDelta;
            if (safeDelta) {
              options.emit({ type: "text", delta: safeDelta });
            }
          } else if (
            acc &&
            acc.type === "tool_use" &&
            event.delta.type === "input_json_delta"
          ) {
            acc.inputJson += event.delta.partial_json;
          }
        }
      }

      const orderedBlocks = [...blockAccumulators.entries()]
        .sort(([a], [b]) => a - b)
        .map(([, block]) => block);

      const toolCalls = orderedBlocks.filter(
        (
          b
        ): b is {
          type: "tool_use";
          id: string;
          name: string;
          inputJson: string;
        } => b.type === "tool_use"
      );

      if (toolCalls.length === 0) {
        reachedLoopCap = false;
        break;
      }

      // If this was the final allowed iteration (iteration === 5 -> 6th call), cut the loop!
      if (iteration + 1 >= MAX_TOOL_ITERATIONS) {
        safeLogWarn("chat.tool_loop.max_iterations_reached", {
          conversationId: conversation.id,
          iterations: MAX_TOOL_ITERATIONS,
        });
        break;
      }

      // Build assistant content blocks for conversation continuation
      const assistantContentBlocks: Anthropic.Messages.ContentBlockParam[] = [];
      for (const blk of orderedBlocks) {
        if (blk.type === "text" && blk.text.trim().length > 0) {
          assistantContentBlocks.push({ type: "text", text: blk.text });
        } else if (blk.type === "tool_use") {
          let parsedInput: Record<string, unknown> = {};
          if (blk.inputJson.trim()) {
            try {
              parsedInput = JSON.parse(blk.inputJson) as Record<string, unknown>;
            } catch {
              parsedInput = {};
            }
          }
          assistantContentBlocks.push({
            type: "tool_use",
            id: blk.id,
            name: blk.name,
            input: parsedInput,
          });
        }
      }

      historyWithCurrent.push({
        role: "assistant",
        content: assistantContentBlocks,
      });

      const toolResultBlocks: Anthropic.Messages.ToolResultBlockParam[] = [];
      for (const call of toolCalls) {
        let parsedToolInput: unknown = {};
        if (call.inputJson.trim()) {
          try {
            parsedToolInput = JSON.parse(call.inputJson);
          } catch {
            parsedToolInput = null;
          }
        }

        const rawResult =
          parsedToolInput === null
            ? ({
                ok: false,
                error: "INVALID_JSON_INPUT: Tool arguments were malformed JSON.",
              } satisfies ToolExecutionResult)
            : await executeToolImpl(call.name, parsedToolInput, {
                conversationId: conversation.id,
                sessionId: options.request.sessionId,
              });

        // Emit structured UI events for slots & pending booking cards
        if (
          call.name === "get_available_slots" &&
          rawResult.ok &&
          "slots" in rawResult
        ) {
          options.emit({
            type: "slots",
            slots: rawResult.slots,
            moreAvailable: rawResult.moreAvailable,
          });
        } else if (
          call.name === "book_appointment" &&
          rawResult.ok &&
          "bookingId" in rawResult
        ) {
          options.emit({
            type: "booking",
            bookingId: rawResult.bookingId,
            status: rawResult.status,
            label:
              detectedLanguage === "ar"
                ? rawResult.label_ar
                : rawResult.label_en,
            label_en: rawResult.label_en,
            label_ar: rawResult.label_ar,
            startsAt: rawResult.startsAt,
          });
        } else if (
          call.name === "book_appointment" &&
          !rawResult.ok &&
          rawResult.error === "SLOT_UNAVAILABLE" &&
          rawResult.availableSlots &&
          rawResult.availableSlots.length > 0
        ) {
          options.emit({
            type: "slots",
            slots: rawResult.availableSlots,
          });
        }

        const safeResult = sanitizeToolResultForModel(rawResult);
        toolResultBlocks.push({
          type: "tool_result",
          tool_use_id: call.id,
          content: JSON.stringify(safeResult),
        });
      }

      historyWithCurrent.push({
        role: "user",
        content: toolResultBlocks,
      });
    }

    if (reachedLoopCap && finalAssistantText.trim().length === 0) {
      const fallback = getLoopCapFallbackMessage(detectedLanguage);
      finalAssistantText = fallback;
      options.emit({ type: "text", delta: fallback });
    }

    const sanitizedFinal = sanitizeAssistantOutput(finalAssistantText).trim();
    if (sanitizedFinal.length > 0) {
      await store.saveMessage(conversation.id, "assistant", sanitizedFinal);
    }

    safeLogInfo("chat.turn.completed", {
      conversationId: conversation.id,
      language: detectedLanguage,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
    });

    options.emit({ type: "done" });
  } catch (error) {
    safeLogError("chat.turn.failed", error, {
      conversationId: conversationId || null,
      language: detectedLanguage,
    });

    if (options.onUnhandledChatError) {
      await options.onUnhandledChatError(error).catch(() => {});
    }

    const friendly = getFriendlyErrorMessage(detectedLanguage);
    options.emit({
      type: "error",
      code: "ASSISTANT_UNAVAILABLE",
      message: friendly,
    });
    options.emit({ type: "done" });
  }
}

export function encodeSseEvent(event: ChatSseEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}
