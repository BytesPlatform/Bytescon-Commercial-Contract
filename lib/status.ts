import type { ContractStatus } from "./types";

interface StatusStyle {
  badge: string;
  dot: string;
  /** Solid fill used in pipeline bars */
  bar: string;
}

export const STATUS_STYLES: Record<ContractStatus, StatusStyle> = {
  New: {
    badge: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20",
    dot: "bg-slate-400",
    bar: "bg-slate-300 dark:bg-slate-500",
  },
  Reviewing: {
    badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20",
    dot: "bg-sky-500",
    bar: "bg-sky-400 dark:bg-sky-500",
  },
  Qualified: {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
  },
  "Preparing Proposal": {
    badge: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
    dot: "bg-amber-500",
    bar: "bg-amber-400",
  },
  Submitted: {
    badge: "bg-cyan-50 text-cyan-800 ring-cyan-200 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-400/20",
    dot: "bg-cyan-500",
    bar: "bg-cyan-500",
  },
  Negotiation: {
    badge: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
  },
  Won: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  Lost: {
    badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
    dot: "bg-rose-500",
    bar: "bg-rose-400",
  },
};

/** Short labels for tight spaces (pipeline columns). */
export const STAGE_LABELS: Partial<Record<ContractStatus, string>> = {
  "Preparing Proposal": "Proposal",
};

export function fitTone(score: number) {
  if (score >= 90) return { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (score >= 80) return { text: "text-accent-ink", bar: "bg-accent" };
  if (score >= 70) return { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-muted", bar: "bg-faint" };
}
