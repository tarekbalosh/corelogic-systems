import { describe, expect, it } from "vitest";
import {
  convertAnthropicParamsToOpenAi,
  createOpenAiCompatStreamClient,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_GROQ_MODEL,
  GEMINI_OPENAI_BASE_URL,
  GROQ_OPENAI_BASE_URL,
  resolveAiProviderConfig,
} from "@/lib/agent/openai-compat-adapter";

function makeSseResponse(lines: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`${lines.join("\n")}\n`));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

describe("OpenAI-compatible free-tier AI provider adapter (Gemini / Groq)", () => {
  it("auto-selects Gemini free tier when GEMINI_API_KEY is configured", () => {
    const cfg = resolveAiProviderConfig({
      GEMINI_API_KEY: "AIzaSyFakeKeyForUnitTest1234567890",
      ANTHROPIC_API_KEY: "sk-ant-unused",
    } as unknown as NodeJS.ProcessEnv);

    expect(cfg.provider).toBe("gemini");
    expect(cfg.model).toBe(DEFAULT_GEMINI_MODEL);
    expect(cfg.openAiCompat?.baseUrl).toBe(GEMINI_OPENAI_BASE_URL);
  });

  it("auto-selects Groq free tier when GROQ_API_KEY is configured without Gemini", () => {
    const cfg = resolveAiProviderConfig({
      GROQ_API_KEY: "gsk_fake_key_123",
    } as unknown as NodeJS.ProcessEnv);

    expect(cfg.provider).toBe("groq");
    expect(cfg.model).toBe(DEFAULT_GROQ_MODEL);
    expect(cfg.openAiCompat?.baseUrl).toBe(GROQ_OPENAI_BASE_URL);
  });

  it("converts Anthropic tool_use and tool_result blocks to OpenAI format", () => {
    const converted = convertAnthropicParamsToOpenAi({
      model: "gemini-2.5-flash",
      max_tokens: 1024,
      stream: true,
      system: "You are helpful.",
      tools: [
        {
          name: "get_available_slots",
          description: "Get slots",
          input_schema: { type: "object", properties: {} },
        },
      ],
      messages: [
        { role: "user", content: "Show slots" },
        {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: "call_1",
              name: "get_available_slots",
              input: { daysAhead: 7 },
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: "call_1",
              content: '{"ok":true,"slots":[]}',
            },
          ],
        },
      ],
    });

    expect(converted.messages[0]).toEqual({
      role: "system",
      content: "You are helpful.",
    });
    expect(converted.messages[2].tool_calls?.[0]?.function.name).toBe(
      "get_available_slots"
    );
    expect(converted.messages[3]).toEqual({
      role: "tool",
      tool_call_id: "call_1",
      content: '{"ok":true,"slots":[]}',
    });
    expect(converted.tools?.[0]?.function.name).toBe("get_available_slots");
  });

  it("streams text and tool_calls from SSE into Anthropic stream events", async () => {
    const fakeFetch: typeof fetch = async () =>
      makeSseResponse([
        `data: ${JSON.stringify({
          choices: [{ delta: { content: "مرحباً " } }],
        })}`,
        `data: ${JSON.stringify({
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    index: 0,
                    id: "call_abc",
                    function: { name: "get_available_slots", arguments: '{"days' },
                  },
                ],
              },
            },
          ],
        })}`,
        `data: ${JSON.stringify({
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    index: 0,
                    function: { arguments: 'Ahead":7}' },
                  },
                ],
              },
            },
          ],
        })}`,
        "data: [DONE]",
      ]);

    const client = createOpenAiCompatStreamClient(
      {
        provider: "gemini",
        apiKey: "AIzaFake",
        baseUrl: GEMINI_OPENAI_BASE_URL,
        defaultModel: DEFAULT_GEMINI_MODEL,
      },
      fakeFetch
    );

    const stream = await client.messages.create({
      model: DEFAULT_GEMINI_MODEL,
      max_tokens: 512,
      stream: true,
      messages: [{ role: "user", content: "hi" }],
    });

    const events = [];
    for await (const ev of stream) {
      events.push(ev);
    }

    expect(
      events.some(
        (e) =>
          e.type === "content_block_delta" &&
          e.delta.type === "text_delta" &&
          e.delta.text === "مرحباً "
      )
    ).toBe(true);

    expect(
      events.some(
        (e) =>
          e.type === "content_block_start" &&
          e.content_block.type === "tool_use" &&
          e.content_block.name === "get_available_slots"
      )
    ).toBe(true);

    const jsonParts = events
      .filter(
        (e) =>
          e.type === "content_block_delta" && e.delta.type === "input_json_delta"
      )
      .map((e) =>
        e.type === "content_block_delta" && e.delta.type === "input_json_delta"
          ? e.delta.partial_json
          : ""
      )
      .join("");

    expect(jsonParts).toBe('{"daysAhead":7}');
  });
});
