import { getFeaturedProductCards } from "@axiom/db";
import { Badge, Button, ProductCard, ProductHero } from "@axiom/ui";

import { formatCurrency, getAvailabilityLabel } from "./lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await getFeaturedProductCards(3);

  return (
    <main>
      <header className="border-b border-white/10">
        <div className="axiom-container flex h-20 items-center justify-between">
          <a href="/" className="text-sm font-semibold tracking-[-0.03em] text-axiom-ink">
            Axiom Commerce Lab
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-axiom-muted md:flex">
            <a href="/products" className="transition-colors hover:text-axiom-ink">
              Products
            </a>
            <a href="/compare" className="transition-colors hover:text-axiom-ink">
              Compare
            </a>
            <a href="/engineering" className="transition-colors hover:text-axiom-ink">
              Engineering
            </a>
          </nav>

          <Button variant="secondary" size="sm">
            Cart
          </Button>
        </div>
      </header>

      <ProductHero
        badge="Enterprise-grade demo"
        eyebrow="Multi-brand technology commerce"
        title="A premium storefront engineered for speed, inventory precision and conversion."
        description="Axiom Commerce Lab is a high-end B2C technology commerce platform designed to demonstrate product engineering, domain modeling, performance discipline and enterprise-ready architecture."
        primaryAction={
          <Button asChild size="lg">
            <a href="/products">Explore catalog</a>
          </Button>
        }
        secondaryAction={
          <Button asChild variant="secondary" size="lg">
            <a href="/engineering">View architecture</a>
          </Button>
        }
        stats={[
          { label: "Target LCP", value: "≤2.0s" },
          { label: "Checkout", value: "Safe" },
          { label: "Inventory", value: "Live" }
        ]}
      />

      <section className="axiom-container pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <Badge tone="neutral">Database-backed catalog</Badge>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.055em] text-axiom-ink">
                Featured technology
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-axiom-muted">
                These products are now loaded from PostgreSQL through a typed catalog read model.
              </p>
            </div>
          </div>

          <Button asChild variant="ghost">
            <a href="/products">View all products</a>
          </Button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-axiom-xl axiom-surface p-8">
            <p className="text-sm font-medium text-axiom-ink">No featured products found.</p>
            <p className="mt-2 text-sm text-axiom-muted">
              Run <code className="rounded-md bg-white/10 px-1.5 py-0.5">pnpm db:seed</code> to load the demo catalog.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
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
                    label: product.isFeatured ? "Featured" : "Catalog",
                    tone: product.isFeatured ? "accent" : "neutral"
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
