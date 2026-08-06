"use client";
import type { Wallets } from "@/lib/types/wallets";
import { EditWalletModal } from "./edit-wallet-modal";
import { Button } from "../ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import { deleteWallet } from "@/lib/wallets/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WalletsBody({
  wallets,
  householdId,
}: {
  wallets: Wallets[];
  householdId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDeleteWallet(householdId: string, walletId: string) {
    try {
      setIsDeleting(true);
      const isConfirmed = confirm("Are you sure you want to delete this wallet?");
      if (!isConfirmed) {
        return;
      }
      const result = await deleteWallet(householdId, walletId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the wallet: " + error);
    } finally {
      setIsDeleting(false);
    }
  }
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
            <h2 className="font-display text-lg font-semibold">
              {wallet.name}
            </h2>
            <div className="flex items-center gap-2">
              <EditWalletModal wallet={wallet} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hover:border-red-500 hover:text-red-500"
                aria-label={`Delete ${wallet.name}`}
                onClick={() => handleDeleteWallet(householdId, wallet.id)} 
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </div>
          </div>
          {wallet.description ? (
            <p className="text-sm text-muted-foreground">
              {wallet.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No description</p>
          )}
        </div>
      ))}
    </div>
  );
}
