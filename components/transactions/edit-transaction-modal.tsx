"use client";

import { useState } from "react";
import { Loader2, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { updateTransaction } from "@/lib/transactions/actions";
import { TRANSACTION_DESCRIPTION_MAX_LENGTH } from "@/lib/transactions/constants";
import type { Category } from "@/lib/types/categories";
import type { Transactions } from "@/lib/types/transactions";

type EditTransactionModalProps = {
  transaction: Transactions;
  categories: Category[];
};

function getDateInputValue(date: string) {
  return date.slice(0, 10);
}

export default function EditTransactionModal({
  transaction,
  categories,
}: EditTransactionModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(transaction.category_id);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description ?? "");
  const [transactionDate, setTransactionDate] = useState(
    getDateInputValue(transaction.transaction_date),
  );
  const [isLoading, setIsLoading] = useState(false);

  const hasCategories = categories.length > 0;

  function resetForm() {
    setCategoryId(transaction.category_id);
    setAmount(String(transaction.amount));
    setDescription(transaction.description ?? "");
    setTransactionDate(getDateInputValue(transaction.transaction_date));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateTransaction(
        transaction.id,
        categoryId,
        amount ? Number(amount) : 0,
        description.trim(),
        transactionDate,
      );
      if (result.success) {
        setOpen(false);
        toast.success("Transaction updated successfully");
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
          variant="outline"
          size="icon"
          className="hover:border-blue-500 hover:text-blue-500 mr-2"
        >
          <PencilIcon className="w-4 h-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
            <DialogDescription>
              Update the income or expense details for this household.
            </DialogDescription>
          </DialogHeader>

          {!hasCategories ? (
            <p className="mt-4 text-sm text-destructive">
              Create at least one category before editing transactions.
            </p>
          ) : (
            <FieldGroup className="mt-4 gap-4">
              <Field>
                <Label htmlFor={`transaction-category-${transaction.id}`}>
                  Category*
                </Label>
                <select
                  id={`transaction-category-${transaction.id}`}
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
                    <option
                      key={category.id}
                      value={category.id}
                      className={
                        category.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {category.name} ({category.type})
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <Label htmlFor={`transaction-amount-${transaction.id}`}>
                  Amount (PLN)*
                </Label>
                <Input
                  id={`transaction-amount-${transaction.id}`}
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
                <Label htmlFor={`transaction-date-${transaction.id}`}>
                  Date*
                </Label>
                <Input
                  id={`transaction-date-${transaction.id}`}
                  name="transactionDate"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor={`transaction-description-${transaction.id}`}>
                  Short description{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id={`transaction-description-${transaction.id}`}
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
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}