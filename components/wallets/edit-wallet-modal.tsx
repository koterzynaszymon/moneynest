"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Wallets } from "@/lib/types/wallets";
import { updateWallet } from "@/lib/wallets/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WALLET_NAME_MAX_LENGTH = 50;
const WALLET_DESCRIPTION_MAX_LENGTH = 80;

type EditWalletModalProps = {
  wallet: Wallets;
};

export function EditWalletModal({ wallet }: EditWalletModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(wallet.name);
  const [description, setDescription] = useState(wallet.description ?? "");

  function resetForm() {
    setName(wallet.name);
    setDescription(wallet.description ?? "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await updateWallet(
      wallet.household_id,
      wallet.id,
      name,
      description,
    );
    if (result.success) {
      setOpen(false);
      resetForm();
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hover:border-blue-500 hover:text-blue-500"
          aria-label={`Edit ${wallet.name}`}
        >
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit wallet</DialogTitle>
            <DialogDescription>
              Update the name or description for this money source.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label htmlFor={`wallet-name-${wallet.id}`}>Name*</Label>
              <Input
                id={`wallet-name-${wallet.id}`}
                name="name"
                placeholder="mBank, Cash, Savings..."
                maxLength={WALLET_NAME_MAX_LENGTH}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
              />
            </Field>

            <Field>
              <Label htmlFor={`wallet-description-${wallet.id}`}>
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`wallet-description-${wallet.id}`}
                name="description"
                placeholder="Shared checking account..."
                maxLength={WALLET_DESCRIPTION_MAX_LENGTH}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
