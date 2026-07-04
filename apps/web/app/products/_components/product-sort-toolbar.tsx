import type { CatalogProductQueryOptions } from "@axiom/db";

import { createProductsHref, sortOptions } from "../_lib/catalog-filter-state";

type ProductSortToolbarProps = {
  productCount: number;
  filters: CatalogProductQueryOptions;
};

export function ProductSortToolbar({
  productCount,
  filters
}: ProductSortToolbarProps): React.ReactElement {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-axiom-xl axiom-surface p-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold tracking-[-0.02em] text-axiom-ink">
          {productCount} products
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
  );
}
