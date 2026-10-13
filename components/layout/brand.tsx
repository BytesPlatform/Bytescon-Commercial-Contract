import Link from "next/link";
import { cn } from "@/lib/utilities";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent shadow-sm", className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-4 text-white dark:text-[#0b0d11]" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7h9M5 12h6M5 17h4" />
        <path d="m13 15.5 2.5 2.5L20 13" />
      </svg>
    </span>
  );
}

export function Brand({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 rounded-md" aria-label="Clearbid home">
      <BrandMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-ink">Clearbid</span>
          <span className="mt-1 text-[10.5px] font-medium tracking-wide text-faint">Commercial Contracts</span>
        </span>
      )}
    </Link>
  );
}
