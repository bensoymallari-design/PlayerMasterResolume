import { FeaturePage } from "@/components/feature-page";

export default function PlaylistsPage(): React.ReactElement {
  return (
    <FeaturePage
      title="Playlist Management"
      description="Build ordered playback loops from media assets, calculate duration, duplicate playlists, and publish them for assignment."
      features={[
        "Create and duplicate playlists",
        "Add media items with durations and transitions",
        "Reorder items with a dedicated API",
        "Automatic total duration recalculation",
        "Publish gate for production schedules",
        "Manifest-ready playlist item model"
      ]}
    />
  );
}
