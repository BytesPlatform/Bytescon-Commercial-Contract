"use client";

import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { useContracts, useNow } from "@/lib/store";
import { cn, daysUntil, describeDaysLeft, formatDate, isOpen, startOfDay } from "@/lib/utilities";

export function urgencyClasses(days: number) {
  if (days < 0) return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20";
  if (days <= 7) return "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20";
  return "bg-surface-3 text-ink-2 ring-line";
}

export function UpcomingDeadlines() {
  const contracts = useContracts();
  const now = useNow();
  const upcoming = useMemo(() => {
    const today = now === null ? null : startOfDay(now);
    return contracts
      .filter((c) => isOpen(c) && (today === null || daysUntil(c.deadline, today) >= 0))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 5);
  }, [contracts, now]);

  return (
    <Card className="flex flex-col">
      <CardHeader title="Upcoming Deadlines" description="Responses due soonest" />
      {upcoming.length === 0 ? (
        <EmptyState icon={<CalendarCheck2 />} title="No upcoming deadlines" description="Open opportunities with future due dates will appear here." />
      ) : (
        <ul className="flex flex-col px-2 pb-3">
          {upcoming.map((c) => {
            const days = now === null ? null : daysUntil(c.deadline, now);
            return (
              <li key={c.id}>
                <Link href={`/commercial-opportunities/${c.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2">
                  <span className="flex w-11 shrink-0 flex-col items-center rounded-lg border border-line bg-surface-2 py-1 leading-none">
                    <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">{formatDate(c.deadline, { month: "short" })}</span>
                    <span className="tabular mt-0.5 text-base font-semibold text-ink">{formatDate(c.deadline, { day: "numeric" })}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink">{c.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {c.company} · Due {formatDate(c.deadline)}
                    </span>
                  </span>
                  {days !== null && (
                    <span className={cn("hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset sm:inline", urgencyClasses(days))}>
                      {days <= 1 ? describeDaysLeft(days) : `${days}d`}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
