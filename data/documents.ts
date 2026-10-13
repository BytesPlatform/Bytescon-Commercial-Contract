import type { ContractDocument } from "@/lib/types";

/**
 * Solicitation files published by buyers, linked at their original location.
 * Nothing is stored in this app; `updatedAt` is the date the link was verified.
 */
const R = "2026-10-13";

export const documents: ContractDocument[] = [
  { id: "doc-vctc-rfp", name: "RFP 2627-001-FR Intercity Transit Fixed Route Service.pdf", fileType: "PDF", category: "RFP", contractId: "vctc-intercity-fixed-route", url: "https://www.goventura.org/wp-content/uploads/2026/10/RFP-2627-001-FR-VCTC-Intercity-Transit-Regional-Fixed-Route-Service.pdf", updatedAt: R, status: "Received" },
  { id: "doc-nuhealth-016", name: "RFP-016-2026 Armed and Unarmed Security Services.pdf", fileType: "PDF", category: "RFP", contractId: "nuhealth-armed-unarmed-security", url: "https://www.numc.edu/wp-content/uploads/2026/10/RFP-016-2026-Armed-and-Unarmed-Security-Services_vF.pdf", updatedAt: R, status: "Received" },
  { id: "doc-nuhealth-015", name: "RFP-015-2026 ED POCUS Workflow Management Platform.pdf", fileType: "PDF", category: "RFP", contractId: "nuhealth-ed-pocus-platform", url: "https://www.numc.edu/wp-content/uploads/2026/10/RFP-015-2026-Emergency-Department-Point-of-Care-Ultrasound-POCUS-Workflow-Management-Platform_vF.pdf", updatedAt: R, status: "Received" },
  { id: "doc-chcs-rfb", name: "RFB-2027-002 Lawn Maintenance Services.pdf", fileType: "PDF", category: "RFP", contractId: "chcs-lawn-maintenance", url: "https://chcsbc.org/wp-content/uploads/2026/09/RFB-2027-002-Lawn-Maintenance-Services.pdf", updatedAt: R, status: "Received" },
  { id: "doc-nachc-rfp", name: "NACHC LMS Change Management RFP.pdf", fileType: "PDF", category: "RFP", contractId: "nachc-lms-change-management", url: "https://www.nachc.org/wp-content/uploads/2026/10/nachc-lms-change-management-rfp_final.pdf", updatedAt: R, status: "Received" },
  { id: "doc-grady-rfp", name: "RFP26008TM Remote Limited OB Ultrasound Interpretation.pdf", fileType: "PDF", category: "RFP", contractId: "grady-ob-ultrasound-interpretation", url: "https://www.gradyhealth.org/wp-content/uploads/RFP26008TM-Remove-Limited-Obstetric-Ultrasound-Interpretation-Services-Due-November-18-2026.pdf", updatedAt: R, status: "Received" },
  { id: "doc-icma-rfp", name: "ICMA IT Consultant RFP.pdf", fileType: "PDF", category: "RFP", contractId: "icma-strategic-technology-partner", url: "https://icma.org/sites/default/files/2026-10/ICMA_IT_Consultant_RFP_092026.pdf", updatedAt: R, status: "Received" },
  { id: "doc-ci-rfp", name: "RFP NF-05-2026 Validation and Verification Services.pdf", fileType: "PDF", category: "RFP", contractId: "ci-tubbataha-validation-verification", url: "https://cdn.sanity.io/files/71jmx9y3/production/4621b9c3ad6b63a1a49447cea804b50caece0ac8.pdf", updatedAt: R, status: "Received" },
  { id: "doc-ci-clar", name: "NF-05-2026 Clarifications.pdf", fileType: "PDF", category: "Supporting Document", contractId: "ci-tubbataha-validation-verification", url: "https://cdn.sanity.io/media-libraries/mlmEWUxEY7eQ/files/containers/3KTAm9kdjazAmZVeQPOYeLFyGzg/nf-05-2026-clarifications.pdf", updatedAt: R, status: "Received" },
  { id: "doc-hacp-ifb", name: "IFB 250-29-26 Painting of Units and Common Areas.pdf", fileType: "PDF", category: "RFP", contractId: "hacp-painting-units", url: "https://hacp.org/app/uploads/2026/08/IFB-250-29-26-Painting-of-Units-and-Common-Areas-for-Asset-Management.pdf", updatedAt: R, status: "Received" },
  { id: "doc-hacp-add4", name: "Addendum 4 — IFB 250-29-26.pdf", fileType: "PDF", category: "Supporting Document", contractId: "hacp-painting-units", url: "https://hacp.org/app/uploads/2026/08/Addendum-4-IFB-250-29-26-Painting-of-Units-and-Common-Areas-for-Asset-Management.pdf", updatedAt: R, status: "Received" },
  { id: "doc-hacp-att19", name: "Attachment 19 — Maintenance Wage & Fringe Benefit Sheet.pdf", fileType: "PDF", category: "Compliance", contractId: "hacp-painting-units", url: "https://hacp.org/app/uploads/2026/08/Attachment-19_Supplemental-Maintenance-Wage-Fringe-Benefit-Sheet.pdf", updatedAt: R, status: "Received" },
  { id: "doc-sha-rfp", name: "RFP 5929 On-Call Janitorial Services.pdf", fileType: "PDF", category: "RFP", contractId: "seattle-housing-janitorial", url: "https://www.seattlehousing.org/sites/default/files/RFP%205929%20On-Call%20Janitorial%20Services.pdf", updatedAt: R, status: "Received" },
  { id: "doc-sha-add1", name: "RFP 5929 Addendum 1.pdf", fileType: "PDF", category: "Supporting Document", contractId: "seattle-housing-janitorial", url: "https://www.seattlehousing.org/sites/default/files/5929%20Addendum%201%2009212026.pdf", updatedAt: R, status: "Received" },
  { id: "doc-sha-add2", name: "RFP 5929 Addendum 2.pdf", fileType: "PDF", category: "Supporting Document", contractId: "seattle-housing-janitorial", url: "https://www.seattlehousing.org/sites/default/files/5929%20Addendum%202%2009292026.pdf", updatedAt: R, status: "Received" },
  { id: "doc-sha-add3", name: "RFP 5929 Addendum 3 (deadline extension, pricing Rev1).pdf", fileType: "PDF", category: "Pricing", contractId: "seattle-housing-janitorial", url: "https://www.seattlehousing.org/sites/default/files/5929%20Addendum%203%2010062026.pdf", updatedAt: R, status: "Received" },
  { id: "doc-jcha-bid", name: "Fire Alarm Inspection, Maintenance & Repair — Bid Package.pdf", fileType: "PDF", category: "RFP", contractId: "jcha-fire-alarm-maintenance", url: "https://www.jerseycityha.org/_files/ugd/e9e5c0_90f78c00a3c2439bbdc03b1de7933c6c.pdf", updatedAt: R, status: "Received" },
];

export function documentsForContract(contractId: string) {
  return documents.filter((d) => d.contractId === contractId);
}
