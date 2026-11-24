import fs from "node:fs";
import path from "node:path";

export const KNOWLEDGE_FILE_RELATIVE_PATH = "knowledge/core-logic-knowledge.md";

let cachedKnowledge: string | null = null;

/**
 * Loads the CoreLogic Systems knowledge base markdown file from disk and caches
 * it in module scope for subsequent invocations within the same serverless instance.
 *
 * Uses a statically scoped `path.join(process.cwd(), "knowledge", ...)` for production
 * so Next.js / Turbopack output file tracing bundles only `knowledge/core-logic-knowledge.md`.
 */
export function getKnowledgeBase(customFilePath?: string): string {
  if (!customFilePath && cachedKnowledge !== null) {
    return cachedKnowledge;
  }

  let raw: string;
  if (customFilePath) {
    if (!fs.existsSync(/* turbopackIgnore: true */ customFilePath)) {
      throw new Error(
        `Knowledge base file is missing at: ${customFilePath}.`
      );
    }
    raw = fs.readFileSync(/* turbopackIgnore: true */ customFilePath, "utf-8");
  } else {
    const defaultPath = path.join(
      process.cwd(),
      "knowledge",
      "core-logic-knowledge.md"
    );
    if (!fs.existsSync(defaultPath)) {
      throw new Error(
        `Knowledge base file is missing at: ${defaultPath}. Ensure ${KNOWLEDGE_FILE_RELATIVE_PATH} exists and is traced in next.config.ts.`
      );
    }
    raw = fs.readFileSync(defaultPath, "utf-8");
  }

  if (raw.trim().length === 0) {
    throw new Error(
      `Knowledge base file is empty. Populate ${KNOWLEDGE_FILE_RELATIVE_PATH} before running the agent.`
    );
  }

  if (!customFilePath) {
    cachedKnowledge = raw;
  }

  return raw;
}

export function resetKnowledgeCacheForTesting(): void {
  cachedKnowledge = null;
}
