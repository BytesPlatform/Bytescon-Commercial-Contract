import type { CommercialContract, ContractStatus, OpportunityType, RequirementItem, SourceType } from "@/lib/types";

/**
 * REAL OPPORTUNITIES — researched from public procurement pages and verified on
 * each buyer's source page (and solicitation PDF where published) on RETRIEVED_AT.
 *
 * This is a snapshot, not a live feed: buyers may extend, amend or cancel
 * solicitations. Values are only filled in where the buyer states them.
 * `status` and `fitScore` are example tracking data for this workspace — they
 * are not information published by the buyer.
 */
export const RETRIEVED_AT = "2026-10-13";
const CREATED_AT = "2026-10-13T00:15:00";

export const STANDARD_REQUIREMENTS = [
  "Company Profile",
  "W-9",
  "Insurance Certificate",
  "Three Client References",
  "Pricing Sheet",
  "Technical Proposal",
  "Signed NDA",
];

export function buildChecklist(contractId: string, done: number[] = [], labels = STANDARD_REQUIREMENTS): RequirementItem[] {
  return labels.map((label, i) => ({ id: `${contractId}-req-${i + 1}`, label, done: done.includes(i) }));
}

interface Seed {
  id: string;
  title: string;
  company: string;
  industry: string;
  opportunityType: OpportunityType;
  valueMin?: number;
  valueMax?: number;
  location: string;
  deadline: string;
  source: SourceType;
  sourceUrl: string;
  description: string;
  /** Prep checklist: buyer-stated submission requirements where published, otherwise standard prep items. */
  requirements: string[];
  /** Notable conditions stated in the solicitation. */
  considerations: string[];
  status: ContractStatus;
  fitScore: number;
  done?: number[];
}

const seeds: Seed[] = [
  {
    id: "philaport-managed-it-services",
    title: "Managed Information Technology Services (RFP 26-118-S)",
    company: "Philadelphia Regional Port Authority",
    industry: "Port Authority / IT",
    opportunityType: "RFP",
    location: "Philadelphia, PA",
    deadline: "2026-10-28",
    source: "Company Website",
    sourceUrl: "https://www.philaport.com/procurement/",
    description:
      "PhilaPort is requesting proposals for managed information technology services under project 26-118-S. Proposals must be submitted electronically through PhilaPort's Bonfire project portal.",
    requirements: ["Register on the PhilaPort Bonfire project portal", "Review RFP 26-118-S documents on Bonfire", "Technical Proposal", "Pricing Sheet", "Submit electronically by Oct 28, 2026, 10:00 AM"],
    considerations: ["Electronic submission only, via the Bonfire portal", "Question period closed Oct 13, 2026"],
    status: "Qualified",
    fitScore: 86,
    done: [0],
  },
  {
    id: "mwaa-parking-shuttle-operations",
    title: "Parking Shuttle Bus Operations and Maintenance Services, DCA & IAD (RFP-26-22740)",
    company: "Metropolitan Washington Airports Authority",
    industry: "Airport / Transportation",
    opportunityType: "RFP",
    location: "Washington, DC",
    deadline: "2026-10-30",
    source: "Company Website",
    sourceUrl: "https://www.mwaa.com/business/current-contracting-opportunities",
    description:
      "The contractor will operate and manage the public and employee shuttle bus service and the shuttle bus maintenance concession at Reagan National (DCA) and Dulles International (IAD) airports. The solicitation was issued September 15, 2026, and one amendment has been issued.",
    requirements: STANDARD_REQUIREMENTS,
    considerations: ["One amendment issued — review before submitting", "Covers both operations and fleet maintenance at two airports"],
    status: "Reviewing",
    fitScore: 74,
  },
  {
    id: "nycdoe-payroll-managed-services",
    title: "Payroll Managed Services (RFP R1861)",
    company: "New York City Department of Education",
    industry: "Education / IT Managed Services",
    opportunityType: "RFP",
    location: "New York, NY",
    deadline: "2026-10-27",
    source: "Procurement Portal",
    sourceUrl:
      "https://infohub.nyced.org/in-our-schools/working-with-the-doe/contracts-and-purchasing/open-doe-solicitations/request-for-proposals",
    description:
      "On behalf of its Division of Instructional and Information Technology, NYCDOE is seeking organizations experienced in comprehensive managed services for large-scale payroll systems, supporting the implementation of a new payroll system.",
    requirements: [
      "Download RFP R1861 from the NYCDOE Vendor Portal",
      "Technical Proposal",
      "Pricing Sheet",
      "Submit proposal by Oct 27, 2026, 4:00 PM EST",
    ],
    considerations: ["RFP documents require a NYCDOE Vendor Portal login", "Questions by email only — phone calls not accepted"],
    status: "New",
    fitScore: 68,
  },
  {
    id: "indygo-security-services",
    title: "Security Services (RFP 26-05-586)",
    company: "IndyGo (Indianapolis Public Transportation Corporation)",
    industry: "Transit / Security",
    opportunityType: "RFP",
    location: "Indianapolis, IN",
    deadline: "2026-11-04",
    source: "Other",
    sourceUrl: "https://www.TransitTalent.com/procurement-rfp-26-05-586-security-services-181338",
    description:
      "IndyGo is requesting proposals from qualified security firms for mobile, front-office, fare inspection and walking patrol services across its service area. The RFP and statement of work are available after registering on IndyGo's Bonfire portal.",
    requirements: ["Register at indygo.bonfirehub.com", "Review RFP and Statement of Work", "Insurance Certificate", "Pricing Sheet", "Submit via Bonfire by Nov 4, 2026, 3:00 PM EST"],
    considerations: ["Answers to written questions posted Oct 15, 2026", "Listing verified on TransitTalent; full RFP is on IndyGo's Bonfire portal"],
    status: "Reviewing",
    fitScore: 79,
  },
  {
    id: "vctc-intercity-fixed-route",
    title: "VCTC Intercity Transit Regional Fixed Route Service (RFP 2627-001-FR)",
    company: "Ventura County Transportation Commission",
    industry: "Transit / Transportation & Fleet Maintenance",
    opportunityType: "RFP",
    location: "Camarillo, CA",
    deadline: "2026-12-04",
    source: "Company Website",
    sourceUrl: "https://www.goventura.org/rfp/intercity-transit-fixed-route-service/",
    description:
      "VCTC is seeking qualified firms to operate its VCTC Intercity Transit regional fixed-route bus service and maintain its fleet, starting May 4, 2027. The base term is five years and 57 days, with options for two two-year extensions.",
    requirements: [
      "Required Forms A–J (Exhibit 3), signed",
      "Company financials for the prior three years (sealed)",
      "Client list with contacts and work descriptions",
      "Evidence of 5+ years of comparable regional transit service",
      "Submit questions by Nov 10, 2026, 4:00 PM PT",
      "Sealed proposal by Dec 4, 2026, 1:00 PM PT",
    ],
    considerations: [
      "Minimum five years' experience with comparable regional transit service",
      "Missing Forms A–J makes the proposal non-responsive",
      "Optional pre-proposal meeting Oct 20, 2026",
    ],
    status: "New",
    fitScore: 72,
  },
  {
    id: "nuhealth-armed-unarmed-security",
    title: "Armed and Unarmed Security Services (RFP #016-2026)",
    company: "NuHealth (Nassau Health Care Corporation)",
    industry: "Healthcare / Security",
    opportunityType: "RFP",
    location: "East Meadow, NY",
    deadline: "2026-10-22",
    source: "Company Website",
    sourceUrl: "https://www.numc.edu/about/doing-business-with-nuhealth/",
    description:
      "NHCC is seeking a licensed, insured security vendor to supplement its in-house security force with armed and unarmed officers at designated facilities, including armed coverage of high-risk areas such as the Emergency Department. Unarmed staff will handle access control, visitor management, desk duty and patrol.",
    requirements: [
      "Five years of hospital or Level I trauma security experience",
      "Three professional references",
      "Regulatory and legal disclosures (10 years)",
      "Scope of services and work plan",
      "Fee and cost proposal",
      "MWBE Utilization Plan or waiver, plus disclosure forms",
      "Email to RFPSubmissions@numc.edu by 4:00 PM on Oct 22",
    ],
    considerations: ["Requires five years serving large healthcare networks or Level I trauma centers", "Must be able to scale staffing and provide training to NHCC staff"],
    status: "Preparing Proposal",
    fitScore: 84,
    done: [1, 2, 3],
  },
  {
    id: "nuhealth-ed-pocus-platform",
    title: "ED Point-of-Care Ultrasound Workflow Management Platform (RFP #015-2026)",
    company: "NuHealth (Nassau Health Care Corporation)",
    industry: "Healthcare / Software",
    opportunityType: "RFP",
    location: "East Meadow, NY",
    deadline: "2026-10-21",
    source: "Company Website",
    sourceUrl: "https://www.numc.edu/about/doing-business-with-nuhealth/",
    description:
      "NHCC is seeking a POCUS workflow management platform for the NUMC Emergency Department covering patient matching, ultrasound fleet connectivity, image archiving, structured reporting, QA, credentialing and resident education. It must integrate both ways with the EHR, PACS and billing systems.",
    requirements: [
      "Proposer information and ownership disclosure",
      "Three professional references",
      "Regulatory and legal disclosures",
      "Scope of services and work plan",
      "Fee and cost proposal",
      "Conflict of interest, MWBE and compliance forms",
      "Email to RFPSubmissions@numc.edu by 4:00 PM on Oct 21",
    ],
    considerations: ["Bidirectional EHR, PACS and billing integration required", "Short turnaround — due Oct 21"],
    status: "Reviewing",
    fitScore: 70,
  },
  {
    id: "chcs-lawn-maintenance",
    title: "Lawn Maintenance Services (RFB-2027-002)",
    company: "The Center for Health Care Services",
    industry: "Healthcare / Facilities Maintenance",
    opportunityType: "Invitation to Bid",
    location: "San Antonio, TX",
    deadline: "2026-10-23",
    source: "Company Website",
    sourceUrl: "https://chcsbc.org/contracting-opportunities/",
    description:
      "CHCS, the Local Mental Health Authority for Bexar County, is requesting bids for grounds and lawn maintenance (mowing, edging, trimming, weeding and litter pickup) at its San Antonio facilities. Service is twice monthly from March through November, with an anticipated three-year term and two optional one-year renewals.",
    requirements: [
      "Executive summary",
      "General Information Form (Attachment A)",
      "Pricing Schedule (Attachment B)",
      "Current insurance certificate",
      "Signature Page and Conflict of Interest Statement (C, D)",
      "Bid Checklist (Attachment E)",
      "Signed original + 5 copies + USB, hand-delivered by 12:00 PM Oct 23",
    ],
    considerations: ["No email or fax submissions — physical delivery only", "Twice-monthly service, March through November"],
    status: "Qualified",
    fitScore: 81,
    done: [0, 3],
  },
  {
    id: "nachc-lms-change-management",
    title: "Organizational Change Management Consultant for LMS Implementation",
    company: "National Association of Community Health Centers",
    industry: "Healthcare Association / Learning Technology",
    opportunityType: "RFP",
    valueMax: 90_000,
    location: "Bethesda, MD",
    deadline: "2026-10-30",
    source: "Company Website",
    sourceUrl: "https://www.nachc.org/procurement-opportunities/",
    description:
      "NACHC wants an organizational change management partner to guide its move to a new learning management system scheduled to go live in summer 2027. The work covers learning and pricing governance, workflows, staff readiness, communications and coordination with the LMS vendor, from December 2026 to June 2027.",
    requirements: [
      "Proposal narrative and work plan (up to 6 pages)",
      "Capability statement (up to 3 pages)",
      "2–3 comparable engagements, work samples and client references",
      "Timeline with phases, milestones and deliverables",
      "Budget on the Appendix A template",
      "Signed attestation statement",
      "Submit PDF via NACHC portal by Oct 30, 5:00 PM ET",
    ],
    considerations: ["Budget up to $90,000 for seven months", "At least one team member needs LMS implementation experience"],
    status: "Preparing Proposal",
    fitScore: 88,
    done: [1, 2],
  },
  {
    id: "grady-ob-ultrasound-interpretation",
    title: "Remote Limited Obstetric Ultrasound Interpretation Services (RFP #26008TM)",
    company: "Grady Health System",
    industry: "Healthcare / Clinical Services",
    opportunityType: "RFP",
    location: "Atlanta, GA",
    deadline: "2026-11-18",
    source: "Company Website",
    sourceUrl: "https://www.gradyhealth.org/suppliers/",
    description:
      "Grady Health System is seeking remote professional interpretation and final reports for limited first- and second-trimester OB ultrasound studies, read by board-certified radiologists within one hour. The supplier must communicate critical findings promptly and integrate securely with Grady's clinical and imaging systems.",
    requirements: [
      "Organization history, locations and financial position",
      "Ownership, parent company and authorized negotiator",
      "Relationship and litigation disclosures",
      "Three references of similar size and scope",
      "Appendices A, B and C signed by an officer",
      "Email by Nov 18, 2026, 2:00 PM EST",
    ],
    considerations: ["One-hour interpretation turnaround required", "Board-certified radiologists only"],
    status: "New",
    fitScore: 62,
  },
  {
    id: "icma-strategic-technology-partner",
    title: "Strategic Technology Partner — IT Assessment & Roadmap",
    company: "International City/County Management Association",
    industry: "Nonprofit Association / IT Consulting",
    opportunityType: "RFP",
    location: "Washington, DC",
    deadline: "2026-11-02",
    source: "Company Website",
    sourceUrl: "https://icma.org/requests-for-proposals",
    description:
      "ICMA wants a strategic technology partner to assess its systems and build an integrated IT strategy and roadmap across its AMS, LMS, website, e-commerce and Microsoft 365. The firm would also write bid specifications, provide owner-side project management and advise on AI governance and data security; ICMA is not seeking a software implementer.",
    requirements: [
      "Firm overview and association-industry experience",
      "Project team with bios and certifications",
      "Methodology (discovery, roadmap, procurement support)",
      "AI governance, security and data quality approach",
      "Fee structure",
      "Three association client references",
      "Signed transmittal letter and vendor forms (max 8 pages)",
    ],
    considerations: ["Advisory only — implementers are not being sought", "Proposal limited to 8 single-spaced pages"],
    status: "Qualified",
    fitScore: 90,
    done: [0],
  },
  {
    id: "canadian-club-ottawa-website",
    title: "Website Redesign",
    company: "Canadian Club of Ottawa",
    industry: "Nonprofit / Web Design & Development",
    opportunityType: "RFP",
    location: "Ottawa, ON",
    deadline: "2026-10-21",
    source: "Company Website",
    sourceUrl: "https://canadianclubottawa.ca/blogs/news/request-for-proposals-website-redesign-for-the-canadian-club-of-ottawa",
    description:
      "The Canadian Club of Ottawa, a non-partisan forum founded in 1903, wants its website redesigned around a refreshed brand on a CMS staff can update without a developer. Scope includes core pages, event listings with registration links, responsive design, content migration and basic SEO and analytics.",
    requirements: [
      "Professional profile",
      "Portfolio of comparable websites",
      "Approach, process and recommended CMS",
      "Timeline from planning to launch",
      "Itemized fixed price",
      "Assumptions, recurring and optional fees",
      "Two references",
    ],
    considerations: ["Fixed-price proposal expected", "Electronic submission by 11:59 PM on Oct 21"],
    status: "Preparing Proposal",
    fitScore: 92,
    done: [0, 1, 6],
  },
  {
    id: "carfac-alberta-brand-design",
    title: "Graphic Designer / Brand Development",
    company: "CARFAC Alberta",
    industry: "Arts Association / Graphic Design",
    opportunityType: "RFP",
    location: "Edmonton, AB",
    deadline: "2026-10-30",
    source: "Company Website",
    sourceUrl: "https://carfacalberta.com/news/request-for-proposal-graphic-designer/",
    description:
      "CARFAC Alberta wants a graphic designer to create a brand kit and style guide for staff and future designers. Deliverables include reusable digital and print elements, a font, a colour-code sheet, and source files and templates with clear licensing.",
    requirements: [
      "Introduction and relevant experience",
      "Branding / visual identity portfolio",
      "Proposed approach to the brand kit",
      "Description of deliverables",
      "Estimated timeline",
      "Rate or project fee, including licensing costs",
      "Email to communications@carfacalberta.com",
    ],
    considerations: ["Licensing terms for fonts and assets must be clear"],
    status: "New",
    fitScore: 77,
  },
  {
    id: "ci-tubbataha-validation-verification",
    title: "Validation & Verification — Tubbataha Reefs Conservation Certificates (RFP NF-05-2026)",
    company: "Conservation International",
    industry: "Nonprofit / Environmental Verification",
    opportunityType: "RFP",
    valueMin: 60_000,
    valueMax: 80_000,
    location: "Puerto Princesa, Philippines",
    deadline: "2026-11-04",
    source: "Procurement Portal",
    sourceUrl: "https://www.conservation.org/rfp/validation-and-verification-services-for-tubbataha-reefs-conservation-certificates-project",
    description:
      "Conservation International is seeking an independent auditor to validate and verify the Tubbataha Reefs Conservation Certificates project. Validation tests the design against high-level principles for biodiversity credit markets; verification assesses 2026–2027 outcomes using the Accounting for Nature coral reef method.",
    requirements: [
      "Accounting for Nature verifier accreditation",
      "Key personnel with 10+ years in relevant fields",
      "Prior experience in the Philippines",
      "Technical proposal with staffing plan and CVs",
      "Three client references",
      "Fixed-price USD cost proposal incl. field travel",
      "Signed Offeror Representation and AFD Statement of Integrity",
    ],
    considerations: ["Budget range US$60,000 – $80,000", "Requires Accounting for Nature accreditation"],
    status: "New",
    fitScore: 58,
  },
  {
    id: "hacp-painting-units",
    title: "Painting of Units and Common Areas (IFB #250-29-26)",
    company: "Housing Authority of the City of Pittsburgh",
    industry: "Housing / Property Maintenance",
    opportunityType: "Invitation to Bid",
    location: "Pittsburgh, PA",
    deadline: "2026-10-20",
    source: "Procurement Portal",
    sourceUrl: "https://hacp.org/procurements/painting-of-units-and-common-areas-for-asset-management-2/",
    description:
      "HACP, a public housing agency with more than 2,500 rental units, is taking sealed bids for painting units and common areas plus related requested work. The contract runs one year with two one-year extension options.",
    requirements: [
      "Bid Sheet (Attachment 1) per Specifications (Attachment 2)",
      "Acknowledge Addenda #1–#4",
      "Wage & fringe benefit sheet (Attachment 19)",
      "Name online uploads “IFB #250-29-26_Bid”",
      "Sealed bid by 10:00 AM on Oct 20",
    ],
    considerations: ["Prevailing maintenance wage rates apply", "Due Oct 20 — very short window"],
    status: "Reviewing",
    fitScore: 83,
  },
  {
    id: "seattle-housing-janitorial",
    title: "On-Call Janitorial Services (RFP 5929)",
    company: "Seattle Housing Authority",
    industry: "Housing / Janitorial",
    opportunityType: "RFP",
    location: "Seattle, WA",
    deadline: "2026-10-20",
    source: "Procurement Portal",
    sourceUrl: "https://www.seattlehousing.org/do-business-with-us/solicitations/call-janitorial-services",
    description:
      "Seattle Housing Authority is seeking janitorial services for 28 residential and commercial properties. Addendum 3 extended the deadline to 4 PM on October 20, 2026, and requires the contractor to supply cleaning products, equipment and supplies.",
    requirements: [
      "Exhibit B Pricing Table (Rev1, Addendum 3)",
      "Vendor Fact Sheet",
      "Suspension & Debarment Certificate",
      "HUD Section 3 forms",
      "Acknowledge all addenda",
      "Email to hiba.hasan@seattlehousing.org by 4 PM Oct 20",
    ],
    considerations: ["HUD and WA State / King County prevailing wages apply", "Products limited to Addendum 3 Exhibit C list unless approved"],
    status: "Preparing Proposal",
    fitScore: 87,
    done: [1, 2, 4],
  },
  {
    id: "somerville-ha-oncall-hvac",
    title: "On-Call AC / HVAC Services (IFB P-HVAC102026)",
    company: "Somerville Housing Authority",
    industry: "Housing / HVAC",
    opportunityType: "Invitation to Bid",
    valueMin: 65_000,
    valueMax: 195_000,
    location: "Somerville, MA",
    deadline: "2026-10-23",
    source: "Procurement Portal",
    sourceUrl: "https://www.sha-web.org/bids.aspx",
    description:
      "Somerville Housing Authority is taking sealed bids for on-call HVAC labor, materials and equipment for routine and emergency maintenance. The term is one year with two one-year options under M.G.L. c.30B, with Davis-Bacon and state prevailing wages.",
    requirements: [
      "General Bid form (pricing) and references",
      "Non-Collusive Affidavit",
      "Certificate of Tax Compliance and W-9",
      "Certificate of Corporate Vote",
      "HUD 5369-A and Section 3 forms",
      "Four sealed copies by 2:00 PM Oct 23",
    ],
    considerations: ["Estimated $65,000 per year, $195,000 with all options", "No electronic or faxed bids"],
    status: "Qualified",
    fitScore: 80,
    done: [3],
  },
  {
    id: "lowell-ha-hvac-equipment",
    title: "HVAC Equipment Maintenance & Repair Services (IFB 2026-25)",
    company: "Lowell Housing Authority",
    industry: "Housing / HVAC",
    opportunityType: "Invitation to Bid",
    location: "Lowell, MA",
    deadline: "2026-10-30",
    source: "Procurement Portal",
    sourceUrl: "https://www.lhma.org/bids.aspx?bidID=87",
    description:
      "Lowell Housing Authority is seeking bids to remove, replace, install, test and commission boilers, domestic water heaters and hot water storage tanks at its properties, including all labor, materials, permits and testing.",
    requirements: ["Complete the online Plan Holders Form", "Download bid documents", "Insurance Certificate", "Pricing Sheet", "Submit bid by 11:00 AM Oct 30"],
    considerations: ["Bid documents available only after registering as a plan holder"],
    status: "New",
    fitScore: 73,
  },
  {
    id: "jcha-fire-alarm-maintenance",
    title: "Fire Alarm Inspection, Maintenance & Repair — All Developments",
    company: "Jersey City Housing Authority",
    industry: "Housing / Life Safety",
    opportunityType: "Invitation to Bid",
    location: "Jersey City, NJ",
    deadline: "2026-10-21",
    source: "Procurement Portal",
    sourceUrl: "https://www.jerseycityha.org/doing-business-with-us",
    description:
      "Jersey City Housing Authority is taking sealed bids for fire alarm inspection, maintenance and repair at all of its developments. The term is two years with two optional one-year extensions.",
    requirements: [
      "NJ Business Registration Certificate",
      "Bid page and specification sheets",
      "Non-Collusive and Ownership Affidavits",
      "Bidder's Qualifications",
      "MBE affidavit and Statement of Compliance",
      "Sealed bid by 11:00 AM Oct 21",
    ],
    considerations: ["NJ Business Registration Certificate is mandatory", "No bid bond required"],
    status: "Reviewing",
    fitScore: 76,
  },
];

export const commercialContracts: CommercialContract[] = seeds.map((s) => ({
  id: s.id,
  title: s.title,
  company: s.company,
  industry: s.industry,
  opportunityType: s.opportunityType,
  valueMin: s.valueMin ?? null,
  valueMax: s.valueMax ?? null,
  location: s.location,
  deadline: s.deadline,
  fitScore: s.fitScore,
  source: s.source,
  sourceUrl: s.sourceUrl,
  status: s.status,
  description: s.description,
  fitReasons: [],
  considerations: s.considerations,
  requirements: buildChecklist(s.id, s.done, s.requirements),
  createdAt: CREATED_AT,
  isSeeded: true,
  retrievedAt: RETRIEVED_AT,
}));

export function getSeedContract(id: string) {
  return commercialContracts.find((c) => c.id === id);
}
