"use client";

import { CalendarDays, Flag, GripVertical, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ContractFormPanel } from "@/components/contracts/contract-form";
import { ContractMenu } from "@/components/contracts/contract-menu";
import { FitScore } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { STAGE_LABELS, STATUS_STYLES } from "@/lib/status";
import { setStatus, useContracts } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PIPELINE_STAGES, type CommercialContract, type PipelineStage } from "@/lib/types";
import { cn, contractMidpoint, formatDate, formatMoney, formatValueRange } from "@/lib/utilities";

function PipelineCard({ c, onDragStart, onDragEnd, dragging }: { c: CommercialContract; onDragStart: () => void; onDragEnd: () => void; dragging: boolean }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", c.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative rounded-lg border border-line bg-surface p-3 shadow-card transition-all hover:border-line-strong",
        dragging && "rotate-[0.6deg] opacity-50",
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-0.5 -ml-1 hidden size-3.5 shrink-0 cursor-grab text-faint opacity-0 transition-opacity group-hover:opacity-100 md:block" aria-hidden />
        <div className="min-w-0 flex-1">
          <Link href={`/commercial-opportunities/${c.id}`} className="block text-[13px] leading-snug font-medium text-ink hover:text-accent-ink">
            {c.title}
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted">{c.company}</p>
        </div>
        <ContractMenu
          contract={c}
          trigger={(props) => (
            <button {...props} className="-mt-0.5 -mr-1 rounded p-1 text-faint hover:bg-surface-3 hover:text-ink" aria-label={`Actions for ${c.title}`}>
              <MoreHorizontal className="size-3.5" />
            </button>
          )}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="tabular font-medium text-ink-2">{formatValueRange(c.valueMin, c.valueMax)}</span>
        <FitScore score={c.fitScore} showBar={false} className="[&>span]:text-xs" />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2 text-[11.5px] text-muted">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3" />
          {formatDate(c.deadline, { month: "short", day: "numeric" })}
        </span>
        {c.pursued && (
          <span className="inline-flex items-center gap-1 font-medium text-accent-ink">
            <Flag className="size-3 fill-current" /> Pursuing
          </span>
        )}
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const contracts = useContracts();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);
  const [adding, setAdding] = useState(false);

  const columns = useMemo(
    () =>
      PIPELINE_STAGES.map((stage) => {
        const items = contracts.filter((c) => c.status === stage).sort((a, b) => a.deadline.localeCompare(b.deadline));
        return { stage, items, value: items.reduce((s, c) => s + contractMidpoint(c), 0) };
      }),
    [contracts],
  );
  const lostCount = contracts.filter((c) => c.status === "Lost").length;
  const openValue = columns.filter((c) => c.stage !== "Won").reduce((s, c) => s + c.value, 0);

  const drop = (stage: PipelineStage, id: string) => {
    const c = contracts.find((x) => x.id === id);
    setOverStage(null);
    setDragId(null);
    if (!c || c.status === stage) return;
    setStatus(id, stage);
    toast(`Moved to ${stage}`, c.title);
  };

  return (
    <>
      <PageHeader
        title="Pipeline"
        description={`${formatMoney(openValue)} in open pipeline. Drag cards between stages, or use the card menu.`}
        actions={
          <Button variant="primary" onClick={() => setAdding(true)}>
            <Plus /> Add Contract
          </Button>
        }
      />

      <div className="scrollbar-thin -mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-3">
          {columns.map(({ stage, items, value }) => (
            <section
              key={stage}
              aria-label={`${stage} stage`}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overStage !== stage) setOverStage(stage);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverStage(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop(stage, e.dataTransfer.getData("text/plain"));
              }}
              className={cn(
                "flex w-[272px] shrink-0 snap-start flex-col rounded-xl border bg-surface-2 transition-colors sm:w-[248px]",
                overStage === stage ? "border-accent/50 bg-accent-soft" : "border-line",
              )}
            >
              <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("size-2 shrink-0 rounded-full", STATUS_STYLES[stage].dot)} />
                  <h2 className="truncate text-[13px] font-semibold text-ink">{STAGE_LABELS[stage] ?? stage}</h2>
                  <span className="tabular rounded-full bg-surface-3 px-1.5 text-[11px] font-medium text-muted">{items.length}</span>
                </div>
                <span className="tabular text-[11.5px] text-muted">{value ? formatMoney(value) : ""}</span>
              </header>
              <div className="flex min-h-32 flex-1 flex-col gap-2 px-2 pb-2">
                {items.map((c) => (
                  <PipelineCard key={c.id} c={c} dragging={dragId === c.id} onDragStart={() => setDragId(c.id)} onDragEnd={() => (setDragId(null), setOverStage(null))} />
                ))}
                {items.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line-strong px-3 py-6 text-center text-xs text-faint">
                    {dragId ? "Drop here" : "No opportunities"}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      {lostCount > 0 && (
        <p className="mt-2 text-xs text-muted">
          {lostCount} lost {lostCount === 1 ? "opportunity is" : "opportunities are"} hidden from the board.{" "}
          <Link href="/commercial-opportunities?status=Lost" className="font-medium text-accent-ink hover:underline">
            View lost
          </Link>
        </p>
      )}
      <ContractFormPanel open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
