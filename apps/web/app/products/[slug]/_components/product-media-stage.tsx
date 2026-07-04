import type { CatalogProductDetail } from "@axiom/db";

type ProductMediaStageProps = {
  productName: string;
  media: CatalogProductDetail["media"];
  colorHex?: string | null | undefined;
};

export function ProductMediaStage({
  productName,
  media,
  colorHex
}: ProductMediaStageProps): React.ReactElement {
  const heroMedia = media.find((item) => item.role === "hero") ?? media[0];

  return (
    <section className="space-y-4">
      <div className="relative">
        <div className="absolute inset-10 rounded-full bg-axiom-accent/20 blur-3xl" />
        <figure className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-axiom-panel">
          <div className="aspect-square rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,oklch(0.72_0.16_238_/_0.36),transparent_32%),linear-gradient(135deg,oklch(1_0_0_/_0.13),oklch(1_0_0_/_0.02))]">
            <div className="flex h-full items-center justify-center">
              <div className="relative h-56 w-56 rounded-[2.5rem] border border-white/15 bg-black/25 shadow-axiom-glow">
                <div
                  className="absolute inset-8 rounded-[2rem] border border-white/10"
                  style={colorHex ? { backgroundColor: colorHex } : undefined}
                />
              </div>
            </div>
          </div>

          <figcaption className="mt-4 flex items-center justify-between gap-4 px-1 text-xs text-axiom-dim">
            <span>{heroMedia?.alt ?? `${productName} product render`}</span>
            <span>{heroMedia?.role ?? "hero"}</span>
          </figcaption>
        </figure>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(media.length > 0 ? media : [{ url: "", alt: productName, role: "hero", width: null, height: null }]).map(
          (item) => (
            <div
              key={`${item.role}-${item.alt}`}
              className="rounded-axiom-lg border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="aspect-[4/3] rounded-axiom-md border border-white/10 bg-white/[0.04]" />
              <p className="mt-2 truncate text-xs text-axiom-dim">{item.role}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
