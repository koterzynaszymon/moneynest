export function BudgetsHeader({
  householdName,
}: {
  householdName: string;
}) {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-3xl font-bold">
        {householdName} budgets
      </h1>
      <p className="text-sm text-muted-foreground">
        Plan monthly spending limits for the household and its expense
        categories.
      </p>
    </div>
  );
}
