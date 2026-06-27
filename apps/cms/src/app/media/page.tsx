import { FeaturePage } from "@/components/feature-page";

export default function MediaPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Media Library"
      description="Upload, preview, categorize, tag, search, and delete all content types used by signage players."
      features={[
        "MP4 video upload with checksum storage",
        "PNG, JPG, WEBP, and GIF support",
        "Local HTML widgets and external website entries",
        "YouTube, live stream, and future NDI source records",
        "Categories, tags, preview metadata, and search APIs",
        "Offline-ready storage paths for player caching"
      ]}
    />
  );
}
