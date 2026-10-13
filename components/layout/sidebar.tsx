"use client";

import { ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";
import { Brand } from "./brand";
import { MainNav, SettingsNav } from "./nav-links";

function DemoNote() {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        Real opportunities
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
        Seeded RFPs are real public solicitations, verified on their source pages. Contracts you add are saved in this browser.
      </p>
    </div>
  );
}

/** Desktop: labelled sidebar. Tablet: icon rail. Hidden on mobile (see MobileNav). */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[68px] flex-col border-r border-line bg-surface md:flex lg:w-64">
      <div className="flex h-14 shrink-0 items-center border-b border-line px-[18px] lg:px-4">
        <span className="lg:hidden">
          <Brand compact />
        </span>
        <span className="hidden lg:block">
          <Brand />
        </span>
      </div>
      <nav aria-label="Main" className="scrollbar-thin flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <p className="mb-2 hidden px-2.5 text-[11px] font-medium tracking-wider text-faint uppercase lg:block">Workspace</p>
        <MainNav variant="rail" />
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <div className="hidden lg:block">
            <DemoNote />
          </div>
          <SettingsNav variant="rail" />
        </div>
      </nav>
    </aside>
  );
}

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="animate-fade-in absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onClose} aria-hidden />
      <div className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-surface shadow-pop">
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <Brand onNavigate={onClose} />
          <button onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <MainNav variant="full" onNavigate={onClose} />
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <DemoNote />
            <SettingsNav variant="full" onNavigate={onClose} />
          </div>
        </nav>
      </div>
    </div>
  );
}
