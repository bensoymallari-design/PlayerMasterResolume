import * as React from "react";
import { createRoot } from "react-dom/client";
import type { ContentManifest, MediaAsset, PlaylistItem, Zone } from "@playermaster/shared";
import "./styles.css";

function PlayerApp(): React.ReactElement {
  const [manifest, setManifest] = React.useState<ContentManifest>();
  const [itemIndex, setItemIndex] = React.useState(0);

  React.useEffect(() => {
    window.playerMaster.onManifest((nextManifest) => {
      setManifest(nextManifest);
      setItemIndex(0);
    });
  }, []);

  const playlist = manifest?.playlists[0];
  const items = playlist?.items ?? [];
  const activeItem = items[itemIndex % Math.max(items.length, 1)];

  React.useEffect(() => {
    if (!activeItem || !items.length) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setItemIndex((current) => (current + 1) % items.length);
    }, activeItem.durationSeconds * 1000);
    return () => window.clearTimeout(timeout);
  }, [activeItem, items.length]);

  if (!manifest) {
    return <div className="empty">Waiting for PlayerMaster content manifest...</div>;
  }

  return (
    <div className="stage">
      {manifest.layout?.zones.length ? (
        manifest.layout.zones.map((zone) => (
          <ZoneRenderer
            key={zone.id}
            zone={zone}
            activeItem={activeItem}
            media={manifest.media.find((asset) => asset.id === activeItem?.mediaId)}
          />
        ))
      ) : (
        <FullScreenMedia media={manifest.media.find((asset) => asset.id === activeItem?.mediaId)} />
      )}
    </div>
  );
}

function ZoneRenderer({
  zone,
  media,
  activeItem
}: {
  zone: Zone;
  media?: MediaAsset;
  activeItem?: PlaylistItem;
}): React.ReactElement {
  return (
    <section
      className="zone"
      style={{
        left: `${zone.rect.x}%`,
        top: `${zone.rect.y}%`,
        width: `${zone.rect.width}%`,
        height: `${zone.rect.height}%`,
        zIndex: zone.rect.zIndex
      }}
    >
      {zone.kind === "CLOCK" ? <Clock /> : null}
      {zone.kind === "WEATHER" ? <WidgetText text="Weather widget: Open-Meteo ready" /> : null}
      {zone.kind === "NEWS_TICKER" ? <WidgetText text="RSS news ticker ready" /> : null}
      {zone.kind === "TEXT" ? <WidgetText text={(zone.config.message as string) ?? "Announcement"} /> : null}
      {["VIDEO", "IMAGE", "WEBSITE", "HTML_WIDGET"].includes(zone.kind) ? (
        <FullScreenMedia media={media} durationSeconds={activeItem?.durationSeconds} />
      ) : null}
    </section>
  );
}

function FullScreenMedia({
  media,
  durationSeconds
}: {
  media?: MediaAsset;
  durationSeconds?: number;
}): React.ReactElement {
  if (!media) {
    return <WidgetText text="No content assigned" />;
  }

  if (media.kind === "VIDEO" || media.kind === "LIVE_STREAM") {
    return <video className="fill" src={media.externalUrl ?? media.storagePath} autoPlay muted playsInline />;
  }

  if (media.kind === "IMAGE" || media.kind === "GIF") {
    return <img className="fill" src={media.externalUrl ?? media.storagePath} alt={media.title} />;
  }

  if (media.kind === "WEBSITE" || media.kind === "YOUTUBE" || media.kind === "HTML_WIDGET") {
    return <iframe className="fill" src={media.externalUrl} title={media.title} sandbox="allow-scripts allow-same-origin" />;
  }

  return <WidgetText text={`Future source ready: ${media.kind} (${durationSeconds ?? 0}s)`} />;
}

function Clock(): React.ReactElement {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="clock">{now.toLocaleTimeString()}</div>;
}

function WidgetText({ text }: { text: string }): React.ReactElement {
  return <div className="widget-text">{text}</div>;
}

createRoot(document.getElementById("root")!).render(<PlayerApp />);
