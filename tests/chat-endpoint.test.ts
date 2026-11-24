import type Anthropic from "@anthropic-ai/sdk";
import type { MessageRole } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import {
  MAX_TOOL_ITERATIONS,
  runChatTurn,
  type AnthropicStreamClient,
  type ChatSseEvent,
  type ConversationPersistenceAdapter,
} from "@/lib/agent/runner";
import type { ToolExecutionResult } from "@/lib/agent/tools";
import { getSessionAuthorizedBookingStatus } from "@/lib/booking/status-query";

function makeStreamFromBlocks(
  blocks: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  >
): AsyncIterable<Anthropic.Messages.RawMessageStreamEvent> {
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        type: "message_start",
        message: {
          usage: { input_tokens: 120, output_tokens: 5 },
        },
      } as unknown as Anthropic.Messages.RawMessageStreamEvent;

      for (let i = 0; i < blocks.length; i += 1) {
        const blk = blocks[i];
        if (blk.type === "text") {
          yield {
            type: "content_block_start",
            index: i,
            content_block: { type: "text", text: "" },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
          yield {
            type: "content_block_delta",
            index: i,
            delta: { type: "text_delta", text: blk.text },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
        } else {
          yield {
            type: "content_block_start",
            index: i,
            content_block: {
              type: "tool_use",
              id: blk.id,
              name: blk.name,
              input: {},
            },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
          yield {
            type: "content_block_delta",
            index: i,
            delta: {
              type: "input_json_delta",
              partial_json: JSON.stringify(blk.input),
            },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
        }
        yield {
          type: "content_block_stop",
          index: i,
        } as unknown as Anthropic.Messages.RawMessageStreamEvent;
      }

      yield {
        type: "message_delta",
        usage: { output_tokens: 30 },
      } as unknown as Anthropic.Messages.RawMessageStreamEvent;
    },
  };
}

function createMemoryConversationStore() {
  const savedMessages: Array<{ role: MessageRole; content: string }> = [];
  let storedLanguage: string | null = null;

  const store: ConversationPersistenceAdapter = {
    async findOrCreateConversation(sessionId, detectedLanguage) {
      storedLanguage = detectedLanguage;
      return {
        id: "conv_test_1",
        sessionId,
        language: storedLanguage,
        messageCount: savedMessages.length,
      };
    },
    async loadRecentMessages(_conversationId, limit) {
      return savedMessages.slice(-limit);
    },
    async saveMessage(_conversationId, role, content) {
      savedMessages.push({ role, content });
    },
    async updateConversationLanguage(_conversationId, language) {
      storedLanguage = language;
    },
  };

  return { store, savedMessages, getLanguage: () => storedLanguage };
}

const VALID_SESSION_ID = "11111111-1111-4111-8111-111111111111";

describe("streaming chat runner & tool loop (Step 8)", () => {
  it("(a) streams a plain assistant text answer and persists user + assistant messages", async () => {
    const { store, savedMessages, getLanguage } = createMemoryConversationStore();
    const events: ChatSseEvent[] = [];

    const mockClient: AnthropicStreamClient = {
      messages: {
        create: vi.fn(async () =>
          makeStreamFromBlocks([
            {
              type: "text",
              text: "مرحباً بك في كورلوجيك سيستمز! كيف يمكننا مساعدتك في مشروعك؟",
            },
          ])
        ),
      },
    };

    await runChatTurn({
      request: {
        sessionId: VALID_SESSION_ID,
        message: "مرحبا، ما هي خدماتكم؟",
      },
      emit: (ev) => events.push(ev),
      store,
      anthropicClient: mockClient,
      modelName: "claude-test-model",
      systemPromptFn: () => "<role>Test</role>",
    });

    expect(getLanguage()).toBe("ar");
    expect(events).toEqual([
      {
        type: "text",
        delta: "مرحباً بك في كورلوجيك سيستمز! كيف يمكننا مساعدتك في مشروعك؟",
      },
      { type: "done" },
    ]);
    expect(savedMessages).toEqual([
      { role: "user", content: "مرحبا، ما هي خدماتكم؟" },
      {
        role: "assistant",
        content: "مرحباً بك في كورلوجيك سيستمز! كيف يمكننا مساعدتك في مشروعك؟",
      },
    ]);
  });

  it("(b) executes save_lead tool call then streams the final assistant answer", async () => {
    const { store, savedMessages } = createMemoryConversationStore();
    const events: ChatSseEvent[] = [];

    let callIndex = 0;
    const mockClient: AnthropicStreamClient = {
      messages: {
        create: vi.fn(async () => {
          callIndex += 1;
          if (callIndex === 1) {
            return makeStreamFromBlocks([
              {
                type: "tool_use",
                id: "toolu_save_1",
                name: "save_lead",
                input: {
                  name: "Lina",
                  whatsappNumber: "+60123456789",
                  requestType: "QUOTE",
                  projectDescription: "Custom CRM",
                  consent: true,
                },
              },
            ]);
          }
          return makeStreamFromBlocks([
            {
              type: "text",
              text: "Thank you, Lina! Your details have been shared with our team.",
            },
          ]);
        }),
      },
    };

    const executeToolFn = vi.fn(
      async (): Promise<ToolExecutionResult> => ({
        ok: true,
        leadId: "lead_42",
      })
    );

    await runChatTurn({
      request: {
        sessionId: VALID_SESSION_ID,
        message: "Yes, everything is correct and you may message me on WhatsApp.",
      },
      emit: (ev) => events.push(ev),
      store,
      anthropicClient: mockClient,
      modelName: "claude-test-model",
      systemPromptFn: () => "<role>Test</role>",
      executeToolFn,
    });

    expect(executeToolFn).toHaveBeenCalledTimes(1);
    expect(executeToolFn).toHaveBeenCalledWith(
      "save_lead",
      expect.objectContaining({ consent: true, name: "Lina" }),
      { conversationId: "conv_test_1", sessionId: VALID_SESSION_ID }
    );
    expect(savedMessages[savedMessages.length - 1]).toEqual({
      role: "assistant",
      content: "Thank you, Lina! Your details have been shared with our team.",
    });
    expect(events[events.length - 1]).toEqual({ type: "done" });
  });

  it("(c) emits 'slots' and 'booking' SSE events during get_available_slots + book_appointment sequence", async () => {
    const { store } = createMemoryConversationStore();
    const events: ChatSseEvent[] = [];

    const sampleSlot = {
      startsAt: "2026-11-25T02:00:00.000Z",
      endsAt: "2026-11-25T02:30:00.000Z",
      label_en: "Wednesday, Nov 25, 2026 · 10:00 AM – 10:30 AM MYT (Malaysia time)",
      label_ar: "الأربعاء، 25 نوفمبر 2026 · 10:00 ص – 10:30 ص بتوقيت ماليزيا — MYT (Malaysia time)",
      dayKey: "2026-11-25",
      dayLabel_en: "Wednesday, Nov 25, 2026",
      dayLabel_ar: "الأربعاء، 25 نوفمبر 2026",
      timeRange_en: "10:00 AM – 10:30 AM",
      timeRange_ar: "10:00 ص – 10:30 ص",
    };

    let turnCall = 0;
    const mockClient: AnthropicStreamClient = {
      messages: {
        create: vi.fn(async () => {
          turnCall += 1;
          if (turnCall === 1) {
            return makeStreamFromBlocks([
              {
                type: "tool_use",
                id: "toolu_slots",
                name: "get_available_slots",
                input: { daysAhead: 7 },
              },
            ]);
          }
          if (turnCall === 2) {
            return makeStreamFromBlocks([
              {
                type: "tool_use",
                id: "toolu_book",
                name: "book_appointment",
                input: { startsAt: sampleSlot.startsAt },
              },
            ]);
          }
          return makeStreamFromBlocks([
            {
              type: "text",
              text: "Your booking request for Wednesday at 10:00 AM MYT has been received and is pending confirmation.",
            },
          ]);
        }),
      },
    };

    const executeToolFn = vi.fn(
      async (toolName: string): Promise<ToolExecutionResult> => {
        if (toolName === "get_available_slots") {
          return {
            ok: true,
            slots: [sampleSlot],
            moreAvailable: false,
            timezone: "Asia/Kuala_Lumpur",
          };
        }
        return {
          ok: true,
          bookingId: "bk_777",
          status: "PENDING",
          startsAt: sampleSlot.startsAt,
          endsAt: sampleSlot.endsAt,
          label_en: sampleSlot.label_en,
          label_ar: sampleSlot.label_ar,
        };
      }
    );

    await runChatTurn({
      request: {
        sessionId: VALID_SESSION_ID,
        message: "Please check slots and book Wednesday 10:00 AM MYT.",
        selectedSlot: sampleSlot.startsAt,
      },
      emit: (ev) => events.push(ev),
      store,
      anthropicClient: mockClient,
      modelName: "claude-test-model",
      systemPromptFn: () => "<role>Test</role>",
      executeToolFn,
    });

    const slotsEvent = events.find((e) => e.type === "slots");
    const bookingEvent = events.find((e) => e.type === "booking");
    expect(slotsEvent).toBeDefined();
    expect(bookingEvent).toMatchObject({
      type: "booking",
      bookingId: "bk_777",
      status: "PENDING",
      startsAt: sampleSlot.startsAt,
    });
  });

  it("(d) cuts an infinite tool-call loop cleanly at MAX_TOOL_ITERATIONS (6)", async () => {
    const { store, savedMessages } = createMemoryConversationStore();
    const events: ChatSseEvent[] = [];

    let modelCalls = 0;
    const mockClient: AnthropicStreamClient = {
      messages: {
        create: vi.fn(async () => {
          modelCalls += 1;
          return makeStreamFromBlocks([
            {
              type: "tool_use",
              id: `toolu_loop_${modelCalls}`,
              name: "get_available_slots",
              input: {},
            },
          ]);
        }),
      },
    };

    const executeToolFn = vi.fn(
      async (): Promise<ToolExecutionResult> => ({
        ok: true,
        slots: [],
        moreAvailable: false,
        timezone: "Asia/Kuala_Lumpur",
      })
    );

    await runChatTurn({
      request: {
        sessionId: VALID_SESSION_ID,
        message: "Show me slots",
      },
      emit: (ev) => events.push(ev),
      store,
      anthropicClient: mockClient,
      modelName: "claude-test-model",
      systemPromptFn: () => "<role>Test</role>",
      executeToolFn,
    });

    expect(modelCalls).toBe(MAX_TOOL_ITERATIONS); // Strictly capped at 6
    // Tool executes on iterations 0..4 (5 times) and is cut right after the 6th model response!
    expect(executeToolFn).toHaveBeenCalledTimes(MAX_TOOL_ITERATIONS - 1);
    expect(savedMessages).toHaveLength(2); // user + fallback assistant text
    expect(events[events.length - 1]).toEqual({ type: "done" });
  });

  it("returns { status } only when sessionId owns the booking's lead conversation, and null (404) otherwise", async () => {
    const fakeStore = {
      findBookingStatusForSession: vi.fn(
        async (bookingId: string, sessionId: string) =>
          bookingId === "bk_owned" && sessionId === VALID_SESSION_ID
            ? ("CONFIRMED" as const)
            : null
      ),
    };

    const owned = await getSessionAuthorizedBookingStatus(
      "bk_owned",
      VALID_SESSION_ID,
      fakeStore
    );
    expect(owned).toEqual({ status: "CONFIRMED" });

    const wrongSession = await getSessionAuthorizedBookingStatus(
      "bk_owned",
      "99999999-9999-4999-8999-999999999999",
      fakeStore
    );
    expect(wrongSession).toBeNull();

    const invalidUuid = await getSessionAuthorizedBookingStatus(
      "bk_owned",
      "not-a-uuid",
      fakeStore
    );
    expect(invalidUuid).toBeNull();
  });
});
