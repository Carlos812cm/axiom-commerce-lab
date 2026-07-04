import type {
  CatalogFacets,
  CatalogProductAvailability,
  CatalogProductQueryOptions
} from "@axiom/db";
import { Badge, Button } from "@axiom/ui";

import { formatCurrency } from "../../lib/format";
import {
  availabilityOptions,
  createProductsHref,
  formatPriceInput,
  getActiveFilterCount
} from "../_lib/catalog-filter-state";

type CatalogFiltersProps = {
  filters: CatalogProductQueryOptions;
  facets: CatalogFacets;
};

function getAvailabilityCount(
  availability: CatalogFacets["availability"],
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

function getAvailabilityLabel(value: CatalogProductAvailability): string {
  return availabilityOptions.find((option) => option.value === value)?.label ?? value;
}

function FilterPanel({ filters, facets }: CatalogFiltersProps): React.ReactElement {
  const activeFilterCount = getActiveFilterCount(filters);

  const activeCategory = filters.categorySlug
    ? facets.categories.find((category) => category.slug === filters.categorySlug)
    : undefined;

  const activeBrand = filters.brandSlug
    ? facets.brands.find((brand) => brand.slug === filters.brandSlug)
    : undefined;

  const totalCategoryCount = facets.categories.reduce(
    (sum, category) => sum + category.count,
    0
  );

  const totalBrandCount = facets.brands.reduce((sum, brand) => sum + brand.count, 0);

  return (
    <div className="space-y-4">
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
            {filters.availability ? (
              <Badge tone="neutral">{getAvailabilityLabel(filters.availability)}</Badge>
            ) : null}
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
            <span>{totalCategoryCount}</span>
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
            <span>{totalBrandCount}</span>
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
    </div>
  );
}

export function CatalogFilters({
  filters,
  facets
}: CatalogFiltersProps): React.ReactElement {
  return (
    <>
      <details className="rounded-axiom-xl axiom-surface p-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-[-0.02em] text-axiom-ink [&::-webkit-details-marker]:hidden">
          <span>Filters</span>
          <span className="text-xs font-medium text-axiom-dim">
            {getActiveFilterCount(filters)} active
          </span>
        </summary>

        <div className="mt-5">
          <FilterPanel filters={filters} facets={facets} />
        </div>
      </details>

      <aside className="hidden lg:block">
        <FilterPanel filters={filters} facets={facets} />
      </aside>
    </>
  );
}
