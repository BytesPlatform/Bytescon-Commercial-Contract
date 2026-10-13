"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utilities";

interface MenuProps {
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-haspopup": "menu" }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  width?: number;
}

/**
 * Lightweight dropdown rendered in a portal with fixed positioning, so it is
 * never clipped by scrollable tables or kanban columns.
 */
export function Menu({ trigger, children, align = "end", width = 208 }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useLayoutEffect(() => {
    if (!open || !anchor.current) return;
    const place = () => {
      const r = anchor.current!.getBoundingClientRect();
      const menuHeight = menu.current?.offsetHeight ?? 0;
      let left = align === "end" ? r.right - width : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      let top = r.bottom + 6;
      if (menuHeight && top + menuHeight > window.innerHeight - 8) top = Math.max(8, r.top - menuHeight - 6);
      setPos({ top, left });
    };
    place();
    // Re-place once the menu has measured height.
    const raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, [open, align, width]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !anchor.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onScroll = (e: Event) => {
      if (!menu.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <span ref={anchor} className="inline-flex">
        {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-haspopup": "menu" })}
      </span>
      {open &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width }}
            className="animate-pop-in fixed z-[60] rounded-lg border border-line bg-surface p-1 shadow-pop"
          >
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}

export function MenuItem({
  children,
  onSelect,
  icon,
  danger,
  checked,
  disabled,
}: {
  children: ReactNode;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
  checked?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        danger ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10" : "text-ink-2 hover:bg-surface-3 hover:text-ink",
      )}
    >
      {icon && <span className={cn(!danger && "text-muted")}>{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {checked && <Check className="text-accent" />}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="px-2 pt-1.5 pb-1 text-[11px] font-medium tracking-wide text-faint uppercase">{children}</div>;
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-line" />;
}
