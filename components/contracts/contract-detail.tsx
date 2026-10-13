"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  FileQuestion,
  Flag,
  Gauge,
  Globe,
  Layers,
  MapPin,
  MoreHorizontal,
  Pencil,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Badge, VerifiedBadge, FitScore, StatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { documentsForContract } from "@/data/documents";
import { togglePursued, useActivity, useContract, useHydrated, useNow } from "@/lib/store";
import { toast } from "@/lib/toast";
import type { CommercialContract } from "@/lib/types";
import { cn, daysUntil, describeDaysLeft, formatDate, formatValueRange, isSafeHttpUrl } from "@/lib/utilities";
import { urgencyClasses } from "@/components/dashboard/upcoming-deadlines";
import { ContractFormPanel } from "./contract-form";
import { ContractMenu } from "./contract-menu";
import { ActivityTab, DocumentsTab, RequirementsTab } from "./detail-tabs";

type Tab = "overview" | "requirements" | "documents" | "activity";

export function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const contract = useContract(id);
  const hydrated = useHydrated();

  if (!contract) {
    // User-added contracts only exist in localStorage, so wait for hydration before deciding.
    if (!hydrated) return <DetailSkeleton />;
    return (
      <Card>
        <EmptyState
          icon={<FileQuestion />}
          title="Contract not found"
          description="It may have been deleted, or it was added in a different browser. Contracts you add are stored locally."
          action={
            <ButtonLink href="/commercial-opportunities" variant="secondary">
              <ArrowLeft /> Back to opportunities
            </ButtonLink>
          }
        />
      </Card>
    );
  }
  return <ContractDetailView key={contract.id} contract={contract} />;
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading contract">
      <div className="h-4 w-40 rounded bg-surface-3" />
      <div className="mt-4 h-7 w-80 max-w-full rounded bg-surface-3" />
      <div className="mt-2 h-4 w-48 rounded bg-surface-3" />
      <div className="mt-8 h-10 w-full max-w-md rounded bg-surface-3" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-xl bg-surface-3 lg:col-span-2" />
        <div className="h-72 rounded-xl bg-surface-3" />
      </div>
    </div>
  );
}

function ContractDetailView({ contract: c }: { contract: CommercialContract }) {
  const router = useRouter();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const activity = useActivity(c.id);
  const docs = documentsForContract(c.id);
  const done = c.requirements.filter((r) => r.done).length;
  const days = now === null ? null : daysUntil(c.deadline, now);
  const closed = c.status === "Won" || c.status === "Lost";

  const tabs: { id: Tab; label: string; count?: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Requirements", count: `${done}/${c.requirements.length}` },
    { id: "documents", label: "Documents", count: String(docs.length) },
    { id: "activity", label: "Activity", count: String(activity.length) },
  ];

  return (
    <>
      <Link href="/commercial-opportunities" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink">
        <ArrowLeft className="size-3.5" /> All opportunities
      </Link>

      {/* Title block */}
      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="accent">Commercial</Badge>
            <Badge>{c.opportunityType}</Badge>
            <StatusBadge status={c.status} />
            {c.isSeeded ? <VerifiedBadge retrievedAt={c.retrievedAt} /> : <Badge tone="outline">Added by you</Badge>}
          </div>
          <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{c.title}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4 text-faint" />
              {c.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-faint" />
              {c.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-4 text-faint" />
              <FitScore score={c.fitScore} showBar={false} /> fit
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Pencil /> Edit
          </Button>
          <Button
            variant={c.pursued ? "secondary" : "primary"}
            onClick={() => {
              togglePursued(c.id);
              toast(c.pursued ? "Pursuit flag removed" : "Marked as pursued", c.title);
            }}
            aria-pressed={!!c.pursued}
            className={cn(c.pursued && "border-accent/30 bg-accent-soft text-accent-ink hover:bg-accent-soft hover:text-accent-ink")}
          >
            <Flag className={cn(c.pursued && "fill-current")} />
            {c.pursued ? "Pursuing" : "Mark as Pursued"}
          </Button>
          <ContractMenu
            contract={c}
            showView={false}
            onDeleted={() => router.push("/commercial-opportunities")}
            trigger={(props) => (
              <Button {...props} variant="secondary" size="icon" aria-label="More actions">
                <MoreHorizontal />
              </Button>
            )}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="scrollbar-thin mt-6 -mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Contract sections">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative -mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[13.5px] font-medium whitespace-nowrap transition-colors",
                tab === t.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
              {t.count && (
                <span className={cn("tabular rounded-full px-1.5 py-px text-[11px]", tab === t.id ? "bg-accent-soft text-accent-ink" : "bg-surface-3 text-muted")}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === "overview" && <OverviewTab c={c} days={closed ? null : days} />}
        {tab === "requirements" && <RequirementsTab contract={c} />}
        {tab === "documents" && <DocumentsTab docs={docs} />}
        {tab === "activity" && <ActivityTab events={activity} />}
      </div>

      <ContractFormPanel open={editing} onClose={() => setEditing(false)} contract={c} />
    </>
  );
}

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3">
      <span className="mt-0.5 text-faint [&_svg]:size-4">{icon}</span>
      <dt className="w-28 shrink-0 text-[13px] text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-[13px] font-medium text-ink">{children}</dd>
    </div>
  );
}

function OverviewTab({ c, days }: { c: CommercialContract; days: number | null }) {
  const hasUrl = isSafeHttpUrl(c.sourceUrl);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card>
          <CardHeader title="Opportunity Summary" />
          <p className="px-5 pb-5 text-sm leading-relaxed text-ink-2">{c.description || "No description provided yet. Use Edit to add the scope and buyer needs."}</p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Why This Opportunity Fits" description="Your capability notes" />
            {c.fitReasons.length > 0 ? (
              <ul className="flex flex-col gap-2.5 px-5 pb-5">
                {c.fitReasons.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 pb-5 text-[13px] text-muted">No fit notes yet. The {c.fitScore}% fit score is an estimate — adjust it with Edit once you&apos;ve reviewed the solicitation against your capabilities.</p>
            )}
          </Card>
          <Card>
            <CardHeader title="Potential Considerations" description={c.isSeeded ? "Stated in the solicitation" : undefined} />
            {c.considerations.length > 0 ? (
              <ul className="flex flex-col gap-2.5 px-5 pb-5">
                {c.considerations.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 pb-5 text-[13px] text-muted">No considerations recorded yet.</p>
            )}
          </Card>
        </div>
      </div>

      <Card className="self-start">
        <CardHeader title="Key Details" />
        <dl className="divide-y divide-line border-t border-line">
          <DetailRow icon={<Building2 />} label="Company">{c.company}</DetailRow>
          <DetailRow icon={<Layers />} label="Industry">{c.industry}</DetailRow>
          <DetailRow icon={<MapPin />} label="Location">{c.location}</DetailRow>
          <DetailRow icon={<CircleDollarSign />} label="Estimated value">
            <span className="tabular">{formatValueRange(c.valueMin, c.valueMax)}</span>
          </DetailRow>
          <DetailRow icon={<CalendarDays />} label="Deadline">
            <span className="tabular">{formatDate(c.deadline)}</span>
            {days !== null && (
              <span className={cn("ml-2 inline-block rounded-full px-1.5 py-px text-[10.5px] font-medium ring-1 ring-inset", urgencyClasses(days))}>{describeDaysLeft(days)}</span>
            )}
          </DetailRow>
          <DetailRow icon={<Globe />} label="Source">
            <span className="block">{c.source}</span>
            {hasUrl ? (
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline">
                Open source page <ExternalLink className="size-3" />
              </a>
            ) : (
              <span className="mt-1 block text-xs font-normal text-faint">No source link added</span>
            )}
          </DetailRow>
          {c.retrievedAt && (
            <DetailRow icon={<CheckCircle2 />} label="Verified">
              <span className="font-normal text-ink-2">{formatDate(c.retrievedAt)} on source page</span>
              <span className="mt-1 block text-xs font-normal text-faint">Confirm the deadline and terms on the source before bidding.</span>
            </DetailRow>
          )}
          <DetailRow icon={<Tag />} label="Opportunity type">{c.opportunityType}</DetailRow>
          <DetailRow icon={<Flag />} label="Status">
            <StatusBadge status={c.status} />
          </DetailRow>
          <DetailRow icon={<Gauge />} label="Fit (estimate)">
            <FitScore score={c.fitScore} />
          </DetailRow>
        </dl>
      </Card>
    </div>
  );
}
