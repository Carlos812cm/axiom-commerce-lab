import { getCatalogFacets, getCatalogProductCards } from "@axiom/db";
import { Badge, Button } from "@axiom/ui";

import { CatalogFilters } from "./_components/catalog-filters";
import { CatalogProductGrid } from "./_components/catalog-product-grid";
import { ProductSortToolbar } from "./_components/product-sort-toolbar";
import {
  parseCatalogFilters,
  type ProductsPageSearchParams
} from "./_lib/catalog-filter-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products"
};

type ProductsPageProps = {
  searchParams: Promise<ProductsPageSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawSearchParams = await searchParams;
  const filters = parseCatalogFilters(rawSearchParams);

  const [products, facets] = await Promise.all([
    getCatalogProductCards(filters),
    getCatalogFacets()
  ]);

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
                Filter a PostgreSQL-backed commerce catalog by category, brand, availability and price.
              </p>
            </div>
          </div>

          <div className="rounded-axiom-xl axiom-surface p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
              URL state
            </p>
            <p className="mt-3 text-sm leading-6 text-axiom-muted">
              Filters are encoded in the URL, making catalog states shareable, reload-safe and ready for deeper search architecture.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <CatalogFilters filters={filters} facets={facets} />

          <section className="space-y-5">
            <ProductSortToolbar productCount={products.length} filters={filters} />
            <CatalogProductGrid products={products} />
          </section>
        </div>
      </section>
    </main>
  );
}
