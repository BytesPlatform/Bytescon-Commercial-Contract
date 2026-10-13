import type { Metadata } from "next";
import { Suspense } from "react";
import { OpportunitiesPage } from "@/components/contracts/opportunities-view";
import { ListSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = { title: "Commercial Opportunities" };

export default function CommercialOpportunitiesPage() {
  // Filters can be pre-set from the URL (?q=, ?status=), which is request-time data.
  return (
    <Suspense fallback={<ListSkeleton />}>
      <OpportunitiesPage />
    </Suspense>
  );
}
