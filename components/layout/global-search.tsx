"use client";

import { ArrowRight, Briefcase, Building2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useCompanies, useContracts } from "@/lib/store";
import { cn } from "@/lib/utilities";

type Result = { key: string; href: string; title: string; subtitle: string; kind: "contract" | "company" };

export function GlobalSearch({ autoFocus, onNavigate, className }: { autoFocus?: boolean; onNavigate?: () => void; className?: string }) {
  const router = useRouter();
  const contracts = useContracts();
  const companies = useCompanies();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const contractHits = contracts
      .filter((c) => [c.title, c.company, c.industry, c.location].some((f) => f.toLowerCase().includes(q)))
      .slice(0, 5)
      .map<Result>((c) => ({
        key: c.id,
        href: `/commercial-opportunities/${c.id}`,
        title: c.title,
        subtitle: `${c.company} · ${c.status}`,
        kind: "contract",
      }));
    const companyHits = companies
      .filter((co) => co.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map<Result>((co) => ({
        key: co.id,
        href: `/companies?company=${encodeURIComponent(co.id)}`,
        title: co.name,
        subtitle: `${co.industry} · ${co.opportunities.length} ${co.opportunities.length === 1 ? "opportunity" : "opportunities"}`,
        kind: "company",
      }));
    return [...contractHits, ...companyHits];
  }, [query, contracts, companies]);

  // ⌘K / Ctrl+K or "/" focuses search (desktop instance only).
  useEffect(() => {
    if (autoFocus) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [autoFocus]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    input.current?.blur();
    onNavigate?.();
    router.push(href);
  };
  const viewAll = () => go(`/commercial-opportunities?q=${encodeURIComponent(query.trim())}`);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const total = results.length + 1; // + "view all"
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + total) % total);
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      if (active < results.length) go(results[active]!.href);
      else viewAll();
    } else if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    }
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
      <input
        ref={input}
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-label="Search opportunities and companies"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search contracts, companies…"
        className="h-9 w-full rounded-lg border border-line bg-surface-2 pr-12 pl-9 text-sm text-ink placeholder:text-faint transition-colors hover:border-line-strong focus:border-accent focus:bg-surface focus:ring-3 focus:ring-accent/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {!autoFocus && (
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-px font-sans text-[10.5px] font-medium text-faint lg:block">
          ⌘K
        </kbd>
      )}
      {showPanel && (
        <div id={listId} role="listbox" className="animate-pop-in absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">No matches for &ldquo;{query.trim()}&rdquo;</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((r, i) => {
                const Icon = r.kind === "contract" ? Briefcase : Building2;
                return (
                  <li key={`${r.kind}-${r.key}`}>
                    <button
                      role="option"
                      aria-selected={active === i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.href)}
                      className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left", active === i && "bg-surface-3")}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-muted">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                        <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            onMouseEnter={() => setActive(results.length)}
            onClick={viewAll}
            className={cn(
              "flex w-full items-center justify-between border-t border-line px-4 py-2.5 text-[13px] font-medium text-accent-ink",
              active === results.length && "bg-surface-3",
            )}
          >
            View all results in Commercial Opportunities
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
