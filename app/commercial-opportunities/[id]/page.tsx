import type { Metadata } from "next";
import { Suspense } from "react";
import { ContractDetail, DetailSkeleton } from "@/components/contracts/contract-detail";
import { commercialContracts } from "@/data/commercial-contracts";

export const metadata: Metadata = { title: "Opportunity Details" };

/** Seeded opportunities are prerendered; contracts added in the browser resolve client-side. */
export function generateStaticParams() {
  return commercialContracts.map((c) => ({ id: c.id }));
}

export default function ContractDetailPage() {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ContractDetail />
    </Suspense>
  );
}
