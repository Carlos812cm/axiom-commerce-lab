import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full text-sm font-medium tracking-[-0.01em]",
    "transition-[background,border-color,color,box-shadow,transform] duration-200",
    "ease-(--ease-axiom-standard)",
    "focus-visible:axiom-focus",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.985]"
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-axiom-ink text-axiom-void",
          "shadow-[0_18px_44px_-24px_oklch(1_0_0_/_0.7)]",
          "hover:bg-white"
        ],
        secondary: [
          "axiom-hairline bg-white/5 text-axiom-ink",
          "hover:bg-white/10 hover:border-white/20"
        ],
        ghost: [
          "text-axiom-muted",
          "hover:bg-white/7 hover:text-axiom-ink"
        ],
        accent: [
          "bg-axiom-accent text-axiom-void",
          "shadow-[0_20px_54px_-28px_oklch(0.72_0.16_238_/_0.85)]",
          "hover:bg-[oklch(0.78_0.15_238)]"
        ]
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps): React.ReactElement {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
