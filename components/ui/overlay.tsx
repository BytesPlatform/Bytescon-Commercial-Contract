"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utilities";

function useOverlayBehavior(open: boolean, onClose: () => void, panel: React.RefObject<HTMLDivElement | null>) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Focus the first form control, or the panel itself.
    const first = panel.current?.querySelector<HTMLElement>("[data-autofocus], input, select, textarea");
    (first ?? panel.current)?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, panel]);
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Right-hand slide-over panel (full screen on mobile). */
export function SlideOver({ open, onClose, title, description, children, footer, className }: OverlayProps) {
  const panel = useRef<HTMLDivElement>(null);
  useOverlayBehavior(open, onClose, panel);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="animate-fade-in absolute inset-0 bg-black/30 backdrop-blur-[1px] dark:bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "animate-slide-in-right relative flex h-full w-full flex-col bg-surface shadow-pop outline-none sm:max-w-xl sm:border-l sm:border-line",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button onClick={onClose} className="-mr-1.5 rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label="Close panel">
            <X className="size-4" />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/** Centered dialog. */
export function Modal({ open, onClose, title, description, children, footer, className }: OverlayProps) {
  const panel = useRef<HTMLDivElement>(null);
  useOverlayBehavior(open, onClose, panel);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/30 backdrop-blur-[1px] dark:bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "animate-pop-in relative w-full max-w-md rounded-t-2xl border border-line bg-surface shadow-pop outline-none sm:rounded-xl",
          className,
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", !children && "pb-5")}>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button onClick={onClose} className="-mt-1 -mr-1.5 rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label="Close dialog">
            <X className="size-4" />
          </button>
        </div>
        {children && <div className="px-5 py-4">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3 sm:rounded-b-xl">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
