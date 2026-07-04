import type { CatalogProductDetail } from "@axiom/db";
import { Badge } from "@axiom/ui";

type ProductSpecMatrixProps = {
  groups: CatalogProductDetail["specificationGroups"];
};

export function ProductSpecMatrix({
  groups
}: ProductSpecMatrixProps): React.ReactElement {
  if (groups.length === 0) {
    return (
      <section className="rounded-axiom-xl axiom-surface p-6">
        <p className="text-sm font-medium text-axiom-ink">Specifications unavailable.</p>
        <p className="mt-2 text-sm text-axiom-muted">
          This product does not have specification values attached to its selected SKU yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-axiom-xl axiom-surface p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <Badge tone="neutral">Specification matrix</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-axiom-ink">
            Technical details
          </h2>
          <p className="mt-2 text-sm leading-6 text-axiom-muted">
            Category-aware specifications loaded from the product catalog model.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.groupId}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
              {group.name}
            </h3>

            <div className="overflow-hidden rounded-axiom-lg border border-white/10">
              {group.specifications.map((specification, index) => (
                <div
                  key={specification.key}
                  className={`grid gap-3 p-4 sm:grid-cols-[0.8fr_1.2fr] ${
                    index > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-axiom-ink">
                      {specification.label}
                    </p>
                    {specification.isComparable ? (
                      <p className="mt-1 text-xs text-axiom-dim">Comparable</p>
                    ) : null}
                  </div>

                  <p className="text-sm leading-6 text-axiom-muted">
                    {specification.displayValue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
