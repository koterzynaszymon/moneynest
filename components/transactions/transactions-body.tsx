"use client";

import Link from "next/link";
import type { Category } from "@/lib/types/categories";
import type { Transactions } from "@/lib/types/transactions";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { deleteTransaction } from "@/lib/transactions/actions";
import { useRouter } from "next/navigation";
import EditTransactionModal from "./edit-transaction-modal";

type TransactionsBodyProps = {
  transactions: Transactions[];
  categories: Category[];
  currentPage: number;
  totalPages: number;
  householdId: string;
};

export function TransactionsBody({
  transactions,
  categories,
  currentPage,
  totalPages,
  householdId,
}: TransactionsBodyProps) {
  const router = useRouter();
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const previousPageHref = `/household/${householdId}/transactions?page=${currentPage - 1}`;
  const nextPageHref = `/household/${householdId}/transactions?page=${currentPage + 1}`;

  async function handleDeleteTransaction(
    e: React.MouseEvent<HTMLButtonElement>,
    transactionId: string,
  ) {
    e.stopPropagation();
    e.preventDefault();
    const confirmed = confirm(
      "Are you sure you want to delete this transaction?",
    );
    if (!confirmed) return;
    const result = await deleteTransaction(transactionId);
    if (result.success) {
      toast.success("Transaction deleted successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h1>No transactions found</h1>
        <p className="mb-2">Create your first transaction to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {transaction.description || "No description"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getCategoryType(transaction.category_id, categories)}
                >
                  {getCategoryName(transaction.category_id, categories)}
                </Badge>
              </TableCell>
              <TableCell
                className={`${getCategoryType(transaction.category_id, categories) === "income" ? "text-green-500" : "text-red-500"} text-right font-bold`}
              >
                {transaction.amount}
              </TableCell>
              <TableCell className="text-right w-28">
                <EditTransactionModal
                  transaction={transaction}
                  categories={categories}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:border-red-500 hover:text-red-500"
                  onClick={(e) => handleDeleteTransaction(e, transaction.id)}
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-3">
        {hasPreviousPage ? (
          <Button variant="outline" asChild>
            <Link href={previousPageHref}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Previous
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        {hasNextPage ? (
          <Button variant="outline" asChild>
            <Link href={nextPageHref}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </>
  );
}

function getCategoryType(categoryId: string, categories: Category[]) {
  return categories.find((category) => category.id === categoryId)?.type ===
    "income"
    ? "income"
    : "expense";
}

function getCategoryName(categoryId: string, categories: Category[]) {
  return categories.find((category) => category.id === categoryId)?.name;
}
