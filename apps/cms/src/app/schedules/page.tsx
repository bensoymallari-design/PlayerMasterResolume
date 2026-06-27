import { FeaturePage } from "@/components/feature-page";

export default function SchedulesPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Scheduling"
      description="Assign published playlists to screens using time windows, days of week, date ranges, priority ordering, and emergency override rules."
      features={[
        "Daily schedule windows",
        "Weekly schedule windows",
        "Date range campaigns",
        "Priority-based conflict resolution",
        "Emergency override lane",
        "Realtime content update broadcasts"
      ]}
    />
  );
}
