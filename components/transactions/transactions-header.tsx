import CreateTransactionModal from "./create-transaction-modal";
import type { Category } from "@/lib/types/categories";
import type { Wallets } from "@/lib/types/wallets";

type TransactionsHeaderProps = {
  householdId: string;
  categories: Category[];
  wallets: Wallets[];
};

export function TransactionsHeader({
  householdId,
  categories,
  wallets,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Manage income and expense transactions for this household.
        </p>
      </div>
      <CreateTransactionModal
        householdId={householdId}
        categories={categories}
        wallets={wallets}
      />
    </div>
  );
}
