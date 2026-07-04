import type { CatalogProductCard } from "@axiom/db";
import { Button, ProductCard } from "@axiom/ui";

import { formatCurrency, getAvailabilityLabel } from "../../lib/format";

type CatalogProductGridProps = {
  products: CatalogProductCard[];
};

export function CatalogProductGrid({
  products
}: CatalogProductGridProps): React.ReactElement {
  if (products.length === 0) {
    return (
      <div className="rounded-axiom-xl axiom-surface p-8">
        <p className="text-sm font-medium text-axiom-ink">
          No products match these filters.
        </p>
        <p className="mt-2 text-sm text-axiom-muted">
          Clear filters or adjust the price range to explore the demo catalog.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <a href="/products">Clear all filters</a>
        </Button>
      </div>
    );
  }

  return (
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
  );
}
