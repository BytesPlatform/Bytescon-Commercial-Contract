"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { STATUS_STYLES } from "@/lib/status";
import { useContracts } from "@/lib/store";
import { PIPELINE_STAGES } from "@/lib/types";
import { cn, contractMidpoint, formatMoney } from "@/lib/utilities";

export function PipelineOverview() {
  const contracts = useContracts();
  const stages = useMemo(
    () =>
      PIPELINE_STAGES.map((stage) => {
        const items = contracts.filter((c) => c.status === stage);
        return { stage, count: items.length, value: items.reduce((s, c) => s + contractMidpoint(c), 0) };
      }),
    [contracts],
  );
  const total = stages.reduce((s, x) => s + x.count, 0);
  const max = Math.max(1, ...stages.map((s) => s.count));

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Contract Pipeline Overview"
        description={`${total} opportunities across ${PIPELINE_STAGES.length} stages`}
        action={
          <Link href="/pipeline" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-ink hover:underline">
            Open board <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <div className="px-5">
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-surface-3" aria-hidden>
          {stages.map(
            (s) =>
              s.count > 0 && (
                <div key={s.stage} className={cn("h-full first:rounded-l-full last:rounded-r-full", STATUS_STYLES[s.stage].bar)} style={{ flexGrow: s.count }} title={`${s.stage}: ${s.count}`} />
              ),
          )}
        </div>
      </div>
      <ul className="flex flex-col px-2 pt-3 pb-3">
        {stages.map((s) => (
          <li key={s.stage}>
            <Link
              href={`/commercial-opportunities?status=${encodeURIComponent(s.stage)}`}
              className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-2 sm:grid-cols-[11rem_1fr_3rem_4.5rem]"
            >
              <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink-2">
                <span className={cn("size-2 shrink-0 rounded-full", STATUS_STYLES[s.stage].dot)} />
                <span className="truncate">{s.stage}</span>
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <span className={cn("block h-full rounded-full opacity-80", STATUS_STYLES[s.stage].bar)} style={{ width: `${(s.count / max) * 100}%` }} />
              </span>
              <span className="tabular text-right text-[13px] font-semibold text-ink">{s.count}</span>
              <span className="tabular hidden text-right text-xs text-muted sm:block">{s.value ? formatMoney(s.value) : "—"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
