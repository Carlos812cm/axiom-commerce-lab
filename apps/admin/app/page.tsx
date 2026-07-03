import { Badge, Button } from "@axiom/ui";

const metrics = [
  { label: "Active SKUs", value: "128" },
  { label: "Reserved stock", value: "24" },
  { label: "Open orders", value: "17" },
  { label: "Search health", value: "99.9%" }
];

export default function AdminHome() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="axiom-container flex h-20 items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-axiom-ink">
              Axiom Admin
            </p>
            <p className="text-xs text-axiom-dim">Operations cockpit</p>
          </div>

          <Button variant="secondary" size="sm">
            Sync search index
          </Button>
        </div>
      </header>

      <section className="axiom-container py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <Badge tone="accent">Internal preview</Badge>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-axiom-ink">
                Inventory and commerce operations
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-axiom-muted">
                This cockpit will evolve into the operational surface for stock, reservations, orders, catalog management and search synchronization.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-axiom-xl axiom-surface p-5">
              <p className="text-xs text-axiom-dim">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-axiom-ink">
                {metric.value}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-6 rounded-axiom-xl axiom-surface p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-axiom-ink">
                Reservation monitor
              </h2>
              <p className="mt-2 text-sm leading-6 text-axiom-muted">
                Placeholder for active, committed, released and expired stock reservations.
              </p>
            </div>

            <Badge tone="success">Healthy</Badge>
          </div>
        </section>
      </section>
    </main>
  );
}
