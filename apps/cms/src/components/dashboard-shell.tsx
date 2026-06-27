import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  ["Dashboard", "/"],
  ["Media Library", "/media"],
  ["Playlists", "/playlists"],
  ["Schedules", "/schedules"],
  ["Screens", "/screens"],
  ["Layouts", "/layouts"],
  ["Widgets", "/widgets"],
  ["Resolume", "/resolume"]
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <main className="led-grid min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r bg-background/70 p-6 backdrop-blur lg:block">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">PlayerMaster</p>
            <h1 className="mt-2 text-2xl font-bold">Command Center</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="flex-1 p-4 md:p-8">
          <header className="mb-8 flex flex-col gap-4 rounded-2xl border bg-card/70 p-6 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary">LED-wall operations</p>
              <h2 className="mt-2 text-3xl font-bold">Digital Signage Platform</h2>
            </div>
            <div className="rounded-full border px-4 py-2 text-sm text-muted-foreground">
              Realtime monitoring enabled
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
