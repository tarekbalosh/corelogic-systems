import type Anthropic from "@anthropic-ai/sdk";
import type { AnthropicStreamClient } from "@/lib/agent/runner";

export type SupportedAiProvider =
  | "anthropic"
  | "gemini"
  | "groq"
  | "openai_compatible";

export interface OpenAiCompatConfig {
  provider: Exclude<SupportedAiProvider, "anthropic">;
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}

interface OpenAiMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface OpenAiTool {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}

interface OpenAiStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string | null;
      tool_calls?: Array<{
        index?: number;
        id?: string;
        function?: {
          name?: string;
          arguments?: string;
        };
      }>;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

export const GEMINI_OPENAI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai";
export const GROQ_OPENAI_BASE_URL = "https://api.groq.com/openai/v1";

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * Resolves which AI provider & model should be used based on environment variables.
 * Supports free-tier providers (Google Gemini AI Studio, Groq, OpenAI-compatible)
 * as well as Anthropic Claude.
 */
export function resolveAiProviderConfig(env: NodeJS.ProcessEnv = process.env): {
  provider: SupportedAiProvider;
  model: string;
  openAiCompat?: OpenAiCompatConfig;
} {
  const explicit = env.AI_PROVIDER?.trim().toLowerCase();

  const geminiKey = env.GEMINI_API_KEY?.trim();
  const groqKey = env.GROQ_API_KEY?.trim();
  const compatKey = env.OPENAI_COMPAT_API_KEY?.trim();
  const compatBaseUrl = env.OPENAI_COMPAT_BASE_URL?.trim();

  if (explicit === "gemini" || (!explicit && geminiKey)) {
    if (!geminiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    const model = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    return {
      provider: "gemini",
      model,
      openAiCompat: {
        provider: "gemini",
        apiKey: geminiKey,
        baseUrl: env.GEMINI_BASE_URL?.trim() || GEMINI_OPENAI_BASE_URL,
        defaultModel: model,
      },
    };
  }

  if (explicit === "groq" || (!explicit && groqKey)) {
    if (!groqKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }
    const model = env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
    return {
      provider: "groq",
      model,
      openAiCompat: {
        provider: "groq",
        apiKey: groqKey,
        baseUrl: env.GROQ_BASE_URL?.trim() || GROQ_OPENAI_BASE_URL,
        defaultModel: model,
      },
    };
  }

  if (explicit === "openai_compatible" || (!explicit && compatKey && compatBaseUrl)) {
    if (!compatKey || !compatBaseUrl) {
      throw new Error(
        "OPENAI_COMPAT_API_KEY and OPENAI_COMPAT_BASE_URL must both be configured."
      );
    }
    const model = env.OPENAI_COMPAT_MODEL?.trim() || "";
    if (!model) {
      throw new Error("OPENAI_COMPAT_MODEL is not configured.");
    }
    return {
      provider: "openai_compatible",
      model,
      openAiCompat: {
        provider: "openai_compatible",
        apiKey: compatKey,
        baseUrl: compatBaseUrl.replace(/\/+$/, ""),
        defaultModel: model,
      },
    };
  }

  const anthropicModel = (env.ANTHROPIC_MODEL ?? "").trim();
  return {
    provider: "anthropic",
    model: anthropicModel,
  };
}

/**
 * Converts Anthropic Messages API parameters into an OpenAI Chat Completions payload.
 */
export function convertAnthropicParamsToOpenAi(
  params: Anthropic.Messages.MessageCreateParamsStreaming
): {
  model: string;
  max_tokens: number;
  stream: true;
  messages: OpenAiMessage[];
  tools?: OpenAiTool[];
} {
  const messages: OpenAiMessage[] = [];

  if (typeof params.system === "string" && params.system.trim()) {
    messages.push({ role: "system", content: params.system });
  } else if (Array.isArray(params.system)) {
    const systemText = params.system
      .map((blk) => (blk.type === "text" ? blk.text : ""))
      .filter(Boolean)
      .join("\n\n");
    if (systemText) {
      messages.push({ role: "system", content: systemText });
    }
  }

  for (const msg of params.messages) {
    if (typeof msg.content === "string") {
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
      continue;
    }

    if (msg.role === "assistant") {
      const textParts: string[] = [];
      const toolCalls: NonNullable<OpenAiMessage["tool_calls"]> = [];

      for (const blk of msg.content) {
        if (blk.type === "text" && blk.text) {
          textParts.push(blk.text);
        } else if (blk.type === "tool_use") {
          toolCalls.push({
            id: blk.id,
            type: "function",
            function: {
              name: blk.name,
              arguments: JSON.stringify(blk.input ?? {}),
            },
          });
        }
      }

      const assistantMsg: OpenAiMessage = {
        role: "assistant",
        content: textParts.length > 0 ? textParts.join("\n") : null,
      };
      if (toolCalls.length > 0) {
        assistantMsg.tool_calls = toolCalls;
      }
      messages.push(assistantMsg);
    } else {
      // User message with content blocks (tool_result and/or text)
      const userTextParts: string[] = [];
      for (const blk of msg.content) {
        if (blk.type === "tool_result") {
          const contentStr =
            typeof blk.content === "string"
              ? blk.content
              : Array.isArray(blk.content)
                ? blk.content
                    .map((c) => (c.type === "text" ? c.text : JSON.stringify(c)))
                    .join("\n")
                : JSON.stringify(blk.content ?? "");
          messages.push({
            role: "tool",
            tool_call_id: blk.tool_use_id,
            content: contentStr,
          });
        } else if (blk.type === "text" && blk.text) {
          userTextParts.push(blk.text);
        }
      }
      if (userTextParts.length > 0) {
        messages.push({ role: "user", content: userTextParts.join("\n") });
      }
    }
  }

  const tools: OpenAiTool[] = [];
  if (Array.isArray(params.tools)) {
    for (const tool of params.tools) {
      if ("input_schema" in tool && tool.name) {
        tools.push({
          type: "function",
          function: {
            name: tool.name,
            ...(tool.description ? { description: tool.description } : {}),
            parameters: tool.input_schema as Record<string, unknown>,
          },
        });
      }
    }
  }

  return {
    model: params.model,
    max_tokens: params.max_tokens,
    stream: true,
    messages,
    ...(tools.length > 0 ? { tools } : {}),
  };
}

/**
 * Creates an AnthropicStreamClient-compatible adapter backed by any OpenAI-compatible
 * Chat Completions SSE endpoint (Google Gemini AI Studio, Groq, OpenRouter, etc.).
 */
export function createOpenAiCompatStreamClient(
  config: OpenAiCompatConfig,
  fetchImpl: typeof fetch = fetch
): AnthropicStreamClient {
  return {
    messages: {
      async create(
        params: Anthropic.Messages.MessageCreateParamsStreaming
      ): Promise<AsyncIterable<Anthropic.Messages.RawMessageStreamEvent>> {
        const body = convertAnthropicParamsToOpenAi(params);
        const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45_000);

        let response: Response;
        try {
          response = await fetchImpl(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
          });
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }

        if (!response.ok || !response.body) {
          clearTimeout(timeoutId);
          const errorBody = await response.text().catch(() => "");
          throw new Error(
            `${config.provider} API error (${response.status}): ${errorBody.slice(0, 400)}`
          );
        }

        const reader = response.body.getReader();

        async function* streamEvents(): AsyncGenerator<Anthropic.Messages.RawMessageStreamEvent> {
          const decoder = new TextDecoder();
          let buffer = "";
          let textBlockStarted = false;
          const startedToolBlocks = new Map<number, number>();
          let nextBlockIndex = 1;

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split(/\r?\n/);
              buffer = lines.pop() ?? "";

              for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line || !line.startsWith("data:")) continue;
                const payload = line.slice(5).trim();
                if (!payload || payload === "[DONE]") continue;

                let chunk: OpenAiStreamChunk;
                try {
                  chunk = JSON.parse(payload) as OpenAiStreamChunk;
                } catch {
                  continue;
                }

                if (chunk.usage) {
                  yield {
                    type: "message_start",
                    message: {
                      usage: {
                        input_tokens: chunk.usage.prompt_tokens ?? 0,
                        output_tokens: chunk.usage.completion_tokens ?? 0,
                      },
                    },
                  } as Anthropic.Messages.RawMessageStreamEvent;
                }

                const delta = chunk.choices?.[0]?.delta;
                if (!delta) continue;

                if (typeof delta.content === "string" && delta.content.length > 0) {
                  if (!textBlockStarted) {
                    textBlockStarted = true;
                    yield {
                      type: "content_block_start",
                      index: 0,
                      content_block: { type: "text", text: "" },
                    } as Anthropic.Messages.RawMessageStreamEvent;
                  }
                  yield {
                    type: "content_block_delta",
                    index: 0,
                    delta: { type: "text_delta", text: delta.content },
                  } as Anthropic.Messages.RawMessageStreamEvent;
                }

                if (Array.isArray(delta.tool_calls)) {
                  for (const tc of delta.tool_calls) {
                    const tcIdx = tc.index ?? 0;
                    let blockIdx = startedToolBlocks.get(tcIdx);

                    if (blockIdx === undefined) {
                      blockIdx = nextBlockIndex++;
                      startedToolBlocks.set(tcIdx, blockIdx);
                      yield {
                        type: "content_block_start",
                        index: blockIdx,
                        content_block: {
                          type: "tool_use",
                          id: tc.id || `call_${tcIdx}_${blockIdx}`,
                          name: tc.function?.name || "",
                          input: {},
                        },
                      } as Anthropic.Messages.RawMessageStreamEvent;
                    }

                    if (
                      typeof tc.function?.arguments === "string" &&
                      tc.function.arguments.length > 0
                    ) {
                      yield {
                        type: "content_block_delta",
                        index: blockIdx,
                        delta: {
                          type: "input_json_delta",
                          partial_json: tc.function.arguments,
                        },
                      } as Anthropic.Messages.RawMessageStreamEvent;
                    }
                  }
                }
              }
            }
          } finally {
            clearTimeout(timeoutId);
            reader.releaseLock();
          }
        }

        return streamEvents();
      },
    },
  };
}
