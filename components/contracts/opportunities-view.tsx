"use client";

import { Flag, LayoutGrid, MoreHorizontal, Plus, Rows3, Search, SearchX, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { OpportunityCard } from "@/components/dashboard/recommended-opportunities";
import { urgencyClasses } from "@/components/dashboard/upcoming-deadlines";
import { VerifiedBadge, FitScore, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, EmptyState, PageHeader } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { useContracts, useNow } from "@/lib/store";
import { CONTRACT_STATUSES, SOURCE_TYPES, type CommercialContract, type ContractStatus } from "@/lib/types";
import { cn, contractMidpoint, daysUntil, describeDaysLeft, formatDate, formatValueRange, industryTags } from "@/lib/utilities";
import { ContractFormPanel } from "./contract-form";
import { ContractMenu } from "./contract-menu";

const DEADLINE_FILTERS = {
  any: "Any deadline",
  "7": "Due in 7 days",
  "30": "Due in 30 days",
  "90": "Due in 90 days",
  overdue: "Past deadline",
} as const;
type DeadlineFilter = keyof typeof DEADLINE_FILTERS;

const SORTS = {
  deadline: "Deadline (soonest)",
  fit: "Fit score (highest)",
  value: "Value (highest)",
  recent: "Recently added",
} as const;
type SortKey = keyof typeof SORTS;

function readParam<T extends string>(value: string | null, allowed: readonly T[]): T | "all" {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : "all";
}

/** Suspense-wrapped wrapper: reads initial filters from the URL (e.g. links from the dashboard or header search). */
export function OpportunitiesPage() {
  const params = useSearchParams();
  return <OpportunitiesView key={params.toString()} params={params} />;
}

function OpportunitiesView({ params }: { params: URLSearchParams }) {
  const contracts = useContracts();
  const now = useNow();
  const router = useRouter();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [status, setStatusFilter] = useState<ContractStatus | "all">(readParam(params.get("status"), CONTRACT_STATUSES));
  const [industry, setIndustry] = useState(params.get("industry") ?? "all");
  const [source, setSource] = useState(readParam(params.get("source"), SOURCE_TYPES));
  const [deadline, setDeadline] = useState<DeadlineFilter>("any");
  const [sort, setSort] = useState<SortKey>("deadline");
  const [view, setView] = useState<"table" | "cards">("table");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<CommercialContract | null>(null);

  const industries = useMemo(() => [...new Set(contracts.flatMap((c) => industryTags(c.industry)))].sort(), [contracts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = contracts.filter((c) => {
      if (q && ![c.title, c.company, c.industry, c.location, c.source, c.description].some((f) => f.toLowerCase().includes(q))) return false;
      if (status !== "all" && c.status !== status) return false;
      if (industry !== "all" && !industryTags(c.industry).some((t) => t.toLowerCase() === industry.toLowerCase())) return false;
      if (source !== "all" && c.source !== source) return false;
      if (deadline !== "any" && now !== null) {
        const d = daysUntil(c.deadline, now);
        if (deadline === "overdue" ? d >= 0 : d < 0 || d > Number(deadline)) return false;
      }
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "fit") return b.fitScore - a.fitScore;
      if (sort === "value") return contractMidpoint(b) - contractMidpoint(a);
      if (sort === "recent") return b.createdAt.localeCompare(a.createdAt);
      // Deadline: open items first (soonest), closed items last.
      const closedA = a.status === "Won" || a.status === "Lost";
      const closedB = b.status === "Won" || b.status === "Lost";
      if (closedA !== closedB) return closedA ? 1 : -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [contracts, query, status, industry, source, deadline, sort, now]);

  const activeFilters = [query.trim() !== "", status !== "all", industry !== "all", source !== "all", deadline !== "any"].filter(Boolean).length;
  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setIndustry("all");
    setSource("all");
    setDeadline("any");
    if (params.toString()) router.replace("/commercial-opportunities", { scroll: false });
  };

  return (
    <>
      <PageHeader
        title="Commercial Opportunities"
        description="Discover, review, and manage private-sector contract opportunities."
        actions={
          <Button variant="primary" onClick={() => setAdding(true)}>
            <Plus /> Add Commercial Contract
          </Button>
        }
      />

      <Card>
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-line p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by contract, company, industry or location"
                aria-label="Search opportunities"
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:w-auto">
              <Select aria-label="Filter by status" value={status} onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")} className="lg:w-40">
                <option value="all">All statuses</option>
                {CONTRACT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Select aria-label="Filter by industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="lg:w-40">
                <option value="all">All industries</option>
                {industries.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </Select>
              <Select aria-label="Filter by source" value={source} onChange={(e) => setSource(e.target.value as typeof source)} className="lg:w-40">
                <option value="all">All sources</option>
                {SOURCE_TYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Select aria-label="Filter by deadline" value={deadline} onChange={(e) => setDeadline(e.target.value as DeadlineFilter)} className="lg:w-40">
                {Object.entries(DEADLINE_FILTERS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <span>
                <span className="font-semibold text-ink">{filtered.length}</span> of {contracts.length} opportunities
              </span>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-accent-ink hover:bg-accent-soft">
                  <X className="size-3.5" /> Clear {activeFilters === 1 ? "filter" : `${activeFilters} filters`}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select aria-label="Sort opportunities" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-44 [&_select]:h-8 [&_select]:text-[13px]">
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
              <div className="hidden rounded-lg border border-line bg-surface-2 p-0.5 md:flex" role="group" aria-label="View">
                {(
                  [
                    ["table", Rows3, "Table view"],
                    ["cards", LayoutGrid, "Card view"],
                  ] as const
                ).map(([v, Icon, label]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    aria-label={label}
                    title={label}
                    className={cn("rounded-md p-1.5 transition-colors", view === v ? "bg-surface text-ink shadow-card" : "text-faint hover:text-ink")}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            title="No opportunities match these filters"
            description="Try a different search term or clear filters to see every opportunity."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            {/* Table (tablet/desktop) */}
            <div className={cn("scrollbar-thin relative overflow-x-auto", view === "table" ? "hidden md:block" : "hidden")}>
              <table className="w-full min-w-[1080px] table-fixed text-left">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[12.5%]" />
                  <col className="w-[11.5%]" />
                  <col className="w-[11%]" />
                  <col className="w-[10%]" />
                  <col className="w-[6%]" />
                  <col className="w-[11.5%]" />
                  <col className="w-[13.5%]" />
                  <col className="w-[4%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-line bg-surface-2 text-[11px] font-medium tracking-wider text-muted uppercase">
                    <th className="sticky left-0 z-[1] bg-surface-2 py-2.5 pr-2.5 pl-4 font-medium">Contract</th>
                    <th className="px-2.5 py-2.5 font-medium">Company</th>
                    <th className="px-2.5 py-2.5 font-medium">Industry</th>
                    <th className="px-2.5 py-2.5 font-medium">Value</th>
                    <th className="px-2.5 py-2.5 font-medium">Deadline</th>
                    <th className="px-2.5 py-2.5 font-medium">Fit</th>
                    <th className="px-2.5 py-2.5 font-medium">Source</th>
                    <th className="px-2.5 py-2.5 font-medium">Status</th>
                    <th className="py-2.5 pr-3 pl-1 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((c) => {
                    const days = now === null ? null : daysUntil(c.deadline, now);
                    const closed = c.status === "Won" || c.status === "Lost";
                    return (
                      <tr key={c.id} className="group cursor-pointer transition-colors hover:bg-surface-2" onClick={() => router.push(`/commercial-opportunities/${c.id}`)}>
                        <td className="sticky left-0 z-[1] bg-surface py-3 pr-2.5 pl-4 group-hover:bg-surface-2">
                          <Link
                            href={`/commercial-opportunities/${c.id}`}
                            onClick={(e) => e.stopPropagation()}
                            title={c.title}
                            className="block truncate text-[13.5px] font-medium text-ink hover:text-accent-ink"
                          >
                            {c.title}
                          </Link>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                            <span className="truncate">{c.location}</span>
                            {c.pursued && <Flag className="size-3 shrink-0 fill-accent text-accent" aria-label="Pursued" />}
                            {c.isSeeded ? <VerifiedBadge retrievedAt={c.retrievedAt} /> : <span className="rounded bg-accent-soft px-1 text-[9.5px] font-semibold tracking-wider text-accent-ink uppercase">Added</span>}
                          </span>
                        </td>
                        <td className="truncate px-2.5 py-3 text-[13px] text-ink-2" title={c.company}>{c.company}</td>
                        <td className="truncate px-2.5 py-3 text-[13px] text-muted" title={c.industry}>{c.industry}</td>
                        <td className="tabular truncate px-2.5 py-3 text-[13px] text-ink-2">{formatValueRange(c.valueMin, c.valueMax)}</td>
                        <td className="px-2.5 py-3 whitespace-nowrap">
                          <span className="tabular block text-[13px] text-ink-2">{formatDate(c.deadline)}</span>
                          {days !== null && !closed && (
                            <span className={cn("mt-1 inline-block rounded-full px-1.5 py-px text-[10.5px] font-medium ring-1 ring-inset", urgencyClasses(days))}>
                              {describeDaysLeft(days)}
                            </span>
                          )}
                        </td>
                        <td className="px-2.5 py-3">
                          <FitScore score={c.fitScore} showBar={false} />
                        </td>
                        <td className="truncate px-2.5 py-3 text-[13px] text-muted" title={c.source}>{c.source}</td>
                        <td className="px-2.5 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3 pr-3 pl-1 text-right" onClick={(e) => e.stopPropagation()}>
                          <ContractMenu
                            contract={c}
                            onEdit={() => setEditing(c)}
                            trigger={(props) => (
                              <button {...props} className="rounded-md p-1.5 text-faint transition-colors hover:bg-surface-3 hover:text-ink" aria-label={`Actions for ${c.title}`}>
                                <MoreHorizontal className="size-4" />
                              </button>
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile always; desktop when chosen) */}
            <div className={cn("grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3", view === "table" && "md:hidden")}>
              {filtered.map((c) => (
                <OpportunityCard key={c.id} c={c} />
              ))}
            </div>
          </>
        )}
      </Card>

      <p className="mt-4 text-center text-xs text-faint">
        Opportunities marked <span className="font-semibold">Verified</span> are real public solicitations checked on the buyer&apos;s source page. Deadlines and terms can change — always confirm on the source before bidding.
      </p>

      <ContractFormPanel open={adding} onClose={() => setAdding(false)} />
      <ContractFormPanel open={editing !== null} onClose={() => setEditing(null)} contract={editing ?? undefined} />
    </>
  );
}
