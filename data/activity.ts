import type { ActivityEvent, CommercialContract } from "@/lib/types";
import { PIPELINE_STAGES } from "@/lib/types";

const MINUTE = 60_000;

/**
 * Starting timeline for a researched opportunity: when it was imported and
 * verified, plus the example tracking stage it was placed in.
 */
export function seedActivity(c: CommercialContract): ActivityEvent[] {
  const start = new Date(c.createdAt).getTime();
  const stage = PIPELINE_STAGES.indexOf(c.status as (typeof PIPELINE_STAGES)[number]);
  const events: Omit<ActivityEvent, "id" | "contractId">[] = [];
  const push = (offset: number, kind: ActivityEvent["kind"], message: string) => {
    events.push({ kind, message, at: new Date(start + offset).toISOString() });
  };

  push(0, "added", `Opportunity imported from ${c.source}`);
  push(2 * MINUTE, "reviewed", "Buyer, scope and deadline verified on the source page");
  if (stage >= 1) push(10 * MINUTE, "status", "Moved to Reviewing");
  if (stage >= 2) push(20 * MINUTE, "status", "Marked as Qualified");
  if (stage >= 3) push(30 * MINUTE, "proposal", "Proposal preparation started");

  return events.map((e, i) => ({ ...e, id: `${c.id}-seed-${i}`, contractId: c.id }));
}
