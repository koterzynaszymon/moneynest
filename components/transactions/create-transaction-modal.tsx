"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

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
import type { Category } from "@/lib/types/categories";
import { TRANSACTION_DESCRIPTION_MAX_LENGTH } from "@/lib/transactions/constants";
import { transactionInputSchema } from "@/lib/transactions/schemas";
import { addTransaction } from "@/lib/transactions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreateTransactionModalProps = {
  householdId: string;
  categories: Category[];
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function CreateTransactionModal({
  householdId,
  categories,
}: CreateTransactionModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(getTodayDate());
  const [isLoading, setIsLoading] = useState(false);

  const hasCategories = categories.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = transactionInputSchema.safeParse({
        amount: amount ? Number(amount) : Number.NaN,
        transactionDate,
        description: description.trim(),
      });

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
        return;
      }

      const result = await addTransaction(
        householdId,
        categoryId,
        parsed.data.amount,
        parsed.data.description,
        parsed.data.transactionDate,
      );
      if (result.success) {
        setOpen(false);
        setCategoryId("");
        setAmount("");
        setDescription("");
        setTransactionDate(getTodayDate());
        toast.success("Transaction added successfully");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="householdId" value={householdId} />
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
            <DialogDescription>
              Log an income or expense for this household.
            </DialogDescription>
          </DialogHeader>

          {!hasCategories ? (
            <p className="mt-4 text-sm text-destructive">
              Create at least one category before adding transactions.
            </p>
          ) : (
            <FieldGroup className="mt-4 gap-4">
              <Field>
                <Label htmlFor="transaction-category">Category*</Label>
                <select
                  id="transaction-category"
                  name="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className={category.type === "income" ? "text-green-500" : "text-red-500"}>
                      {category.name} ({category.type})
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <Label htmlFor="transaction-amount">Amount (PLN)*</Label>
                <Input
                  id="transaction-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required  
                />
              </Field>

              <Field>
                <Label htmlFor="transaction-date">Date*</Label>
                <Input
                  id="transaction-date"
                  name="transactionDate"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="transaction-description">
                  Short description{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="transaction-description"
                  name="description"
                  placeholder="Weekly groceries, salary, rent..."
                  maxLength={TRANSACTION_DESCRIPTION_MAX_LENGTH}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </FieldGroup>
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!hasCategories || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
