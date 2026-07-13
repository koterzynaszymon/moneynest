import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const amountVariants = cva("font-mono tabular-nums", {
  variants: {
    // How the value should be colored.
    // - "sign": green for positive, red for negative (money in/out)
    // - "income" / "expense": force a color regardless of sign
    // - "neutral": inherit the surrounding text color
    tone: {
      sign: "",
      income: "text-income",
      expense: "text-expense",
      neutral: "",
    },
  },
  defaultVariants: {
    tone: "sign",
  },
});

export interface AmountProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof amountVariants>, "tone"> {
  value: number;
  currency?: string;
  locale?: string;
  tone?: VariantProps<typeof amountVariants>["tone"];
  showPlus?: boolean;
}

function Amount({
  value,
  currency = "PLN",
  locale = "pl-PL",
  tone = "sign",
  showPlus = false,
  className,
  ...props
}: AmountProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);

  const sign = value > 0 && showPlus ? "+" : "";

  const signTone =
    tone === "sign"
      ? value < 0
        ? "text-expense"
        : value > 0
          ? "text-income"
          : "text-muted-foreground"
      : undefined;

  return (
    <span className={cn(amountVariants({ tone }), signTone, className)} {...props}>
      {sign}
      {formatted}
    </span>
  );
}

export { Amount, amountVariants };
