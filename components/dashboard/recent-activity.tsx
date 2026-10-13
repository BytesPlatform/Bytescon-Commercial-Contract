"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ActivityIcon } from "@/components/contracts/activity-item";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { useActivity, useContracts, useNow } from "@/lib/store";
import { formatDateTime, relativeTime } from "@/lib/utilities";

export function RecentActivity() {
  const events = useActivity();
  const contracts = useContracts();
  const now = useNow();
  const titles = useMemo(() => new Map(contracts.map((c) => [c.id, c.title])), [contracts]);
  const recent = events.filter((e) => titles.has(e.contractId)).slice(0, 7);

  return (
    <Card>
      <CardHeader title="Recent Activity" description="Latest updates across your opportunities" />
      {recent.length === 0 ? (
        <EmptyState icon={<Activity />} title="No activity yet" />
      ) : (
        <ol className="relative px-5 pb-4">
          {recent.map((e, i) => (
            <li key={e.id} className="relative flex gap-3 pb-4 last:pb-1">
              {i < recent.length - 1 && <span className="absolute top-7 bottom-0 left-[13.5px] w-px bg-line" aria-hidden />}
              <ActivityIcon kind={e.kind} />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] text-ink">{e.message}</p>
                <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
                  <Link href={`/commercial-opportunities/${e.contractId}`} className="truncate hover:text-accent-ink hover:underline">
                    {titles.get(e.contractId)}
                  </Link>
                  {now !== null && <span aria-hidden>·</span>}
                  {now !== null && (
                    <time dateTime={e.at} title={formatDateTime(e.at)} className="shrink-0">
                      {relativeTime(e.at, now)}
                    </time>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
