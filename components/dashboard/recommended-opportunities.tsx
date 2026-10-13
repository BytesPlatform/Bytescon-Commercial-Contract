"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { VerifiedBadge, FitScore, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { useContracts } from "@/lib/store";
import type { CommercialContract } from "@/lib/types";
import { formatDate, formatValueRange } from "@/lib/utilities";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-faint">{label}</dt>
      <dd className="truncate text-[13px] font-medium text-ink-2">{value}</dd>
    </div>
  );
}

export function OpportunityCard({ c }: { c: CommercialContract }) {
  return (
    <Link
      href={`/commercial-opportunities/${c.id}`}
      className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition-all hover:border-line-strong hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-ink group-hover:text-accent-ink">{c.title}</h3>
          <p className="mt-0.5 truncate text-[13px] text-muted">{c.company}</p>
        </div>
        <FitScore score={c.fitScore} showBar={false} className="rounded-md bg-surface-2 px-1.5 py-0.5 ring-1 ring-line" />
      </div>
      <p className="mt-2 truncate text-xs text-muted">{c.industry}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-line pt-3">
        <Meta label="Estimated value" value={formatValueRange(c.valueMin, c.valueMax)} />
        <Meta label="Deadline" value={formatDate(c.deadline)} />
        <Meta label="Location" value={c.location} />
        <Meta label="Source" value={c.source} />
      </dl>
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge status={c.status} />
        {c.isSeeded && <VerifiedBadge retrievedAt={c.retrievedAt} />}
      </div>
    </Link>
  );
}

export function RecommendedOpportunities() {
  const contracts = useContracts();
  const recommended = useMemo(
    () =>
      contracts
        .filter((c) => c.status === "New" || c.status === "Reviewing" || c.status === "Qualified")
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, 4),
    [contracts],
  );

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-accent" /> Recommended Opportunities
          </span>
        }
        description="Highest-fit opportunities not yet in proposal"
        action={
          <Link href="/commercial-opportunities" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-ink hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      {recommended.length === 0 ? (
        <EmptyState icon={<Sparkles />} title="No recommendations right now" description="New and qualified opportunities will be ranked here by fit score." />
      ) : (
        <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
          {recommended.map((c) => (
            <OpportunityCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </Card>
  );
}
