export function CategoriesHeader({
  householdName,
  categoryCount,
}: {
  householdName: string;
  categoryCount: number;
}) {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-3xl font-bold">
        {householdName} categories ({categoryCount})
      </h1>
      <p className="text-sm text-muted-foreground">
        Manage income and expense categories for this household.
      </p>
    </div>
  );
}
