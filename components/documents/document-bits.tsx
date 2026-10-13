"use client";

import { ExternalLink, FileSpreadsheet, FileText, FileType2, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/overlay";
import { useContract } from "@/lib/store";
import type { ContractDocument, DocumentStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utilities";

const FILE_STYLES = {
  PDF: { icon: FileText, className: "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400" },
  XLSX: { icon: FileSpreadsheet, className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" },
  DOCX: { icon: FileType2, className: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400" },
} as const;

export function FileIcon({ type, className }: { type: ContractDocument["fileType"]; className?: string }) {
  const { icon: Icon, className: tone } = FILE_STYLES[type];
  return (
    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tone, className)}>
      <Icon className="size-4" />
    </span>
  );
}

const STATUS_TONES: Record<DocumentStatus, string> = {
  Received: "text-sky-700 bg-sky-50 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20",
  Draft: "text-ink-2 bg-surface-3 ring-line",
  "In Review": "text-amber-800 bg-amber-50 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  Final: "text-emerald-700 bg-emerald-50 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  Pending: "text-violet-700 bg-violet-50 ring-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
};

export function DocStatusBadge({ status }: { status: DocumentStatus }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset", STATUS_TONES[status])}>{status}</span>;
}

export function DocumentPreview({ doc, onClose }: { doc: ContractDocument | null; onClose: () => void }) {
  const contract = useContract(doc?.contractId);
  return (
    <Modal
      open={doc !== null}
      onClose={onClose}
      title={doc?.name ?? ""}
      description={doc?.category}
      footer={
        <Button variant="secondary" onClick={onClose} data-autofocus>
          Close
        </Button>
      }
    >
      {doc && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface-2 p-4">
            <FileIcon type={doc.fileType} className="size-11" />
            <div className="text-[13px] text-muted">
              <p className="font-medium text-ink">{doc.url ? "Hosted on the buyer's site" : "No file link available"}</p>
              {doc.url ? "Files aren't stored in this app — open the original below." : "Check the opportunity's source page for this file."}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
            <div>
              <dt className="text-xs text-muted">Category</dt>
              <dd className="font-medium text-ink">{doc.category}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Status</dt>
              <dd className="mt-0.5">
                <DocStatusBadge status={doc.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Type · Size</dt>
              <dd className="font-medium text-ink">
                {doc.fileType}
                {doc.size ? ` · ${doc.size}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Retrieved</dt>
              <dd className="font-medium text-ink">{formatDate(doc.updatedAt)}</dd>
            </div>
            {contract && (
              <div className="col-span-2">
                <dt className="text-xs text-muted">Opportunity</dt>
                <dd>
                  <Link href={`/commercial-opportunities/${contract.id}`} onClick={onClose} className="font-medium text-accent-ink hover:underline">
                    {contract.title}
                  </Link>
                  <span className="text-muted"> · {contract.company}</span>
                </dd>
              </div>
            )}
          </dl>
          {doc.url ? (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-start rounded-lg bg-accent px-3 py-2 text-[13px] font-medium text-white hover:bg-accent-hover dark:text-[#0b0d11]"
            >
              Open original file <ExternalLink className="size-3.5" />
            </a>
          ) : null}
          <p className="flex items-start gap-2 text-xs text-muted">
            <Info className="mt-px size-3.5 shrink-0" /> Buyers may revise or remove files — always use the latest version on their site.
          </p>
        </div>
      )}
    </Modal>
  );
}
