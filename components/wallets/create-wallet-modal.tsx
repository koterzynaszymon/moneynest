"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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

const WALLET_NAME_MAX_LENGTH = 50;
const WALLET_DESCRIPTION_MAX_LENGTH = 80;

type CreateWalletModalProps = {
  householdId: string;
};

export function CreateWalletModal({ householdId }: CreateWalletModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function resetForm() {
    setName("");
    setDescription("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // UI only for now — wire createWallet(householdId, name, description) next.
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="h-4 w-4" />
          Add wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="householdId" value={householdId} />
          <DialogHeader>
            <DialogTitle>Add wallet</DialogTitle>
            <DialogDescription>
              Create a money source for this household, like a bank account or
              cash.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label htmlFor="wallet-name">Name*</Label>
              <Input
                id="wallet-name"
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
              <Label htmlFor="wallet-description">
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="wallet-description"
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
            <Button type="submit">Add wallet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
