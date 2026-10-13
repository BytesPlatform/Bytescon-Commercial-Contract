import { ArrowLeft, Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={<Compass />}
        title="Page not found"
        description="The page you’re looking for doesn’t exist in this workspace."
        action={
          <ButtonLink href="/dashboard" variant="secondary">
            <ArrowLeft /> Back to dashboard
          </ButtonLink>
        }
      />
    </Card>
  );
}
