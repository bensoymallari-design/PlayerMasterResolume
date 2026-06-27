import { FeaturePage } from "@/components/feature-page";

export default function LayoutsPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Zone Layout Engine"
      description="Design reusable screen templates with drag-resizable zones for video, image, clock, weather, ticker, website, text, and HTML content."
      features={[
        "Video and image zones",
        "Clock, weather, and news ticker zones",
        "Website and local HTML widget zones",
        "Percentage-based x/y/width/height geometry",
        "Reusable layout templates",
        "Prepared for multi-monitor and synchronized layouts"
      ]}
    />
  );
}
