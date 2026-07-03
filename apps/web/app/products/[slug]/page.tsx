import { getProductBySlug } from "@axiom/db";
import { Badge, Button } from "@axiom/ui";
import { notFound } from "next/navigation";

import { formatCurrency, getAvailabilityLabel } from "../../lib/format";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryVariant = product.variants[0];

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="axiom-container flex h-20 items-center justify-between">
          <a href="/" className="text-sm font-semibold tracking-[-0.03em] text-axiom-ink">
            Axiom Commerce Lab
          </a>

          <Button asChild variant="secondary" size="sm">
            <a href="/products">All products</a>
          </Button>
        </div>
      </header>

      <section className="axiom-container grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative">
          <div className="absolute inset-10 rounded-full bg-axiom-accent/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-axiom-panel">
            <div className="aspect-square rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,oklch(0.72_0.16_238_/_0.36),transparent_32%),linear-gradient(135deg,oklch(1_0_0_/_0.13),oklch(1_0_0_/_0.02))]">
              <div className="flex h-full items-center justify-center">
                <div className="h-52 w-52 rounded-[2.5rem] border border-white/15 bg-black/20 shadow-axiom-glow" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:pt-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{product.category}</Badge>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-axiom-dim">
                {product.brand}
              </p>
            </div>

            <div>
              <h1 className="text-5xl font-semibold tracking-[-0.075em] text-axiom-ink">
                {product.name}
              </h1>

              {product.subtitle ? (
                <p className="mt-4 text-lg leading-8 text-axiom-muted">
                  {product.subtitle}
                </p>
              ) : null}
            </div>

            {product.description ? (
              <p className="max-w-2xl text-sm leading-7 text-axiom-muted">
                {product.description}
              </p>
            ) : null}
          </div>

          {primaryVariant ? (
            <section className="rounded-axiom-xl axiom-surface p-6">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
                    Selected configuration
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-axiom-ink">
                    {primaryVariant.skuTitle}
                  </h2>
                  <p className="mt-2 text-sm text-axiom-muted">
                    SKU: {primaryVariant.skuCode}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-3xl font-semibold tracking-[-0.06em] text-axiom-ink">
                    {formatCurrency(primaryVariant.amountCents, primaryVariant.currencyCode)}
                  </p>
                  <p className="mt-2 text-sm text-axiom-success">
                    {getAvailabilityLabel(primaryVariant.availableStock)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs text-axiom-dim">Variant</p>
                  <p className="mt-2 text-sm font-medium text-axiom-ink">
                    {primaryVariant.variantName}
                  </p>
                </div>

                <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs text-axiom-dim">Color</p>
                  <p className="mt-2 text-sm font-medium text-axiom-ink">
                    {primaryVariant.colorName ?? "Default"}
                  </p>
                </div>

                <div className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs text-axiom-dim">Available stock</p>
                  <p className="mt-2 text-sm font-medium text-axiom-ink">
                    {primaryVariant.availableStock} units
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button>Add to cart</Button>
                <Button variant="secondary">Compare</Button>
              </div>
            </section>
          ) : (
            <section className="rounded-axiom-xl axiom-surface p-6">
              <p className="text-sm text-axiom-muted">No active variants available.</p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
