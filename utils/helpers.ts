import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function truncate(str: string, max = 40): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

export function formatDate(ts: number | string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unexpected error occurred";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Download a URL in the browser */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Rate limit helper: returns true if allowed */
const _rateLimitMap = new Map<string, number[]>();
export function rateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const calls = (_rateLimitMap.get(key) ?? []).filter((t) => now - t < windowMs);
  if (calls.length >= maxCalls) return false;
  calls.push(now);
  _rateLimitMap.set(key, calls);
  return true;
}
