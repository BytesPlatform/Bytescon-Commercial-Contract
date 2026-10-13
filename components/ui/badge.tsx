import type { ReactNode } from "react";
import { STATUS_STYLES, fitTone } from "@/lib/status";
import type { ContractStatus } from "@/lib/types";
import { cn } from "@/lib/utilities";

export function Badge({ children, className, tone = "neutral" }: { children: ReactNode; className?: string; tone?: "neutral" | "accent" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        tone === "neutral" && "bg-surface-3 text-ink-2 ring-line",
        tone === "accent" && "bg-accent-soft text-accent-ink ring-accent/20",
        tone === "outline" && "bg-transparent text-muted ring-line-strong",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: ContractStatus; className?: string }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        s.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </span>
  );
}

export function VerifiedBadge({ retrievedAt, className }: { retrievedAt?: string; className?: string }) {
  return (
    <span
      title={`Real opportunity verified on the buyer's source page${retrievedAt ? ` on ${retrievedAt}` : ""}. Confirm details before bidding.`}
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1 py-px text-[9.5px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/25 dark:text-emerald-400 dark:ring-emerald-400/25",
        className,
      )}
    >
      Verified
    </span>
  );
}

export function FitScore({ score, showBar = true, className }: { score: number; showBar?: boolean; className?: string }) {
  const tone = fitTone(score);
  return (
    <span className={cn("inline-flex items-center gap-2", className)} title={`${score}% fit score`}>
      {showBar && (
        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-surface-3" aria-hidden>
          <span className={cn("block h-full rounded-full", tone.bar)} style={{ width: `${score}%` }} />
        </span>
      )}
      <span className={cn("tabular text-[13px] font-semibold", tone.text)}>{score}%</span>
    </span>
  );
}
