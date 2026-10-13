"use client";

import { ArrowRight, Briefcase, Building2, Globe, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState, PageHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/overlay";
import { useCompanies, type CompanySummary } from "@/lib/store";
import { formatDate, formatMoney, formatValueRange, initials } from "@/lib/utilities";

const AVATAR_TONES = [
  "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
  "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
  "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
];

function CompanyAvatar({ name, className = "size-10 text-sm" }: { name: string; className?: string }) {
  const tone = AVATAR_TONES[[...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % AVATAR_TONES.length];
  return <span className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ${tone} ${className}`}>{initials(name)}</span>;
}

export function CompaniesPage() {
  const params = useSearchParams();
  return <CompaniesView key={params.get("company") ?? ""} initialCompany={params.get("company")} />;
}

function CompaniesView({ initialCompany }: { initialCompany: string | null }) {
  const companies = useCompanies();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialCompany);
  const selected = companies.find((c) => c.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => !q || [c.name, c.industry, c.headquarters].some((f) => f.toLowerCase().includes(q)));
  }, [companies, query]);

  const close = () => {
    setSelectedId(null);
    if (initialCompany) router.replace("/companies", { scroll: false });
  };

  return (
    <>
      <PageHeader title="Companies" description="Buyers and prime contractors linked to your commercial opportunities." />

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
        <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies or industries" aria-label="Search companies" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Building2 />} title="No companies found" description="Try a different name or industry." />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filtered.map((co) => (
            <button
              key={co.id}
              onClick={() => setSelectedId(co.id)}
              className="group flex flex-col rounded-xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-line-strong sm:p-5"
            >
              <div className="flex items-start gap-3">
                <CompanyAvatar name={co.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-accent-ink">{co.name}</p>
                  <p className="truncate text-[13px] text-muted">{co.industry}</p>
                </div>
                
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
                <div>
                  <p className="text-[11px] text-faint">Opportunities</p>
                  <p className="text-sm font-semibold text-ink">
                    {co.opportunities.length}
                    <span className="ml-1 text-xs font-normal text-muted">({co.openCount} open)</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-faint">Open pipeline</p>
                  <p className="tabular text-sm font-semibold text-ink">{co.pipelineValue ? formatMoney(co.pipelineValue) : "—"}</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="size-3.5 text-faint" />
                {co.headquarters}
              </p>
            </button>
          ))}
        </div>
      )}

      <CompanyPanel company={selected} onClose={close} />
    </>
  );
}

function CompanyPanel({ company: co, onClose }: { company: CompanySummary | null; onClose: () => void }) {
  return (
    <SlideOver open={co !== null} onClose={onClose} title={co?.name ?? ""} description={co?.industry}>
      {co && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <CompanyAvatar name={co.name} className="size-12 text-base" />
            <p className="text-sm leading-relaxed text-ink-2">{co.about}</p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {[
              ["Industry", co.industry],
              ["Headquarters", co.headquarters],
              ["Open opportunities", String(co.openCount)],
              ["Total pipeline value", co.pipelineValue ? formatMoney(co.pipelineValue) : "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-3.5">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink">{v}</dd>
              </div>
            ))}
            <div className="col-span-2 bg-surface p-3.5">
              <dt className="text-xs text-muted">Website</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-ink">
                <Globe className="size-3.5 text-faint" />
                {co.website ? (
                  <a href={co.website} target="_blank" rel="noopener noreferrer" className="truncate text-accent-ink hover:underline">
                    {co.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                ) : (
                  <span className="font-normal text-muted">Not provided</span>
                )}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Briefcase className="size-4 text-faint" /> Associated opportunities
            </h3>
            {co.opportunities.length === 0 ? (
              <p className="text-sm text-muted">No opportunities linked yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
                {co.opportunities.map((c) => (
                  <li key={c.id}>
                    <Link href={`/commercial-opportunities/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-ink">{c.title}</p>
                        <p className="text-xs text-muted">
                          {formatValueRange(c.valueMin, c.valueMax)} · Due {formatDate(c.deadline)}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ButtonLink href={`/commercial-opportunities?q=${encodeURIComponent(co.name)}`} variant="secondary" className="self-start">
            View in Commercial Opportunities <ArrowRight />
          </ButtonLink>
        </div>
      )}
    </SlideOver>
  );
}
