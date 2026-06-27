"use client";

import * as React from "react";

export function DigitalClockWidget(): React.ReactElement {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="text-5xl font-bold tabular-nums">{now.toLocaleTimeString()}</div>;
}

export function AnalogClockWidget(): React.ReactElement {
  return (
    <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary text-sm">
      Analog clock renderer
    </div>
  );
}

export function WeatherWidget({
  temperature,
  summary
}: {
  temperature?: number;
  summary?: string;
}): React.ReactElement {
  return (
    <div>
      <div className="text-4xl font-bold">{temperature ?? "--"}°</div>
      <p className="text-muted-foreground">{summary ?? "Open-Meteo forecast ready"}</p>
    </div>
  );
}

export function NewsTickerWidget({ items }: { items: string[] }): React.ReactElement {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-pulse">{items.join("  •  ")}</div>
    </div>
  );
}

export function TextWidget({ message }: { message: string }): React.ReactElement {
  return <div className="text-3xl font-semibold">{message}</div>;
}
