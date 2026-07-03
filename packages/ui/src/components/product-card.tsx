import type { ReactNode } from "react";

import { cn } from "../lib/utils";
import { Badge, type BadgeTone } from "./badge";

type ProductCardBadge = {
  label: string;
  tone?: BadgeTone | undefined;
};

type ProductCardProps = {
  href: string;
  brand: string;
  name: string;
  price: string;
  kicker?: string | undefined;
  availability?: string | undefined;
  badges?: ProductCardBadge[] | undefined;
  media?: ReactNode | undefined;
  className?: string | undefined;
};

function ProductCard({
  href,
  brand,
  name,
  price,
  kicker,
  availability,
  badges = [],
  media,
  className
}: ProductCardProps): React.ReactElement {
  return (
    <a
      href={href}
      className={cn(
        "group block overflow-hidden rounded-axiom-xl axiom-surface",
        "transition-[border-color,box-shadow,transform] duration-300 ease-(--ease-axiom-emphasized)",
        "hover:-translate-y-1 hover:border-white/20 hover:shadow-axiom-glow",
        "focus-visible:axiom-focus",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white/[0.03]">
        {media ?? (
          <div className="flex h-full items-center justify-center">
            <div className="h-32 w-32 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/16 to-white/3 shadow-axiom-glow transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}

        {badges.length > 0 ? (
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.label} tone={badge.tone ?? "neutral"}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-axiom-dim">
              {brand}
            </p>

            {availability ? (
              <span className="text-xs text-axiom-success">{availability}</span>
            ) : null}
          </div>

          <h3 className="text-lg font-semibold tracking-[-0.035em] text-axiom-ink">
            {name}
          </h3>

          {kicker ? (
            <p className="line-clamp-2 text-sm leading-6 text-axiom-muted">
              {kicker}
            </p>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-axiom-dim">Starting at</p>
            <p className="text-xl font-semibold tracking-[-0.04em] text-axiom-ink">
              {price}
            </p>
          </div>

          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-axiom-muted transition-colors group-hover:border-axiom-accent/40 group-hover:text-axiom-accent">
            View
          </span>
        </div>
      </div>
    </a>
  );
}

export { ProductCard };
export type { ProductCardProps, ProductCardBadge };
