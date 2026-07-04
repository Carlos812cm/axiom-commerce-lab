import type { CatalogProductDetail } from "@axiom/db";
import { Badge, Button } from "@axiom/ui";

import { formatCurrency, getAvailabilityLabel } from "../../../lib/format";

type ProductVariant = CatalogProductDetail["variants"][number];

type ProductPurchasePanelProps = {
  variant: ProductVariant | undefined;
};

export function ProductPurchasePanel({
  variant
}: ProductPurchasePanelProps): React.ReactElement {
  if (!variant) {
    return (
      <section className="rounded-axiom-xl axiom-surface p-6">
        <p className="text-sm text-axiom-muted">No active variants available.</p>
      </section>
    );
  }

  const isAvailable = variant.availableStock > 0;

  return (
    <section className="rounded-axiom-xl axiom-surface p-6">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
            Selected configuration
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-axiom-ink">
            {variant.skuTitle}
          </h2>
          <p className="mt-2 text-sm text-axiom-muted">SKU: {variant.skuCode}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-3xl font-semibold tracking-[-0.06em] text-axiom-ink">
            {formatCurrency(variant.amountCents, variant.currencyCode)}
          </p>
          <p className={isAvailable ? "mt-2 text-sm text-axiom-success" : "mt-2 text-sm text-axiom-danger"}>
            {getAvailabilityLabel(variant.availableStock)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs text-axiom-dim">Variant</p>
          <p className="mt-2 text-sm font-medium text-axiom-ink">{variant.variantName}</p>
        </div>

        <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs text-axiom-dim">Color</p>
          <div className="mt-2 flex items-center gap-2">
            {variant.colorHex ? (
              <span
                className="h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: variant.colorHex }}
              />
            ) : null}
            <p className="text-sm font-medium text-axiom-ink">
              {variant.colorName ?? "Default"}
            </p>
          </div>
        </div>

        <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs text-axiom-dim">Available stock</p>
          <p className="mt-2 text-sm font-medium text-axiom-ink">
            {variant.availableStock} units
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={!isAvailable}>Add to cart</Button>
        <Button variant="secondary">Compare</Button>
      </div>

      <div className="mt-6 rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isAvailable ? "success" : "danger"}>
            {isAvailable ? "Stock-aware" : "Unavailable"}
          </Badge>
          <p className="text-sm leading-6 text-axiom-muted">
            Cart and checkout will validate price and stock again before reservation.
          </p>
        </div>
      </div>
    </section>
  );
}
