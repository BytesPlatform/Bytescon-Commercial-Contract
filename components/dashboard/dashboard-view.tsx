"use client";

import { KanbanSquare, Plus } from "lucide-react";
import { useState } from "react";
import { ContractFormPanel } from "@/components/contracts/contract-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { KpiCards } from "./kpi-cards";
import { PipelineOverview } from "./pipeline-overview";
import { RecentActivity } from "./recent-activity";
import { RecommendedOpportunities } from "./recommended-opportunities";
import { UpcomingDeadlines } from "./upcoming-deadlines";

export function DashboardView() {
  const [adding, setAdding] = useState(false);
  return (
    <>
      <PageHeader
        title="Welcome back, Jordan"
        description="Here’s where your commercial contract pipeline stands today."
        actions={
          <>
            <ButtonLink href="/pipeline" variant="secondary">
              <KanbanSquare /> View pipeline
            </ButtonLink>
            <Button variant="primary" onClick={() => setAdding(true)}>
              <Plus /> Add Contract
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-4 sm:gap-6">
        <KpiCards />
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <PipelineOverview />
          </div>
          <div className="xl:col-span-2">
            <UpcomingDeadlines />
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <RecommendedOpportunities />
          </div>
          <div className="xl:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </div>
      <ContractFormPanel open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
