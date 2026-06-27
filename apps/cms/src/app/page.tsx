import { DashboardShell } from "@/components/dashboard-shell";
import { StatusCard } from "@/components/status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflow = ["Upload Media", "Create Playlist", "Assign Playlist", "Publish", "Player Sync"];

export default function DashboardPage(): React.ReactElement {
  return (
    <DashboardShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard label="Online screens" value="0" detail="Awaiting player registrations" tone="green" />
        <StatusCard label="Offline screens" value="0" detail="Heartbeat threshold: 90 seconds" tone="red" />
        <StatusCard label="Published playlists" value="0" detail="Ready for scheduling" />
        <StatusCard label="Emergency overrides" value="0" detail="Highest priority schedule lane" tone="purple" />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Digital signage workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step} className="rounded-xl border bg-background/60 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future-ready modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>AI analytics, audience detection, face counting, motion detection</p>
            <p>Touch screens, NDI, Spout, Colorlight controllers</p>
            <p>Multi-screen synchronization, SaaS licensing, cloud deployment</p>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
