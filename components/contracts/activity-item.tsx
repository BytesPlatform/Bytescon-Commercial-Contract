import {
  CheckCircle2,
  ClipboardCheck,
  FilePen,
  FileSearch,
  Flag,
  PencilLine,
  Plus,
  Send,
  Trophy,
  XCircle,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";
import type { ActivityKind } from "@/lib/types";
import { cn } from "@/lib/utilities";

const ICONS: Record<ActivityKind, { icon: LucideIcon; className: string }> = {
  added: { icon: Plus, className: "bg-accent-soft text-accent" },
  reviewed: { icon: FileSearch, className: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400" },
  status: { icon: ArrowRightLeft, className: "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400" },
  proposal: { icon: FilePen, className: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400" },
  checklist: { icon: ClipboardCheck, className: "bg-surface-3 text-ink-2" },
  submitted: { icon: Send, className: "bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400" },
  pursued: { icon: Flag, className: "bg-accent-soft text-accent" },
  edited: { icon: PencilLine, className: "bg-surface-3 text-ink-2" },
  won: { icon: Trophy, className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" },
  lost: { icon: XCircle, className: "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400" },
};

export function ActivityIcon({ kind, className }: { kind: ActivityKind; className?: string }) {
  const { icon: Icon, className: tone } = ICONS[kind] ?? { icon: CheckCircle2, className: "bg-surface-3 text-ink-2" };
  return (
    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-surface", tone, className)}>
      <Icon className="size-3.5" />
    </span>
  );
}
