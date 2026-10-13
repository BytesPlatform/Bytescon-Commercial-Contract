"use client";

import { Check, Download, Eye, FolderOpen, Activity as ActivityLucide } from "lucide-react";
import { useState } from "react";
import { DocumentPreview, FileIcon, DocStatusBadge } from "@/components/documents/document-bits";
import { Card, CardHeader, EmptyState, ProgressBar } from "@/components/ui/card";
import { toggleRequirement, useNow } from "@/lib/store";
import type { ActivityEvent, CommercialContract, ContractDocument } from "@/lib/types";
import { cn, formatDate, formatDateTime, relativeTime } from "@/lib/utilities";
import { ActivityIcon } from "./activity-item";

export function RequirementsTab({ contract }: { contract: CommercialContract }) {
  const total = contract.requirements.length;
  const done = contract.requirements.filter((r) => r.done).length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <Card className="max-w-3xl">
      <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">Submission Requirements</h2>
          <p className="mt-0.5 text-xs text-muted">Tick items off as they’re ready. Progress is saved in this browser.</p>
        </div>
        <div className="sm:w-56">
          <div className="flex items-baseline justify-between text-[13px]">
            <span className="font-semibold text-ink">
              {done} of {total} complete
            </span>
            <span className="tabular text-muted">{Math.round(pct)}%</span>
          </div>
          <ProgressBar value={pct} className="mt-1.5" barClassName={done === total ? "bg-emerald-500" : undefined} />
        </div>
      </div>
      <ul className="divide-y divide-line">
        {contract.requirements.map((r) => (
          <li key={r.id}>
            <label className="relative flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2">
              <input
                type="checkbox"
                checked={r.done}
                onChange={(e) => toggleRequirement(contract.id, r.id, e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface",
                  r.done ? "border-accent bg-accent text-white dark:text-[#0b0d11]" : "border-line-strong bg-surface",
                )}
                aria-hidden
              >
                {r.done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={cn("flex-1 text-sm", r.done ? "text-muted line-through decoration-faint" : "text-ink")}>{r.label}</span>
              <span className={cn("text-xs", r.done ? "text-emerald-600 dark:text-emerald-400" : "text-faint")}>{r.done ? "Complete" : "Outstanding"}</span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function DocumentsTab({ docs }: { docs: ContractDocument[] }) {
  const [preview, setPreview] = useState<ContractDocument | null>(null);
  return (
    <Card>
      <CardHeader title="Documents" description="Solicitation files published by the buyer. Links open on the buyer's site." />
      {docs.length === 0 ? (
        <EmptyState
          icon={<FolderOpen />}
          title="No documents yet"
          description="The buyer hasn't published separate files, or they're on the source page. Open the source page from the Overview tab."
          className="border-t border-line"
        />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {docs.map((d) => (
            <li key={d.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileIcon type={d.fileType} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-muted">
                    {d.category} · {d.fileType}
                    {d.size ? ` · ${d.size}` : ""} · Retrieved {formatDate(d.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-12 sm:pl-0">
                <DocStatusBadge status={d.status} />
                <button
                  onClick={() => setPreview(d)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-medium text-ink-2 hover:bg-surface-3"
                >
                  <Eye className="size-3.5" /> View
                </button>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-medium text-ink-2 hover:bg-surface-3"
                  >
                    <Download className="size-3.5" /> Open file
                  </a>
                ) : (
                  <button
                    disabled
                    title="No file link available"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-medium text-faint"
                  >
                    <Download className="size-3.5" /> Download
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
    </Card>
  );
}

export function ActivityTab({ events }: { events: ActivityEvent[] }) {
  const now = useNow();
  return (
    <Card className="max-w-3xl">
      <CardHeader title="Activity" description="Timeline of changes to this opportunity" />
      {events.length === 0 ? (
        <EmptyState icon={<ActivityLucide />} title="No activity yet" />
      ) : (
        <ol className="px-5 pb-5">
          {events.map((e, i) => (
            <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
              {i < events.length - 1 && <span className="absolute top-7 bottom-0 left-[13.5px] w-px bg-line" aria-hidden />}
              <ActivityIcon kind={e.kind} />
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-[13.5px] text-ink">{e.message}</p>
                {now !== null && (
                  <time dateTime={e.at} className="mt-0.5 block text-xs text-muted">
                    {formatDateTime(e.at)}
                    <span className="text-faint"> · {relativeTime(e.at, now)}</span>
                  </time>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
