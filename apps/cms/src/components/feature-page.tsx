import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturePage({
  title,
  description,
  features
}: {
  title: string;
  description: string;
  features: string[];
}): React.ReactElement {
  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 max-w-3xl text-muted-foreground">{description}</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-xl border bg-background/60 p-4 text-sm">
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
