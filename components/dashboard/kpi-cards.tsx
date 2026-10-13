"use client";

import { Briefcase, CircleDollarSign, FilePen, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useContracts, useNow } from "@/lib/store";
import { contractMidpoint, formatMoney, isActiveBid, isOpen } from "@/lib/utilities";

interface Kpi {
  label: string;
  value: string;
  note: string;
  href: string;
  icon: LucideIcon;
  tone: string;
}

export function KpiCards() {
  const contracts = useContracts();
  const now = useNow();

  const kpis = useMemo<Kpi[]>(() => {
    const open = contracts.filter(isOpen);
    const active = contracts.filter(isActiveBid);
    const won = contracts.filter((c) => c.status === "Won");
    const weekAgo = (now ?? 0) - 7 * 86_400_000;
    const newThisWeek = now === null ? 0 : open.filter((c) => new Date(c.createdAt).getTime() >= weekAgo).length;
    const pipeline = open.reduce((s, c) => s + contractMidpoint(c), 0);
    const proposalValue = active.reduce((s, c) => s + contractMidpoint(c), 0);
    return [
      {
        label: "Open Opportunities",
        value: String(open.length),
        note: newThisWeek > 0 ? `+${newThisWeek} added this week` : "Across all open stages",
        href: "/commercial-opportunities",
        icon: Briefcase,
        tone: "bg-accent-soft text-accent",
      },
      {
        label: "Active Bids",
        value: String(active.length),
        note: `${formatMoney(proposalValue)} in proposal or later`,
        href: "/pipeline",
        icon: FilePen,
        tone: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
      },
      {
        label: "Pipeline Value",
        value: formatMoney(pipeline),
        note: "Disclosed values only (midpoint)",
        href: "/pipeline",
        icon: CircleDollarSign,
        tone: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400",
      },
      {
        label: "Won Contracts",
        value: formatMoney(won.reduce((s, c) => s + (c.valueMax ?? 0), 0)),
        note: won.length ? `${won.length} ${won.length === 1 ? "contract" : "contracts"} awarded` : "No contracts won yet",
        href: "/commercial-opportunities?status=Won",
        icon: Trophy,
        tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
      },
    ];
  }, [contracts, now]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {kpis.map((k) => (
        <Link
          key={k.label}
          href={k.href}
          className="group rounded-xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-line-strong sm:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-medium text-muted">{k.label}</p>
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${k.tone}`}>
              <k.icon className="size-4" strokeWidth={2} />
            </span>
          </div>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{k.value}</p>
          <p className="mt-1 truncate text-xs text-muted group-hover:text-ink-2">{k.note}</p>
        </Link>
      ))}
    </div>
  );
}
