import React from "react";

/**
 * Safely renders assistant text with paragraphs, line breaks, bullet/numbered lists,
 * and **bold** spans without ever using dangerouslySetInnerHTML.
 */
export function SafeMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: { ordered: boolean; items: string[] } | null = null;
  let keyCounter = 0;

  const flushList = () => {
    if (!currentList) return;
    const listKey = `list-${keyCounter++}`;
    if (currentList.ordered) {
      blocks.push(
        <ol key={listKey} className="my-1.5 list-decimal space-y-1 ps-5">
          {currentList.items.map((item, idx) => (
            <li key={`${listKey}-${idx}`} className="leading-relaxed">
              {renderInlineBold(item)}
            </li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={listKey} className="my-1.5 list-disc space-y-1 ps-5">
          {currentList.items.map((item, idx) => (
            <li key={`${listKey}-${idx}`} className="leading-relaxed">
              {renderInlineBold(item)}
            </li>
          ))}
        </ul>
      );
    }
    currentList = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    const bulletMatch = /^[-*•]\s+(.+)$/.exec(trimmed);
    if (bulletMatch) {
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { ordered: false, items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    const orderedMatch = /^\d+[.)]\s+(.+)$/.exec(trimmed);
    if (orderedMatch) {
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { ordered: true, items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    flushList();
    const pKey = `p-${keyCounter++}`;
    blocks.push(
      <p key={pKey} className="leading-relaxed">
        {renderInlineBold(rawLine)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-2 break-words">{blocks}</div>;
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
