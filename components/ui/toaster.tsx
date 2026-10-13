"use client";

import { CheckCircle2, X } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-pop-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-pop"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{t.title}</p>
            {t.description && <p className="mt-0.5 text-[13px] text-muted">{t.description}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="rounded p-0.5 text-faint hover:text-ink" aria-label="Dismiss notification">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
