"use client";

import { Database, Info, Moon, RotateCcw, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { Modal } from "@/components/ui/overlay";
import { resetWorkspace, useWorkspaceStats } from "@/lib/store";
import { setTheme, useTheme, type Theme } from "@/lib/theme";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utilities";

export function SettingsView() {
  const theme = useTheme();
  const stats = useWorkspaceStats();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <PageHeader title="Settings" description="Workspace preferences for this browser." />
      <div className="flex max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader title="Appearance" description="Light mode is the default. Your choice is remembered on this device." />
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
            {(
              [
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
              ] as [Theme, string, typeof Sun][]
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  theme === value ? "border-accent bg-accent-soft ring-1 ring-accent" : "border-line hover:border-line-strong",
                )}
              >
                <span
                  className={cn(
                    "flex h-12 w-16 shrink-0 flex-col gap-1 rounded-md border p-1.5",
                    value === "light" ? "border-[#e6e8ec] bg-[#f5f6f8]" : "border-[#242a33] bg-[#0b0d11]",
                  )}
                  aria-hidden
                >
                  <span className={cn("h-1.5 w-8 rounded-sm", value === "light" ? "bg-[#d5d9e0]" : "bg-[#313844]")} />
                  <span className={cn("flex-1 rounded-sm", value === "light" ? "bg-white" : "bg-[#161a20]")} />
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  <Icon className="size-4 text-muted" /> {label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Workspace data" description="Researched opportunities are built in. Changes you make are stored in this browser's local storage." />
          <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-[13px] text-ink-2">
              <Database className="mt-0.5 size-4 shrink-0 text-faint" />
              <span>
                {stats.addedCount} added {stats.addedCount === 1 ? "contract" : "contracts"} · {stats.editedCount} edited sample{" "}
                {stats.editedCount === 1 ? "record" : "records"} · {stats.activityCount} activity {stats.activityCount === 1 ? "event" : "events"}
              </span>
            </div>
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              <RotateCcw /> Reset workspace
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="About this prototype" />
          <div className="flex gap-3 px-5 pb-5 text-[13px] leading-relaxed text-ink-2">
            <Info className="mt-0.5 size-4 shrink-0 text-faint" />
            <p>
              Clearbid is a frontend-only prototype for managing commercial contract opportunities. Seeded opportunities are real public solicitations that
              were verified on each buyer&apos;s source page on the date shown. They are a snapshot, not a live feed — deadlines and terms can change, so always
              confirm on the source before bidding. Pipeline stages and fit scores are example tracking data.
            </p>
          </div>
        </Card>
      </div>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Reset workspace?"
        description="This removes contracts you added, edits, checklist progress and activity stored in this browser. Researched opportunities stay."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)} data-autofocus>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetWorkspace();
                setConfirming(false);
                toast("Workspace reset", "Opportunities restored to their original state.");
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
}
