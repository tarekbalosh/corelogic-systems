"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Globe,
  MessageSquareText,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import type { AvailableSlot } from "@/lib/booking/availability";
import type { ChatSseEvent } from "@/lib/agent/runner";
import {
  BookingStatusCard,
  type PolledBookingStatus,
} from "@/components/chat/booking-status-card";
import {
  CHAT_STRINGS,
  detectBubbleDirection,
  type UiLanguage,
} from "@/components/chat/chat-strings";
import { SafeMarkdown } from "@/components/chat/safe-markdown";
import { SlotsPicker } from "@/components/chat/slots-picker";

const LOCAL_SESSION_ID_KEY = "corelogic_chat_session_id";
const SESSION_MESSAGES_KEY = "corelogic_chat_messages_v1";
const MAX_INPUT_CHARS = 2000;
const COUNTER_THRESHOLD = 1600;

interface StoredBookingCard {
  bookingId: string;
  status: PolledBookingStatus;
  label_en: string;
  label_ar: string;
  startsAt: string;
}

interface UiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  slots?: AvailableSlot[];
  chosenSlotIso?: string;
  booking?: StoredBookingCard;
  isError?: boolean;
}

interface RetryPayload {
  text: string;
  selectedSlot?: string;
}

export interface ChatWidgetProps {
  turnstileSiteKey?: string | null;
  botProtectionEnabled?: boolean;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

function generateFallbackUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateSessionId(): string {
  try {
    const existing = window.localStorage.getItem(LOCAL_SESSION_ID_KEY);
    if (
      existing &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        existing
      )
    ) {
      return existing;
    }
    const created = generateFallbackUuid();
    window.localStorage.setItem(LOCAL_SESSION_ID_KEY, created);
    return created;
  } catch {
    return generateFallbackUuid();
  }
}

function loadSessionMessages(): UiChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(SESSION_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is UiChatMessage =>
        typeof m === "object" &&
        m !== null &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

function saveSessionMessages(messages: UiChatMessage[]): void {
  try {
    window.sessionStorage.setItem(
      SESSION_MESSAGES_KEY,
      JSON.stringify(messages.slice(-40))
    );
  } catch {
    // Ignore storage quota / private mode errors
  }
}

export default function ChatWidget({
  turnstileSiteKey = null,
  botProtectionEnabled = false,
}: ChatWidgetProps) {
  const pathname = usePathname();
  const dialogTitleId = useId();
  const pageIsArabic = pathname.startsWith("/ar");

  const [isOpen, setIsOpen] = useState(false);
  const [uiLang, setUiLang] = useState<UiLanguage>(() =>
    pageIsArabic ? "ar" : "en"
  );
  const [sessionId] = useState<string>(() =>
    typeof window !== "undefined" ? getOrCreateSessionId() : ""
  );
  const [messages, setMessages] = useState<UiChatMessage[]>(() =>
    typeof window !== "undefined" ? loadSessionMessages() : []
  );
  const [input, setInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastFailedPayload, setLastFailedPayload] =
    useState<RetryPayload | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const prevPageArabicRef = useRef(pageIsArabic);

  // Sync UI language when visitor switches site locale (/ <-> /ar) if they haven't started chatting
  useEffect(() => {
    if (prevPageArabicRef.current !== pageIsArabic) {
      prevPageArabicRef.current = pageIsArabic;
      setUiLang(pageIsArabic ? "ar" : "en");
    }
  }, [pageIsArabic]);

  // Persist visible messages in sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      saveSessionMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages / streaming chunks
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isOpen]);

  // Auto-grow textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  // Optional Cloudflare Turnstile loader (only when enabled via env & before first user message)
  const needsTurnstile =
    Boolean(botProtectionEnabled && turnstileSiteKey) &&
    messages.length === 0 &&
    !turnstileToken;

  useEffect(() => {
    if (!isOpen || !needsTurnstile || !turnstileSiteKey) return;

    let widgetId: string | null = null;
    const mountTurnstile = () => {
      if (
        window.turnstile &&
        turnstileContainerRef.current &&
        !widgetId
      ) {
        widgetId = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "light",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
        });
      }
    };

    if (window.turnstile) {
      mountTurnstile();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-corelogic-turnstile="1"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.corelogicTurnstile = "1";
        script.onload = mountTurnstile;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", mountTurnstile);
      }
    }

    return () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isOpen, needsTurnstile, turnstileSiteKey]);

  // Focus management, Escape to close, and Focus Trap inside the dialog
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        launcherRef.current?.focus();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const strings = CHAT_STRINGS[uiLang];
  const isRtlUi = uiLang === "ar";
  // Position launcher bottom-left if page OR widget is RTL; bottom-right otherwise
  const dockStart = pageIsArabic || isRtlUi;

  const handleBookingStatusUpdate = useCallback(
    (bookingId: string, newStatus: PolledBookingStatus) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.booking?.bookingId === bookingId
            ? { ...m, booking: { ...m.booking, status: newStatus } }
            : m
        )
      );
    },
    []
  );

  const sendMessage = useCallback(
    async (
      rawText: string,
      options?: { selectedSlot?: string; sourceSlotsMsgId?: string; isRetry?: boolean }
    ) => {
      const trimmed = rawText.trim();
      if (!trimmed || isStreaming || !sessionId) return;

      if (needsTurnstile) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateFallbackUuid(),
            role: "assistant",
            content: strings.botCheckRequiredText,
            isError: true,
          },
        ]);
        return;
      }

      setLastFailedPayload(null);

      const assistantMsgId = generateFallbackUuid();

      setMessages((prev) => {
        const cleanedPrev = options?.isRetry
          ? prev.filter((m) => !m.isError)
          : prev;

        const withMarkedSlot = options?.sourceSlotsMsgId
          ? cleanedPrev.map((m) =>
              m.id === options.sourceSlotsMsgId
                ? { ...m, chosenSlotIso: options.selectedSlot }
                : m
            )
          : cleanedPrev;

        const nextList: UiChatMessage[] = options?.isRetry
          ? [
              ...withMarkedSlot,
              { id: assistantMsgId, role: "assistant", content: "" },
            ]
          : [
              ...withMarkedSlot,
              { id: generateFallbackUuid(), role: "user", content: trimmed },
              { id: assistantMsgId, role: "assistant", content: "" },
            ];
        return nextList;
      });

      if (!options?.isRetry) {
        setInput("");
      }
      setIsStreaming(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            message: trimmed.slice(0, MAX_INPUT_CHARS),
            clientLanguage: uiLang,
            ...(options?.selectedSlot
              ? { selectedSlot: options.selectedSlot }
              : {}),
            ...(honeypot ? { website_url: honeypot } : {}),
            ...(turnstileToken ? { turnstileToken } : {}),
          }),
        });

        if (!response.ok || !response.body) {
          let errText = strings.networkErrorText;
          try {
            const errJson = (await response.json()) as {
              message?: string;
              error?: string;
            };
            if (errJson.message) errText = errJson.message;
            else if (response.status === 429 && errJson.error)
              errText = errJson.error;
          } catch {
            // Keep default localized network error message
          }

          setLastFailedPayload({
            text: trimmed,
            selectedSlot: options?.selectedSlot,
          });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: errText, isError: true }
                : m
            )
          );
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const lines = frame.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const jsonStr = line.slice(5).trim();
              if (!jsonStr) continue;

              let event: ChatSseEvent;
              try {
                event = JSON.parse(jsonStr) as ChatSseEvent;
              } catch {
                continue;
              }

              if (event.type === "text") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: m.content + event.delta }
                      : m
                  )
                );
              } else if (event.type === "slots") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, slots: event.slots } : m
                  )
                );
              } else if (event.type === "booking") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          booking: {
                            bookingId: event.bookingId,
                            status: event.status,
                            label_en: event.label_en,
                            label_ar: event.label_ar,
                            startsAt: event.startsAt,
                          },
                        }
                      : m
                  )
                );
              } else if (event.type === "error") {
                setLastFailedPayload({
                  text: trimmed,
                  selectedSlot: options?.selectedSlot,
                });
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: m.content
                            ? `${m.content}\n\n${event.message}`
                            : event.message,
                          isError: true,
                        }
                      : m
                  )
                );
              }
            }
          }
        }
      } catch {
        setLastFailedPayload({
          text: trimmed,
          selectedSlot: options?.selectedSlot,
        });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: m.content || strings.networkErrorText,
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [
      honeypot,
      isStreaming,
      needsTurnstile,
      sessionId,
      strings.botCheckRequiredText,
      strings.networkErrorText,
      turnstileToken,
      uiLang,
    ]
  );

  // Hide completely on /admin and /portal routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div
          className={[
            "fixed bottom-5 z-[75] sm:bottom-6",
            dockStart ? "left-5 sm:left-6" : "right-5 sm:right-6",
          ].join(" ")}
        >
          <button
            ref={launcherRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={strings.launcherLabel}
            aria-expanded={isOpen}
            className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-[0_12px_30px_-4px_rgba(79,70,229,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_18px_36px_-4px_rgba(79,70,229,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:h-15 sm:w-15"
          >
            <MessageSquareText className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-0.5 -end-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </button>
        </div>
      )}

      {/* Chat Dialog Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          dir={isRtlUi ? "rtl" : "ltr"}
          className={[
            "fixed z-[110] flex flex-col overflow-hidden bg-slate-50 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.28)] transition-all duration-200",
            // Mobile: full-screen; Desktop: ~388x600 floating card
            "inset-0 h-[100dvh] w-full sm:inset-auto sm:bottom-6 sm:h-[600px] sm:max-h-[calc(100dvh-3rem)] sm:w-[388px] sm:rounded-3xl sm:border sm:border-slate-200/90",
            dockStart ? "sm:left-6" : "sm:right-6",
            isRtlUi ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 bg-[#0B1F3A] px-4 py-3.5 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2
                  id={dialogTitleId}
                  className="truncate text-sm font-bold tracking-tight text-white"
                >
                  {strings.companyName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="truncate">{strings.subtitle}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setUiLang((prev) => (prev === "en" ? "ar" : "en"))
                }
                aria-label={strings.langToggleLabel}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{strings.langToggleShort}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  window.setTimeout(() => launcherRef.current?.focus(), 20);
                }}
                aria-label={strings.closeLabel}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
            {/* Initial Welcome Bubble */}
            <div className="flex justify-start">
              <div
                dir={isRtlUi ? "rtl" : "ltr"}
                className="max-w-[88%] rounded-2xl rounded-ss-md border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-800 shadow-2xs"
              >
                <SafeMarkdown text={strings.welcomeMessage} />
              </div>
            </div>

            {/* Quick-Reply Chips (shown before user sends first message) */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {strings.quickReplies.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isStreaming}
                    onClick={() => void sendMessage(chip)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 transition-all hover:border-indigo-400 hover:bg-indigo-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{chip}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Conversation Transcript */}
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const msgDir = detectBubbleDirection(msg.content, uiLang);
              const showTypingDots =
                !isUser &&
                isStreaming &&
                idx === messages.length - 1 &&
                msg.content.length === 0 &&
                !msg.slots &&
                !msg.booking;

              return (
                <div
                  key={msg.id}
                  className={[
                    "flex flex-col",
                    isUser ? "items-end" : "items-start",
                  ].join(" ")}
                >
                  {(msg.content.length > 0 || showTypingDots) && (
                    <div
                      dir={msgDir}
                      className={[
                        "max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-2xs",
                        isUser
                          ? "rounded-ee-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                          : msg.isError
                            ? "rounded-ss-md border border-rose-200 bg-rose-50 text-rose-900"
                            : "rounded-ss-md border border-slate-200/80 bg-white text-slate-800",
                      ].join(" ")}
                    >
                      {showTypingDots ? (
                        <div
                          className="flex items-center gap-1.5 py-1"
                          aria-label={strings.typingLabel}
                        >
                          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.25s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.12s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                        </div>
                      ) : isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed break-words">
                          {msg.content}
                        </p>
                      ) : (
                        <SafeMarkdown text={msg.content} />
                      )}
                    </div>
                  )}

                  {/* Clickable Available Slots Grouped by Day */}
                  {msg.slots && msg.slots.length > 0 && (
                    <div className="w-full max-w-[94%]">
                      <SlotsPicker
                        slots={msg.slots}
                        uiLang={uiLang}
                        disabled={isStreaming}
                        chosenStartsAt={msg.chosenSlotIso}
                        onSelectSlot={(slot) => {
                          const label =
                            uiLang === "ar" ? slot.label_ar : slot.label_en;
                          const text = `${strings.slotChosenPrefix} ${label}`;
                          void sendMessage(text, {
                            selectedSlot: slot.startsAt,
                            sourceSlotsMsgId: msg.id,
                          });
                        }}
                      />
                    </div>
                  )}

                  {/* Pending / Confirmed / Rejected Booking Card */}
                  {msg.booking && (
                    <div className="w-full max-w-[94%]">
                      <BookingStatusCard
                        bookingId={msg.booking.bookingId}
                        sessionId={sessionId}
                        initialStatus={msg.booking.status}
                        labelEn={msg.booking.label_en}
                        labelAr={msg.booking.label_ar}
                        uiLang={uiLang}
                        onStatusChange={handleBookingStatusUpdate}
                      />
                    </div>
                  )}

                  {/* Retry Button on Error */}
                  {msg.isError &&
                    lastFailedPayload &&
                    idx === messages.length - 1 &&
                    !isStreaming && (
                      <button
                        type="button"
                        onClick={() =>
                          void sendMessage(lastFailedPayload.text, {
                            selectedSlot: lastFailedPayload.selectedSlot,
                            isRetry: true,
                          })
                        }
                        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-300 bg-white px-3 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        <span>{strings.retryLabel}</span>
                      </button>
                    )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Optional Turnstile Widget Before First Message */}
          {needsTurnstile && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-2">
              <div ref={turnstileContainerRef} className="flex justify-center" />
            </div>
          )}

          {/* Input & Privacy Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="shrink-0 border-t border-slate-200/90 bg-white px-3.5 pt-3 pb-3"
          >
            {/* Hidden Honeypot Input */}
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_INPUT_CHARS}
                  disabled={isStreaming}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder={strings.inputPlaceholder}
                  dir="auto"
                  className="block max-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {input.length >= COUNTER_THRESHOLD && (
                  <span
                    className={[
                      "mt-1 block text-end text-[10px] font-medium",
                      input.length >= MAX_INPUT_CHARS
                        ? "text-rose-600"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    {input.length}/{MAX_INPUT_CHARS}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isStreaming || input.trim().length === 0}
                aria-label={strings.sendLabel}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm transition-all hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send
                  className={[
                    "h-4 w-4",
                    isRtlUi ? "rotate-180" : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] leading-snug text-slate-400">
              {strings.privacyText}{" "}
              <Link
                href={strings.privacyHref}
                className="font-medium text-indigo-600 underline hover:text-indigo-700"
              >
                {strings.privacyLinkLabel}
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
