"use client";

import { useMemo, useSyncExternalStore } from "react";
import { commercialContracts, buildChecklist, STANDARD_REQUIREMENTS } from "@/data/commercial-contracts";
import { seedActivity } from "@/data/activity";
import { companies as seedCompanies } from "@/data/companies";
import type { ActivityEvent, CommercialContract, Company, ContractInput, ContractStatus } from "./types";
import { contractMidpoint, isOpen, slugify } from "./utilities";

/**
 * Frontend-only persistence. Seeded demo data is static; everything the user
 * does in the browser (added contracts, edits, checklist ticks, activity) is
 * layered on top and saved to localStorage.
 */
interface PersistedState {
  added: CommercialContract[];
  overrides: Record<string, Partial<CommercialContract>>;
  checklist: Record<string, Record<string, boolean>>;
  activity: ActivityEvent[];
}

const STORAGE_KEY = "clearbid.workspace.v1";
const EMPTY: PersistedState = { added: [], overrides: {}, checklist: {}, activity: [] };

let state: PersistedState | null = null;
const listeners = new Set<() => void>();

function read(): PersistedState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<PersistedState>) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  return state;
}

function write(updater: (s: PersistedState) => PersistedState) {
  state = updater(read());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode); state still lives in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;

function usePersisted() {
  return useSyncExternalStore(subscribe, read, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once running on the client. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const CLIENT_NOW = typeof window === "undefined" ? 0 : Date.now();
/** Current time on the client; null while prerendering so date math never causes hydration mismatches. */
export function useNow(): number | null {
  return useSyncExternalStore(noopSubscribe, () => CLIENT_NOW, () => null);
}

/* ------------------------------------------------------------------ */
/* Derived data                                                        */
/* ------------------------------------------------------------------ */

function applyState(s: PersistedState): CommercialContract[] {
  const all = [...s.added, ...commercialContracts].map((c) => {
    const merged = { ...c, ...s.overrides[c.id] };
    const ticks = s.checklist[c.id];
    if (ticks) {
      merged.requirements = merged.requirements.map((r) => (r.id in ticks ? { ...r, done: ticks[r.id] } : r));
    }
    return merged;
  });
  return all;
}

export function useContracts() {
  const s = usePersisted();
  return useMemo(() => applyState(s), [s]);
}

export function useContract(id: string | undefined) {
  const contracts = useContracts();
  return useMemo(() => contracts.find((c) => c.id === id), [contracts, id]);
}

export function useActivity(contractId?: string) {
  const s = usePersisted();
  const contracts = useContracts();
  return useMemo(() => {
    const seeded = contracts.filter((c) => c.isSeeded && (!contractId || c.id === contractId)).flatMap((c) => {
      // Seeded timelines reflect the original seed status, not later edits.
      const original = commercialContracts.find((o) => o.id === c.id) ?? c;
      return seedActivity(original);
    });
    const user = s.activity.filter((e) => !contractId || e.contractId === contractId);
    return [...user, ...seeded].sort((a, b) => b.at.localeCompare(a.at));
  }, [s.activity, contracts, contractId]);
}

export interface CompanySummary extends Company {
  opportunities: CommercialContract[];
  openCount: number;
  pipelineValue: number;
}

export function useCompanies(): CompanySummary[] {
  const contracts = useContracts();
  return useMemo(() => {
    const list: Company[] = [...seedCompanies];
    for (const c of contracts) {
      if (!list.some((co) => co.name.toLowerCase() === c.company.toLowerCase())) {
        list.push({
          id: `co-${slugify(c.company)}`,
          name: c.company,
          industry: c.industry.split("/")[0]!.trim(),
          website: "",
          headquarters: c.location,
          about: "Added from a commercial contract you created in this browser.",
          isSeeded: false,
        });
      }
    }
    return list
      .map((co) => {
        const opportunities = contracts.filter((c) => c.company.toLowerCase() === co.name.toLowerCase());
        const open = opportunities.filter(isOpen);
        return {
          ...co,
          opportunities,
          openCount: open.length,
          pipelineValue: open.reduce((sum, c) => sum + contractMidpoint(c), 0),
        };
      })
      .sort((a, b) => b.pipelineValue - a.pipelineValue);
  }, [contracts]);
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function event(contractId: string, kind: ActivityEvent["kind"], message: string): ActivityEvent {
  return {
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    contractId,
    kind,
    message,
    at: new Date().toISOString(),
  };
}

function current(id: string) {
  return applyState(read()).find((c) => c.id === id);
}

export function addContract(input: ContractInput): CommercialContract {
  const id = `${slugify(input.title) || "contract"}-${Math.random().toString(36).slice(2, 6)}`;
  const contract: CommercialContract = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    isSeeded: false,
    fitReasons: [],
    considerations: [],
    requirements: buildChecklist(id, [], STANDARD_REQUIREMENTS),
  };
  write((s) => ({
    ...s,
    added: [contract, ...s.added],
    activity: [event(id, "added", `Opportunity added manually from ${input.source}`), ...s.activity],
  }));
  return contract;
}

export function updateContract(id: string, patch: Partial<CommercialContract>) {
  const before = current(id);
  if (!before) return;
  const statusChanged = patch.status && patch.status !== before.status;
  const otherChanges = Object.keys(patch).some(
    (k) => k !== "status" && JSON.stringify(patch[k as keyof CommercialContract]) !== JSON.stringify(before[k as keyof CommercialContract]),
  );
  const newEvents: ActivityEvent[] = [];
  if (otherChanges) newEvents.push(event(id, "edited", "Opportunity details edited"));
  if (statusChanged) {
    const kind = patch.status === "Won" ? "won" : patch.status === "Lost" ? "lost" : "status";
    newEvents.push(event(id, kind, `Status changed from ${before.status} to ${patch.status}`));
  }
  write((s) => {
    const isAdded = s.added.some((c) => c.id === id);
    return {
      ...s,
      added: isAdded ? s.added.map((c) => (c.id === id ? { ...c, ...patch } : c)) : s.added,
      overrides: isAdded ? s.overrides : { ...s.overrides, [id]: { ...s.overrides[id], ...patch } },
      activity: [...newEvents.reverse(), ...s.activity],
    };
  });
}

export function setStatus(id: string, status: ContractStatus) {
  updateContract(id, { status });
}

export function togglePursued(id: string) {
  const c = current(id);
  if (!c) return;
  const pursued = !c.pursued;
  write((s) => {
    const isAdded = s.added.some((x) => x.id === id);
    return {
      ...s,
      added: isAdded ? s.added.map((x) => (x.id === id ? { ...x, pursued } : x)) : s.added,
      overrides: isAdded ? s.overrides : { ...s.overrides, [id]: { ...s.overrides[id], pursued } },
      activity: [event(id, "pursued", pursued ? "Marked as pursued" : "Removed pursuit flag"), ...s.activity],
    };
  });
}

export function toggleRequirement(contractId: string, requirementId: string, done: boolean) {
  const label = current(contractId)?.requirements.find((r) => r.id === requirementId)?.label ?? "Requirement";
  write((s) => ({
    ...s,
    checklist: { ...s.checklist, [contractId]: { ...s.checklist[contractId], [requirementId]: done } },
    activity: [
      event(contractId, "checklist", `Document checklist updated — ${label} ${done ? "completed" : "reopened"}`),
      ...s.activity,
    ],
  }));
}

export function deleteContract(id: string) {
  write((s) => ({
    ...s,
    added: s.added.filter((c) => c.id !== id),
    activity: s.activity.filter((e) => e.contractId !== id),
    checklist: Object.fromEntries(Object.entries(s.checklist).filter(([k]) => k !== id)),
  }));
}

export function resetWorkspace() {
  write(() => EMPTY);
}

export function useWorkspaceStats() {
  const s = usePersisted();
  return {
    addedCount: s.added.length,
    editedCount: Object.keys(s.overrides).length,
    activityCount: s.activity.length,
  };
}
