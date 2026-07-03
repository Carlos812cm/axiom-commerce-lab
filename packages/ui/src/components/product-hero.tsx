import type { ReactNode } from "react";

import { cn } from "../lib/utils";
import { Badge } from "./badge";

type ProductHeroStat = {
  label: string;
  value: string;
};

type ProductHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  stats?: ProductHeroStat[];
  visual?: ReactNode;
  className?: string;
};

function ProductHero({
  eyebrow,
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  stats = [],
  visual,
  className
}: ProductHeroProps): React.ReactElement {
  return (
    <section
      className={cn(
        "axiom-container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24",
        className
      )}
    >
      <div className="max-w-3xl space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          {badge ? <Badge tone="accent">{badge}</Badge> : null}
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-axiom-dim">
            {eyebrow}
          </p>
        </div>

        <div className="space-y-6">
          <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.075em] text-axiom-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-8 text-axiom-muted sm:text-lg">
            {description}
          </p>
        </div>

        {(primaryAction || secondaryAction) ? (
          <div className="flex flex-wrap items-center gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <dl className="grid max-w-2xl grid-cols-3 gap-3 pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-axiom-lg border border-white/10 bg-white/[0.035] p-4">
                <dt className="text-xs text-axiom-dim">{stat.label}</dt>
                <dd className="mt-2 text-xl font-semibold tracking-[-0.04em] text-axiom-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="relative">
        <div className="absolute inset-10 rounded-full bg-axiom-accent/20 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-axiom-panel">
          {visual ?? (
            <div className="aspect-square rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,oklch(0.72_0.16_238_/_0.36),transparent_32%),linear-gradient(135deg,oklch(1_0_0_/_0.13),oklch(1_0_0_/_0.02))]">
              <div className="flex h-full items-center justify-center">
                <div className="h-48 w-48 rounded-[2.5rem] border border-white/15 bg-black/20 shadow-axiom-glow" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { ProductHero };
export type { ProductHeroProps, ProductHeroStat };
