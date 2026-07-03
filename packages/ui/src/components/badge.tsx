import type * as React from "react";

import { cn } from "../lib/utils";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClassName: Record<BadgeTone, string> = {
  neutral: "border-white/10 bg-white/6 text-axiom-muted",
  accent: "border-axiom-accent/30 bg-axiom-accent/12 text-axiom-accent",
  success: "border-axiom-success/30 bg-axiom-success/12 text-axiom-success",
  warning: "border-axiom-warning/30 bg-axiom-warning/12 text-axiom-warning",
  danger: "border-axiom-danger/30 bg-axiom-danger/12 text-axiom-danger"
};

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: BadgeTone;
};

function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium tracking-[-0.01em]",
        toneClassName[tone],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeTone };
