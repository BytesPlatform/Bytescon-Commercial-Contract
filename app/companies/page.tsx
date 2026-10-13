import type { Metadata } from "next";
import { Suspense } from "react";
import { CompaniesPage as CompaniesContent } from "@/components/companies/companies-view";
import { ListSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = { title: "Companies" };

export default function CompaniesPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <CompaniesContent />
    </Suspense>
  );
}
