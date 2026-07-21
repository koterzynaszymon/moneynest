import { Amount } from "@/components/ui/amount";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  currentValue: number;
  targetValue: number;
  currency: string;
  title?: string;
  headlineValue?: number;
  currentLabel?: string;
  targetLabel?: string;
  className?: string;
};

export function ProgressBar({
  currentValue,
  targetValue,
  currency,
  title = "Remaining",
  headlineValue,
  currentLabel = "Current",
  targetLabel = "Target",
  className,
}: ProgressBarProps) {
  const normalizedTarget = Math.max(targetValue, 0);
  const normalizedCurrent = Math.max(currentValue, 0);
  const remainingValue = Math.max(normalizedTarget - normalizedCurrent);
  const displayValue = headlineValue ?? remainingValue;
  const progressPercent =
    normalizedTarget > 0
      ? Math.min((normalizedCurrent / normalizedTarget) * 100, 100)
      : 0;

  const barColor =
    progressPercent >= 100
      ? "bg-red-500"
      :progressPercent >= 90
        ? "bg-orange-500"
      : progressPercent >= 75
        ? "bg-yellow-500"
        : progressPercent >= 50
          ? "bg-sky-500"
          : "bg-emerald-500";

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 font-display text-2xl font-bold">
          <Amount value={displayValue} currency={currency} tone="neutral" />
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {currentLabel}{" "}
          <Amount
            value={normalizedCurrent}
            currency={currency}
            tone="neutral"
          />
        </span>
        <span>
          {targetLabel}{" "}
          <Amount
            value={normalizedTarget}
            currency={currency}
            tone="neutral"
          />
        </span>
      </div>
    </div>
  );
}
