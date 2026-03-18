import type { HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-white text-[var(--foreground)]",
        secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
