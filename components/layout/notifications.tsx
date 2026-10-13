"use client";

import { Bell, CalendarClock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu } from "@/components/ui/menu";
import { useContracts, useNow } from "@/lib/store";
import { cn, daysUntil, describeDaysLeft, isOpen } from "@/lib/utilities";

export function Notifications() {
  const contracts = useContracts();
  const now = useNow();
  const [seen, setSeen] = useState(false);

  const items = useMemo(() => {
    if (now === null) return [];
    const deadlines = contracts
      .filter((c) => isOpen(c) && daysUntil(c.deadline, now) >= 0 && daysUntil(c.deadline, now) <= 14)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 3)
      .map((c) => ({
        id: `due-${c.id}`,
        href: `/commercial-opportunities/${c.id}`,
        icon: CalendarClock,
        title: c.title,
        body: `${c.company} · ${describeDaysLeft(daysUntil(c.deadline, now))}`,
        urgent: daysUntil(c.deadline, now) <= 7,
      }));
    const top = contracts.filter((c) => isOpen(c) && c.status === "New").sort((a, b) => b.fitScore - a.fitScore)[0];
    const fresh = top
      ? [{ id: `new-${top.id}`, href: `/commercial-opportunities/${top.id}`, icon: Sparkles, title: "New opportunity to review", body: `${top.title} · ${top.fitScore}% fit`, urgent: false }]
      : [];
    return [...deadlines, ...fresh];
  }, [contracts, now]);

  return (
    <Menu
      width={320}
      trigger={(props) => (
        <button
          {...props}
          onClick={() => {
            props.onClick();
            setSeen(true);
          }}
          className="relative flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-3 hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.9} />
          {!seen && items.length > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-surface" />}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <span className="text-[11px] text-faint">Deadline alerts</span>
          </div>
          {items.length === 0 ? (
            <p className="px-2.5 py-6 text-center text-sm text-muted">You&apos;re all caught up.</p>
          ) : (
            <ul className="flex flex-col">
              {items.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} onClick={close} className="flex gap-3 rounded-md px-2.5 py-2 hover:bg-surface-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                        n.urgent ? "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400" : "bg-accent-soft text-accent",
                      )}
                    >
                      <n.icon className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-ink">{n.title}</span>
                      <span className="block truncate text-xs text-muted">{n.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Menu>
  );
}
