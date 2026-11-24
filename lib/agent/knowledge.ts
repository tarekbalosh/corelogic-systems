import fs from "node:fs";
import path from "node:path";

export const KNOWLEDGE_FILE_RELATIVE_PATH = "knowledge/core-logic-knowledge.md";

let cachedKnowledge: string | null = null;

/**
 * Loads the CoreLogic Systems knowledge base markdown file from disk and caches
 * it in module scope for subsequent invocations within the same serverless instance.
 *
 * Throws if the file is missing or empty so misconfigurations fail fast in tests/CI.
 */
export function getKnowledgeBase(customFilePath?: string): string {
  if (!customFilePath && cachedKnowledge !== null) {
    return cachedKnowledge;
  }

  const resolvedPath =
    customFilePath ?? path.join(process.cwd(), KNOWLEDGE_FILE_RELATIVE_PATH);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Knowledge base file is missing at: ${resolvedPath}. Ensure ${KNOWLEDGE_FILE_RELATIVE_PATH} exists and is traced in next.config.ts.`
    );
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  if (raw.trim().length === 0) {
    throw new Error(
      `Knowledge base file at ${resolvedPath} is empty. Populate ${KNOWLEDGE_FILE_RELATIVE_PATH} before running the agent.`
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
