import type { CommercialContract } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const DAY_MS = 86_400_000;

/** Compact currency: 95000 → $95K, 1200000 → $1.2M */
export function formatMoney(value: number) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(m >= 10 ? 1 : 2).replace(/0$/, "")}M`;
  }
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export function formatValueRange(min: number | null, max: number | null) {
  if (max === null) return "Not disclosed";
  if (min === null) return `Up to ${formatMoney(max)}`;
  if (min === max) return formatMoney(min);
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

export function contractMidpoint(c: Pick<CommercialContract, "valueMin" | "valueMax">) {
  if (c.valueMax === null) return 0;
  if (c.valueMin === null) return c.valueMax;
  return (c.valueMin + c.valueMax) / 2;
}

/** Parses free text like "$250K - $400K", "1.2M", "150000" into a numeric range. */
export function parseValueRange(input: string): { min: number; max: number } | null {
  const matches = [...input.replace(/,/g, "").matchAll(/(\d+(?:\.\d+)?)\s*([kKmM])?/g)];
  if (matches.length === 0) return null;
  const nums = matches.slice(0, 2).map(([, n, suffix]) => {
    const base = parseFloat(n);
    const s = suffix?.toLowerCase();
    return Math.round(s === "m" ? base * 1_000_000 : s === "k" ? base * 1_000 : base);
  });
  if (nums.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  const [a, b = a] = nums;
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

/** Parse YYYY-MM-DD as a local calendar date (avoids UTC off-by-one). */
export function parseDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }) {
  return parseDate(iso).toLocaleDateString("en-US", opts);
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysUntil(iso: string, now: number) {
  return Math.round((parseDate(iso).getTime() - startOfDay(now)) / DAY_MS);
}

export function describeDaysLeft(days: number) {
  if (days < 0) return days === -1 ? "1 day overdue" : `${-days} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
}

export function relativeTime(iso: string, now: number) {
  const diff = now - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Splits compound industries ("Healthcare / IT") into filterable tags. */
export function industryTags(industry: string) {
  return industry
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isOpen(c: Pick<CommercialContract, "status">) {
  return c.status !== "Won" && c.status !== "Lost";
}

export function isActiveBid(c: Pick<CommercialContract, "status">) {
  return c.status === "Preparing Proposal" || c.status === "Submitted" || c.status === "Negotiation";
}

export function isSafeHttpUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
