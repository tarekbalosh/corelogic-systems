import type { IssuanceValidationIssue } from "@/lib/invoicing/validators";

export class InvoicingApiClientError extends Error {
  status: number;
  code?: string;
  issues?: IssuanceValidationIssue[];

  constructor(
    message: string,
    status: number,
    code?: string,
    issues?: IssuanceValidationIssue[]
  ) {
    super(message);
    this.name = "InvoicingApiClientError";
    this.status = status;
    this.code = code;
    this.issues = issues;
  }
}

export async function adminApiJson<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
  } = {}
): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    "X-Requested-With": "fetch",
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    code?: string;
    issues?: IssuanceValidationIssue[];
  };

  if (!res.ok) {
    throw new InvoicingApiClientError(
      data.error || `Request failed (${res.status})`,
      res.status,
      data.code,
      data.issues
    );
  }

  return data as T;
}

export async function adminApiPdfBlob(
  url: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
  } = {}
): Promise<Blob> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    "X-Requested-With": "fetch",
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new InvoicingApiClientError(
      data.error || `PDF generation failed (${res.status})`,
      res.status
    );
  }

  return res.blob();
}
