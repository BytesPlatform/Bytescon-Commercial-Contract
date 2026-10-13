"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/overlay";
import { addContract, updateContract, useContracts } from "@/lib/store";
import { toast } from "@/lib/toast";
import {
  CONTRACT_STATUSES,
  OPPORTUNITY_TYPES,
  SOURCE_TYPES,
  type CommercialContract,
  type ContractStatus,
  type OpportunityType,
  type SourceType,
} from "@/lib/types";
import { formatValueRange, isSafeHttpUrl, parseValueRange } from "@/lib/utilities";

interface FormState {
  title: string;
  company: string;
  industry: string;
  opportunityType: OpportunityType;
  value: string;
  location: string;
  deadline: string;
  source: SourceType;
  sourceUrl: string;
  fitScore: number;
  status: ContractStatus;
  description: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  company: "",
  industry: "",
  opportunityType: "RFP",
  value: "",
  location: "",
  deadline: "",
  source: "Company Website",
  sourceUrl: "",
  fitScore: 75,
  status: "New",
  description: "",
};

function fromContract(c: CommercialContract): FormState {
  return {
    title: c.title,
    company: c.company,
    industry: c.industry,
    opportunityType: c.opportunityType,
    value: c.valueMin === null ? "" : formatValueRange(c.valueMin, c.valueMax).replace("–", "-"),
    location: c.location,
    deadline: c.deadline,
    source: c.source,
    sourceUrl: c.sourceUrl ?? "",
    fitScore: c.fitScore,
    status: c.status,
    description: c.description,
  };
}

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.title.trim()) e.title = "Enter a contract title.";
  if (!f.company.trim()) e.company = "Enter the buyer or company name.";
  if (!f.industry.trim()) e.industry = "Enter an industry.";
  if (f.value.trim() && !parseValueRange(f.value)) e.value = "Use a value like $250K or $250K - $400K, or leave blank.";
  if (!f.location.trim()) e.location = "Enter a location, or “Remote”.";
  if (!f.deadline) e.deadline = "Choose the response deadline.";
  if (f.sourceUrl.trim() && !isSafeHttpUrl(f.sourceUrl.trim())) e.sourceUrl = "Enter a full URL starting with https://";
  return e;
}

export function ContractFormPanel({
  open,
  onClose,
  contract,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  /** When provided, the panel edits this contract instead of creating one. */
  contract?: CommercialContract;
  onSaved?: (c: CommercialContract) => void;
}) {
  // Remount the form body whenever it opens so it starts from fresh values.
  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={contract ? "Edit commercial contract" : "Add commercial contract"}
      description={contract ? contract.title : "Track a new private-sector opportunity. Saved in this browser."}
    >
      {open && <ContractForm key={contract?.id ?? "new"} contract={contract} onClose={onClose} onSaved={onSaved} />}
    </SlideOver>
  );
}

function ContractForm({ contract, onClose, onSaved }: { contract?: CommercialContract; onClose: () => void; onSaved?: (c: CommercialContract) => void }) {
  const [form, setForm] = useState<FormState>(() => (contract ? fromContract(contract) : EMPTY_FORM));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const uid = useId();
  const contracts = useContracts();
  const industries = useMemo(() => [...new Set(contracts.map((c) => c.industry))].sort(), [contracts]);
  const parsed = parseValueRange(form.value);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };
  const id = (name: string) => `${uid}-${name}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(id(first!))?.focus();
      return;
    }
    const range = parseValueRange(form.value);
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      industry: form.industry.trim(),
      opportunityType: form.opportunityType,
      valueMin: range?.min ?? null,
      valueMax: range?.max ?? null,
      location: form.location.trim(),
      deadline: form.deadline,
      source: form.source,
      sourceUrl: form.sourceUrl.trim() || undefined,
      fitScore: Math.max(0, Math.min(100, Math.round(form.fitScore))),
      status: form.status,
      description: form.description.trim(),
    };
    if (contract) {
      updateContract(contract.id, payload);
      toast("Contract updated", payload.title);
      onSaved?.({ ...contract, ...payload });
    } else {
      const created = addContract(payload);
      toast("Commercial contract added", `${created.title} · ${created.company}`);
      onSaved?.(created);
    }
    onClose();
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Field label="Contract title" htmlFor={id("title")} error={errors.title} required>
        <Input id={id("title")} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Regional Courier Services" aria-invalid={!!errors.title} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company / Buyer" htmlFor={id("company")} error={errors.company} required>
          <Input id={id("company")} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. ABC Healthcare" aria-invalid={!!errors.company} />
        </Field>
        <Field label="Industry" htmlFor={id("industry")} error={errors.industry} required>
          <Input id={id("industry")} list={id("industries")} value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Healthcare / Logistics" aria-invalid={!!errors.industry} />
          <datalist id={id("industries")}>
            {industries.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Opportunity type" htmlFor={id("opportunityType")}>
          <Select id={id("opportunityType")} value={form.opportunityType} onChange={(e) => set("opportunityType", e.target.value as OpportunityType)}>
            {OPPORTUNITY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field
          label="Estimated value"
          htmlFor={id("value")}
          error={errors.value}
          hint={parsed ? `Reads as ${formatValueRange(parsed.min, parsed.max)}` : "A single amount or a range — leave blank if not disclosed"}
        >
          <Input id={id("value")} value={form.value} onChange={(e) => set("value", e.target.value)} placeholder="$250K - $400K" aria-invalid={!!errors.value} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location" htmlFor={id("location")} error={errors.location} required>
          <Input id={id("location")} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Las Vegas, NV" aria-invalid={!!errors.location} />
        </Field>
        <Field label="Response deadline" htmlFor={id("deadline")} error={errors.deadline} required>
          <Input id={id("deadline")} type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} aria-invalid={!!errors.deadline} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Source" htmlFor={id("source")}>
          <Select id={id("source")} value={form.source} onChange={(e) => set("source", e.target.value as SourceType)}>
            {SOURCE_TYPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Source URL" htmlFor={id("sourceUrl")} error={errors.sourceUrl} hint="Optional link to the portal or RFP">
          <Input id={id("sourceUrl")} type="url" inputMode="url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://" aria-invalid={!!errors.sourceUrl} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={`Fit score · ${form.fitScore}%`} htmlFor={id("fitScore")} hint="Your estimate of how well this matches your capabilities">
          <input
            id={id("fitScore")}
            type="range"
            min={0}
            max={100}
            step={1}
            value={form.fitScore}
            onChange={(e) => set("fitScore", Number(e.target.value))}
            className="mt-2 h-1.5 w-full cursor-pointer accent-[var(--accent)]"
          />
        </Field>
        <Field label="Status" htmlFor={id("status")}>
          <Select id={id("status")} value={form.status} onChange={(e) => set("status", e.target.value as ContractStatus)}>
            {CONTRACT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Description" htmlFor={id("description")} hint="Scope, buyer needs and anything notable about the opportunity">
        <Textarea id={id("description")} value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="What is the buyer looking for?" />
      </Field>

      <div className="sticky -bottom-5 -mx-5 mt-1 flex items-center justify-end gap-2 border-t border-line bg-surface px-5 py-3 sm:-mx-6 sm:px-6">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {contract ? "Save changes" : "Add Contract"}
        </Button>
      </div>
    </form>
  );
}
