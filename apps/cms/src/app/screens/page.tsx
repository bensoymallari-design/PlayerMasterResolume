import { FeaturePage } from "@/components/feature-page";

export default function ScreensPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Screen Management"
      description="Register players, monitor online/offline state, inspect current content, review heartbeats, and dispatch remote commands."
      features={[
        "Registration codes for player onboarding",
        "Online, offline, and degraded states",
        "Last heartbeat and current content",
        "CPU, RAM, disk, app, and OS telemetry",
        "Screenshot preview field",
        "Restart, refresh, reboot, clear cache, screenshot, and playlist commands"
      ]}
    />
  );
}
