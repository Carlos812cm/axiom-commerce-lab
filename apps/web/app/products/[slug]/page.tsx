import { getProductBySlug } from "@axiom/db";
import { Badge, Button } from "@axiom/ui";
import { notFound } from "next/navigation";

import { ProductMediaStage } from "./_components/product-media-stage";
import { ProductPurchasePanel } from "./_components/product-purchase-panel";
import { ProductSpecMatrix } from "./_components/product-spec-matrix";

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
        <ProductMediaStage
          productName={product.name}
          media={product.media}
          colorHex={primaryVariant?.colorHex}
        />

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

          <ProductPurchasePanel variant={primaryVariant} />
        </div>
      </section>

      <section className="axiom-container pb-24">
        <ProductSpecMatrix groups={product.specificationGroups} />
      </section>
    </main>
  );
}
