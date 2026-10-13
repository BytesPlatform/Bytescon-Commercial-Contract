"use client";

import { Download, Eye, FileSearch, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { documents } from "@/data/documents";
import { useContracts } from "@/lib/store";
import { DOCUMENT_CATEGORIES, type ContractDocument, type DocumentCategory } from "@/lib/types";
import { cn, formatDate } from "@/lib/utilities";
import { DocStatusBadge, DocumentPreview, FileIcon } from "./document-bits";

export function DocumentsView() {
  const contracts = useContracts();
  const byId = useMemo(() => new Map(contracts.map((c) => [c.id, c])), [contracts]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [fileType, setFileType] = useState<ContractDocument["fileType"] | "all">("all");
  const [preview, setPreview] = useState<ContractDocument | null>(null);

  const counts = useMemo(() => Object.fromEntries(DOCUMENT_CATEGORIES.map((c) => [c, documents.filter((d) => d.category === c).length])), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents
      .filter((d) => {
        const c = byId.get(d.contractId);
        if (q && ![d.name, d.category, c?.title ?? "", c?.company ?? ""].some((f) => f.toLowerCase().includes(q))) return false;
        if (category !== "all" && d.category !== category) return false;
        if (fileType !== "all" && d.fileType !== fileType) return false;
        return true;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, category, fileType, byId]);

  const hasFilters = query || category !== "all" || fileType !== "all";
  const clear = () => {
    setQuery("");
    setCategory("all");
    setFileType("all");
  };

  return (
    <>
      <PageHeader title="Documents" description="RFP packages, proposals, pricing and compliance files across your opportunities." />

      {/* Category chips */}
      <div className="scrollbar-thin -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {(["all", ...DOCUMENT_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
              category === cat ? "border-accent/30 bg-accent-soft text-accent-ink" : "border-line bg-surface text-ink-2 hover:border-line-strong",
            )}
          >
            {cat === "all" ? "All documents" : cat}
            <span className="tabular text-xs text-muted">{cat === "all" ? documents.length : counts[cat]}</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents or opportunities" aria-label="Search documents" className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Select aria-label="Filter by file type" value={fileType} onChange={(e) => setFileType(e.target.value as typeof fileType)} className="flex-1 sm:w-36">
              <option value="all">All file types</option>
              <option value="PDF">PDF</option>
              <option value="XLSX">Excel (XLSX)</option>
              <option value="DOCX">Word (DOCX)</option>
            </Select>
            {hasFilters && (
              <button onClick={clear} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-[13px] font-medium text-accent-ink hover:bg-accent-soft">
                <X className="size-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<FileSearch />} title="No documents found" description="Try another search term or category." />
        ) : (
          <>
            <div className="scrollbar-thin relative hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-line bg-surface-2 text-[11px] font-medium tracking-wider text-muted uppercase">
                    <th className="py-2.5 pr-3 pl-4 font-medium">Name</th>
                    <th className="px-3 py-2.5 font-medium">Category</th>
                    <th className="px-3 py-2.5 font-medium">Opportunity</th>
                    <th className="px-3 py-2.5 font-medium">Retrieved</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="py-2.5 pr-4 pl-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((d) => {
                    const c = byId.get(d.contractId);
                    return (
                      <tr key={d.id} className="transition-colors hover:bg-surface-2">
                        <td className="py-3 pr-3 pl-4">
                          <div className="flex items-center gap-3">
                            <FileIcon type={d.fileType} />
                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-[13.5px] font-medium text-ink">{d.name}</p>
                              <p className="text-xs text-muted">
                                {d.fileType}
                                {d.size ? ` · ${d.size}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[13px] text-ink-2">{d.category}</td>
                        <td className="max-w-[240px] px-3 py-3">
                          {c ? (
                            <>
                              <Link href={`/commercial-opportunities/${c.id}`} className="block truncate text-[13px] font-medium text-ink-2 hover:text-accent-ink">
                                {c.title}
                              </Link>
                              <p className="truncate text-xs text-muted">{c.company}</p>
                            </>
                          ) : (
                            <span className="text-[13px] text-faint">—</span>
                          )}
                        </td>
                        <td className="tabular px-3 py-3 text-[13px] whitespace-nowrap text-muted">{formatDate(d.updatedAt)}</td>
                        <td className="px-3 py-3">
                          <DocStatusBadge status={d.status} />
                        </td>
                        <td className="py-3 pr-4 pl-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setPreview(d)} className="rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label={`View ${d.name}`} title="View details">
                              <Eye className="size-4" />
                            </button>
                            {d.url ? (
                              <a href={d.url} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-muted hover:bg-surface-3 hover:text-ink" aria-label={`Open ${d.name} on the buyer's site`} title="Open original file">
                                <Download className="size-4" />
                              </a>
                            ) : (
                              <button disabled className="rounded-md p-1.5 text-faint opacity-50" aria-label="No file link available" title="No file link available">
                                <Download className="size-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {filtered.map((d) => {
                const c = byId.get(d.contractId);
                return (
                  <li key={d.id}>
                    <button onClick={() => setPreview(d)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2">
                      <FileIcon type={d.fileType} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                        <p className="truncate text-xs text-muted">
                          {c?.title ?? "—"} · {formatDate(d.updatedAt, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <DocStatusBadge status={d.status} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>
      <p className="mt-4 text-center text-xs text-faint">Files are hosted by each buyer and open on their site. Nothing is uploaded or stored in this app.</p>
      <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
    </>
  );
}
