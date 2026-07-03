import { getCatalogProductCards } from "@axiom/db";
import { Badge, Button, ProductCard } from "@axiom/ui";

import { formatCurrency, getAvailabilityLabel } from "../lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products"
};

export default async function ProductsPage() {
  const products = await getCatalogProductCards();

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="axiom-container flex h-20 items-center justify-between">
          <a href="/" className="text-sm font-semibold tracking-[-0.03em] text-axiom-ink">
            Axiom Commerce Lab
          </a>

          <Button asChild variant="secondary" size="sm">
            <a href="/">Back home</a>
          </Button>
        </div>
      </header>

      <section className="axiom-container py-14">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="space-y-4">
            <Badge tone="accent">Live catalog</Badge>
            <div>
              <h1 className="text-5xl font-semibold tracking-[-0.075em] text-axiom-ink">
                Technology catalog
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-axiom-muted">
                A first database-backed product listing powered by products, variants, SKUs, prices and inventory.
              </p>
            </div>
          </div>

          <div className="rounded-axiom-xl axiom-surface p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
              Read model
            </p>
            <p className="mt-3 text-sm leading-6 text-axiom-muted">
              This page does not read mock arrays. It queries a PostgreSQL catalog projection through <code className="rounded-md bg-white/10 px-1.5 py-0.5">@axiom/db</code>.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-axiom-xl axiom-surface p-8">
            <p className="text-sm font-medium text-axiom-ink">No products found.</p>
            <p className="mt-2 text-sm text-axiom-muted">
              Run <code className="rounded-md bg-white/10 px-1.5 py-0.5">pnpm db:seed</code> to load demo data.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                href={`/products/${product.slug}`}
                brand={product.brand}
                name={product.name}
                price={formatCurrency(product.amountCents, product.currencyCode)}
                kicker={product.subtitle ?? undefined}
                availability={getAvailabilityLabel(product.availableStock)}
                badges={[
                  {
                    label: product.availableStock > 0 ? "Available" : "Sold out",
                    tone: product.availableStock > 0 ? "success" : "danger"
                  }
                ]}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
