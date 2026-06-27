import { FeaturePage } from "@/components/feature-page";

export default function WidgetsPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Widget Engine"
      description="Configure built-in signage widgets that can be embedded into layout zones and synchronized to players."
      features={[
        "Analog and digital clock widgets",
        "Open-Meteo current weather and forecast widgets",
        "RSS-backed auto-scrolling news ticker",
        "Text announcements and emergency messages",
        "JSON configuration per widget",
        "Extensible renderer contract for player zones"
      ]}
    />
  );
}
