export const CONTRACT_STATUSES = [
  "New",
  "Reviewing",
  "Qualified",
  "Preparing Proposal",
  "Submitted",
  "Negotiation",
  "Won",
  "Lost",
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

/** Stages shown on the pipeline board and overview (Lost is tracked but not a board column). */
export const PIPELINE_STAGES = [
  "New",
  "Reviewing",
  "Qualified",
  "Preparing Proposal",
  "Submitted",
  "Negotiation",
  "Won",
] as const satisfies readonly ContractStatus[];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const OPPORTUNITY_TYPES = [
  "RFP",
  "RFQ",
  "RFI",
  "Invitation to Bid",
  "Direct Opportunity",
  "Subcontract Opportunity",
  "Vendor Opportunity",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const SOURCE_TYPES = [
  "Company Website",
  "Vendor Portal",
  "Procurement Portal",
  "Direct RFP",
  "Email Invitation",
  "Partner Referral",
  "Prime Contractor",
  "Other",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export interface RequirementItem {
  id: string;
  label: string;
  done: boolean;
}

export interface CommercialContract {
  id: string;
  title: string;
  company: string;
  industry: string;
  opportunityType: OpportunityType;
  /** null when the buyer has not disclosed a value */
  valueMin: number | null;
  valueMax: number | null;
  location: string;
  /** ISO date (YYYY-MM-DD) */
  deadline: string;
  fitScore: number;
  source: SourceType;
  sourceUrl?: string;
  status: ContractStatus;
  description: string;
  fitReasons: string[];
  considerations: string[];
  requirements: RequirementItem[];
  /** ISO timestamp */
  createdAt: string;
  /** Seeded (researched) opportunities vs. contracts the user added in this browser. */
  isSeeded: boolean;
  /** Date (YYYY-MM-DD) the seeded opportunity was verified on its source page. */
  retrievedAt?: string;
  pursued?: boolean;
}

export type ContractInput = Omit<
  CommercialContract,
  "id" | "createdAt" | "isSeeded" | "requirements" | "fitReasons" | "considerations" | "pursued"
>;

export type ActivityKind =
  | "added"
  | "reviewed"
  | "status"
  | "proposal"
  | "checklist"
  | "submitted"
  | "pursued"
  | "edited"
  | "won"
  | "lost";

export interface ActivityEvent {
  id: string;
  contractId: string;
  kind: ActivityKind;
  message: string;
  /** ISO timestamp */
  at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  /** Full URL, or empty when unknown */
  website: string;
  headquarters: string;
  about: string;
  isSeeded: boolean;
}

export const DOCUMENT_CATEGORIES = [
  "RFP",
  "Proposal",
  "Pricing",
  "Compliance",
  "Supporting Document",
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export type DocumentStatus = "Received" | "Draft" | "In Review" | "Final" | "Pending";

export interface ContractDocument {
  id: string;
  name: string;
  fileType: "PDF" | "XLSX" | "DOCX";
  category: DocumentCategory;
  contractId: string;
  size?: string;
  /** Link to the published file on the buyer's site */
  url?: string;
  /** ISO date */
  updatedAt: string;
  status: DocumentStatus;
}
