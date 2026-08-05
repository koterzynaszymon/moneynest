import { CreateWalletModal } from "./create-wallet-modal";

export function WalletsHeader({
  householdId,
  householdName,
  walletCount,
}: {
  householdId: string;
  householdName: string;
  walletCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold">
          {householdName} wallets ({walletCount})
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage the household&apos;s wallets to track your spending.
        </p>
      </div>
      <CreateWalletModal householdId={householdId} />
    </div>
  );
}
