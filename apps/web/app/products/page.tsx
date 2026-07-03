import {
  getCatalogFacets,
  getCatalogProductCards,
  type CatalogProductAvailability,
  type CatalogProductQueryOptions,
  type CatalogProductSort
} from "@axiom/db";
import { Badge, Button, ProductCard } from "@axiom/ui";

import { formatCurrency, getAvailabilityLabel } from "../lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products"
};

type SearchParamValue = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

type ProductsHrefPatch = {
  categorySlug?: string | null;
  brandSlug?: string | null;
  availability?: CatalogProductAvailability | null;
  minPriceCents?: number | null;
  maxPriceCents?: number | null;
  sort?: CatalogProductSort | null;
};

const availabilityOptions: {
  value: CatalogProductAvailability;
  label: string;
}[] = [
  { value: "in-stock", label: "In stock" },
  { value: "low-stock", label: "Low stock" },
  { value: "out-of-stock", label: "Out of stock" }
];

const sortOptions: {
  value: CatalogProductSort;
  label: string;
}[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" }
];

function getSingleParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseCentsFromDollars(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return undefined;
  }

  return Math.round(amount * 100);
}

function isAvailability(value: string | undefined): value is CatalogProductAvailability {
  return value === "in-stock" || value === "low-stock" || value === "out-of-stock";
}

function isSort(value: string | undefined): value is CatalogProductSort {
  return value === "featured" || value === "name-asc" || value === "price-asc" || value === "price-desc";
}

function parseFilters(rawSearchParams: Record<string, SearchParamValue>): CatalogProductQueryOptions {
  const filters: CatalogProductQueryOptions = {};

  const categorySlug = getSingleParam(rawSearchParams["category"]);
  const brandSlug = getSingleParam(rawSearchParams["brand"]);
  const availability = getSingleParam(rawSearchParams["availability"]);
  const sort = getSingleParam(rawSearchParams["sort"]);

  const minPriceCents = parseCentsFromDollars(getSingleParam(rawSearchParams["minPrice"]));
  const maxPriceCents = parseCentsFromDollars(getSingleParam(rawSearchParams["maxPrice"]));

  if (categorySlug) {
    filters.categorySlug = categorySlug;
  }

  if (brandSlug) {
    filters.brandSlug = brandSlug;
  }

  if (isAvailability(availability)) {
    filters.availability = availability;
  }

  if (typeof minPriceCents === "number") {
    filters.minPriceCents = minPriceCents;
  }

  if (typeof maxPriceCents === "number") {
    filters.maxPriceCents = maxPriceCents;
  }

  if (isSort(sort)) {
    filters.sort = sort;
  }

  return filters;
}

function createProductsHref(
  currentFilters: CatalogProductQueryOptions,
  patch: ProductsHrefPatch
): string {
  const nextFilters: CatalogProductQueryOptions = { ...currentFilters };

  if ("categorySlug" in patch) {
    if (patch.categorySlug) {
      nextFilters.categorySlug = patch.categorySlug;
    } else {
      delete nextFilters.categorySlug;
    }
  }

  if ("brandSlug" in patch) {
    if (patch.brandSlug) {
      nextFilters.brandSlug = patch.brandSlug;
    } else {
      delete nextFilters.brandSlug;
    }
  }

  if ("availability" in patch) {
    if (patch.availability) {
      nextFilters.availability = patch.availability;
    } else {
      delete nextFilters.availability;
    }
  }

  if ("minPriceCents" in patch) {
    if (typeof patch.minPriceCents === "number") {
      nextFilters.minPriceCents = patch.minPriceCents;
    } else {
      delete nextFilters.minPriceCents;
    }
  }

  if ("maxPriceCents" in patch) {
    if (typeof patch.maxPriceCents === "number") {
      nextFilters.maxPriceCents = patch.maxPriceCents;
    } else {
      delete nextFilters.maxPriceCents;
    }
  }

  if ("sort" in patch) {
    if (patch.sort) {
      nextFilters.sort = patch.sort;
    } else {
      delete nextFilters.sort;
    }
  }

  const params = new URLSearchParams();

  if (nextFilters.categorySlug) {
    params.set("category", nextFilters.categorySlug);
  }

  if (nextFilters.brandSlug) {
    params.set("brand", nextFilters.brandSlug);
  }

  if (nextFilters.availability) {
    params.set("availability", nextFilters.availability);
  }

  if (typeof nextFilters.minPriceCents === "number") {
    params.set("minPrice", String(Math.round(nextFilters.minPriceCents / 100)));
  }

  if (typeof nextFilters.maxPriceCents === "number") {
    params.set("maxPrice", String(Math.round(nextFilters.maxPriceCents / 100)));
  }

  if (nextFilters.sort && nextFilters.sort !== "featured") {
    params.set("sort", nextFilters.sort);
  }

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

function formatPriceInput(amountCents: number | undefined): string {
  if (typeof amountCents !== "number") {
    return "";
  }

  return String(Math.round(amountCents / 100));
}

function getActiveFilterCount(filters: CatalogProductQueryOptions): number {
  return [
    filters.categorySlug,
    filters.brandSlug,
    filters.availability,
    filters.minPriceCents,
    filters.maxPriceCents,
    filters.sort && filters.sort !== "featured" ? filters.sort : undefined
  ].filter(Boolean).length;
}

function getAvailabilityCount(
  availability: Awaited<ReturnType<typeof getCatalogFacets>>["availability"],
  value: CatalogProductAvailability
): number {
  if (value === "in-stock") {
    return availability.inStock;
  }

  if (value === "low-stock") {
    return availability.lowStock;
  }

  return availability.outOfStock;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawSearchParams = await searchParams;
  const filters = parseFilters(rawSearchParams);

  const [products, facets] = await Promise.all([
    getCatalogProductCards(filters),
    getCatalogFacets()
  ]);

  const activeFilterCount = getActiveFilterCount(filters);

  const activeCategory = filters.categorySlug
    ? facets.categories.find((category) => category.slug === filters.categorySlug)
    : undefined;

  const activeBrand = filters.brandSlug
    ? facets.brands.find((brand) => brand.slug === filters.brandSlug)
    : undefined;

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
          <aside className="space-y-4">
            <section className="rounded-axiom-xl axiom-surface p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-[-0.02em] text-axiom-ink">
                    Filters
                  </p>
                  <p className="mt-1 text-xs text-axiom-dim">
                    {activeFilterCount} active
                  </p>
                </div>

                {activeFilterCount > 0 ? (
                  <a
                    href="/products"
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-axiom-muted transition-colors hover:border-white/20 hover:text-axiom-ink"
                  >
                    Clear
                  </a>
                ) : null}
              </div>

              {activeFilterCount > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeCategory ? <Badge tone="neutral">{activeCategory.label}</Badge> : null}
                  {activeBrand ? <Badge tone="neutral">{activeBrand.label}</Badge> : null}
                  {filters.availability ? <Badge tone="neutral">{filters.availability}</Badge> : null}
                  {typeof filters.minPriceCents === "number" ? (
                    <Badge tone="neutral">
                      Min {formatCurrency(filters.minPriceCents, "USD")}
                    </Badge>
                  ) : null}
                  {typeof filters.maxPriceCents === "number" ? (
                    <Badge tone="neutral">
                      Max {formatCurrency(filters.maxPriceCents, "USD")}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="rounded-axiom-xl axiom-surface p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
                Category
              </p>

              <div className="space-y-1">
                <a
                  href={createProductsHref(filters, { categorySlug: null })}
                  className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                    !filters.categorySlug
                      ? "bg-white/10 text-axiom-ink"
                      : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                  }`}
                >
                  <span>All categories</span>
                  <span>{facets.categories.reduce((sum, category) => sum + category.count, 0)}</span>
                </a>

                {facets.categories.map((category) => (
                  <a
                    key={category.slug}
                    href={createProductsHref(filters, { categorySlug: category.slug })}
                    className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                      filters.categorySlug === category.slug
                        ? "bg-white/10 text-axiom-ink"
                        : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span>{category.count}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-axiom-xl axiom-surface p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
                Brand
              </p>

              <div className="space-y-1">
                <a
                  href={createProductsHref(filters, { brandSlug: null })}
                  className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                    !filters.brandSlug
                      ? "bg-white/10 text-axiom-ink"
                      : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                  }`}
                >
                  <span>All brands</span>
                  <span>{facets.brands.reduce((sum, brand) => sum + brand.count, 0)}</span>
                </a>

                {facets.brands.map((brand) => (
                  <a
                    key={brand.slug}
                    href={createProductsHref(filters, { brandSlug: brand.slug })}
                    className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                      filters.brandSlug === brand.slug
                        ? "bg-white/10 text-axiom-ink"
                        : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                    }`}
                  >
                    <span>{brand.label}</span>
                    <span>{brand.count}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-axiom-xl axiom-surface p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
                Availability
              </p>

              <div className="space-y-1">
                <a
                  href={createProductsHref(filters, { availability: null })}
                  className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                    !filters.availability
                      ? "bg-white/10 text-axiom-ink"
                      : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                  }`}
                >
                  <span>Any availability</span>
                  <span>{facets.availability.inStock + facets.availability.outOfStock}</span>
                </a>

                {availabilityOptions.map((option) => (
                  <a
                    key={option.value}
                    href={createProductsHref(filters, { availability: option.value })}
                    className={`flex items-center justify-between rounded-axiom-md px-3 py-2 text-sm transition-colors ${
                      filters.availability === option.value
                        ? "bg-white/10 text-axiom-ink"
                        : "text-axiom-muted hover:bg-white/7 hover:text-axiom-ink"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span>{getAvailabilityCount(facets.availability, option.value)}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-axiom-xl axiom-surface p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
                Price
              </p>

              <form action="/products" method="get" className="space-y-3">
                {filters.categorySlug ? (
                  <input type="hidden" name="category" value={filters.categorySlug} />
                ) : null}
                {filters.brandSlug ? (
                  <input type="hidden" name="brand" value={filters.brandSlug} />
                ) : null}
                {filters.availability ? (
                  <input type="hidden" name="availability" value={filters.availability} />
                ) : null}
                {filters.sort && filters.sort !== "featured" ? (
                  <input type="hidden" name="sort" value={filters.sort} />
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-2">
                    <span className="text-xs text-axiom-dim">Min</span>
                    <input
                      name="minPrice"
                      inputMode="numeric"
                      defaultValue={formatPriceInput(filters.minPriceCents)}
                      placeholder={formatPriceInput(facets.priceRange.minAmountCents)}
                      className="h-11 w-full rounded-axiom-md border border-white/10 bg-white/[0.045] px-3 text-sm text-axiom-ink outline-none transition-colors placeholder:text-axiom-dim focus:border-axiom-accent/50"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs text-axiom-dim">Max</span>
                    <input
                      name="maxPrice"
                      inputMode="numeric"
                      defaultValue={formatPriceInput(filters.maxPriceCents)}
                      placeholder={formatPriceInput(facets.priceRange.maxAmountCents)}
                      className="h-11 w-full rounded-axiom-md border border-white/10 bg-white/[0.045] px-3 text-sm text-axiom-ink outline-none transition-colors placeholder:text-axiom-dim focus:border-axiom-accent/50"
                    />
                  </label>
                </div>

                <Button variant="secondary" className="w-full">
                  Apply price
                </Button>
              </form>
            </section>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-col justify-between gap-4 rounded-axiom-xl axiom-surface p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold tracking-[-0.02em] text-axiom-ink">
                  {products.length} products
                </p>
                <p className="mt-1 text-xs text-axiom-dim">
                  Database-backed product listing with URL-addressable filters.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <a
                    key={option.value}
                    href={createProductsHref(filters, { sort: option.value })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      (filters.sort ?? "featured") === option.value
                        ? "border-axiom-accent/40 bg-axiom-accent/12 text-axiom-accent"
                        : "border-white/10 text-axiom-muted hover:border-white/20 hover:text-axiom-ink"
                    }`}
                  >
                    {option.label}
                  </a>
                ))}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-axiom-xl axiom-surface p-8">
                <p className="text-sm font-medium text-axiom-ink">No products match these filters.</p>
                <p className="mt-2 text-sm text-axiom-muted">
                  Clear filters or adjust the price range to explore the demo catalog.
                </p>
                <Button asChild variant="secondary" className="mt-6">
                  <a href="/products">Clear all filters</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                        label: product.category,
                        tone: "neutral"
                      },
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
        </div>
      </section>
    </main>
  );
}
