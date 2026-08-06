import type { Wallets } from "@/lib/types/wallets";
import { EditWalletModal } from "./edit-wallet-modal";

export function WalletsBody({
  wallets,
}: {
  householdId: string;
  wallets: Wallets[];
}) {
  if (wallets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No wallets yet. Add your first wallet to track money sources like bank
        accounts or cash.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {wallets.map((wallet) => (
        <div key={wallet.id} className="space-y-1 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">{wallet.name}</h2>
            <EditWalletModal wallet={wallet} />
          </div>
          {wallet.description ? (
            <p className="text-sm text-muted-foreground">{wallet.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No description</p>
          )}
        </div>
      ))}
    </div>
  );
}
