"use client";

import * as React from "react";
import type { Zone, ZoneRect } from "@playermaster/shared";

export function LayoutEditor({
  zones,
  onChange
}: {
  zones: Zone[];
  onChange: (zones: Zone[]) => void;
}): React.ReactElement {
  const [activeZoneId, setActiveZoneId] = React.useState<string>();

  function updateZone(zoneId: string, rect: Partial<ZoneRect>) {
    onChange(
      zones.map((zone) =>
        zone.id === zoneId ? { ...zone, rect: { ...zone.rect, ...rect } } : zone
      )
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border bg-black/80">
      {zones.map((zone) => (
        <button
          key={zone.id}
          type="button"
          className="absolute rounded-lg border border-primary/80 bg-primary/10 p-2 text-left text-xs text-white"
          style={{
            left: `${zone.rect.x}%`,
            top: `${zone.rect.y}%`,
            width: `${zone.rect.width}%`,
            height: `${zone.rect.height}%`,
            zIndex: zone.rect.zIndex
          }}
          onClick={() => setActiveZoneId(zone.id)}
        >
          <span className="font-semibold">{zone.name}</span>
          <span className="block text-white/70">{zone.kind}</span>
        </button>
      ))}
      {activeZoneId ? (
        <div className="absolute bottom-3 left-3 right-3 rounded-lg border bg-background/95 p-3 text-xs">
          <p className="mb-2 font-semibold">Selected zone controls</p>
          <div className="grid grid-cols-4 gap-2">
            {(["x", "y", "width", "height"] as const).map((key) => (
              <label key={key}>
                {key}
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded border bg-background px-2 py-1"
                  value={zones.find((zone) => zone.id === activeZoneId)?.rect[key] ?? 0}
                  onChange={(event) => updateZone(activeZoneId, { [key]: Number(event.target.value) })}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
