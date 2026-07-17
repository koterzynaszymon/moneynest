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
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { deleteTransaction } from "@/lib/transactions/actions";
import { useRouter, useSearchParams } from "next/navigation";
import EditTransactionModal from "./edit-transaction-modal";

type TransactionTypeFilter = "all" | "expense" | "income";
type TransactionSort = "date" | "amount";
type TransactionOrder = "asc" | "desc";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const filterType = getTransactionTypeFilter(searchParams.get("type"));
  const filterSort = getTransactionSort(searchParams.get("sort"));
  const filterOrder = getTransactionOrder(searchParams.get("order"));

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

  return (
    <>
      <div className="flex items-center justify-end gap-3 mb-4">
        <Button
          variant={filterType === "all" ? "secondary" : "outline"}
          asChild
        >
          <Link
            href={buildTransactionsFilterUrl(householdId, {
              type: "all",
              sort: filterSort,
              order: filterOrder,
            })}
            replace
          >
            All
          </Link>
        </Button>
        <Button
          variant={filterType === "expense" ? "secondary" : "outline"}
          asChild
        >
          <Link
            href={buildTransactionsFilterUrl(householdId, {
              type: "expense",
              sort: filterSort,
              order: filterOrder,
            })}
            replace
          >
            Expenses
          </Link>
        </Button>
        <Button
          variant={filterType === "income" ? "secondary" : "outline"}
          asChild
        >
          <Link
            href={buildTransactionsFilterUrl(householdId, {
              type: "income",
              sort: filterSort,
              order: filterOrder,
            })}
            replace
          >
            Income
          </Link>
        </Button>
      </div>
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <h1>No transactions found</h1>
          <p className="mb-2">Create your first transaction to get started.</p>
        </div>
      ) : (
        <>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={buildTransactionsFilterUrl(householdId, {
                    type: filterType,
                    sort: "date",
                    order: getNextSortOrder("date", filterSort, filterOrder),
                  })}
                  replace
                >
                  Date
                  <SortIcon
                    sort="date"
                    activeSort={filterSort}
                    order={filterOrder}
                  />
                </Link>
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <Link
                  href={buildTransactionsFilterUrl(householdId, {
                    type: filterType,
                    sort: "amount",
                    order: getNextSortOrder("amount", filterSort, filterOrder),
                  })}
                  replace
                >
                  Amount
                  <SortIcon
                    sort="amount"
                    activeSort={filterSort}
                    order={filterOrder}
                  />
                </Link>
              </Button>
            </TableHead>
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
            <Link
              href={buildTransactionsFilterUrl(householdId, {
                page: currentPage - 1,
                type: filterType,
                sort: filterSort,
                order: filterOrder,
              })}
            >
              Previous
            </Link>
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
            <Link
              href={buildTransactionsFilterUrl(householdId, {
                page: currentPage + 1,
                type: filterType,
                sort: filterSort,
                order: filterOrder,
              })}
            >
              Next
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
        </>
      )}
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

function getTransactionTypeFilter(value: string | null): TransactionTypeFilter {
  if (value === "expense" || value === "income") return value;
  return "all";
}

function getTransactionSort(value: string | null): TransactionSort {
  if (value === "amount") return value;
  return "date";
}

function getTransactionOrder(value: string | null): TransactionOrder {
  if (value === "asc") return value;
  return "desc";
}

function getNextSortOrder(
  targetSort: TransactionSort,
  currentSort: TransactionSort,
  currentOrder: TransactionOrder,
): TransactionOrder {
  if (targetSort !== currentSort) return "desc";
  return currentOrder === "asc" ? "desc" : "asc";
}

function SortIcon({
  sort,
  activeSort,
  order,
}: {
  sort: TransactionSort;
  activeSort: TransactionSort;
  order: TransactionOrder;
}) {
  if (sort !== activeSort) {
    return <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />;
  }

  return order === "asc" ? (
    <ArrowUpIcon className="h-4 w-4" />
  ) : (
    <ArrowDownIcon className="h-4 w-4" />
  );
}

function buildTransactionsFilterUrl(
  householdId: string,
  params: {
    page?: number;
    type?: TransactionTypeFilter;
    sort?: TransactionSort;
    order?: TransactionOrder;
  },
) {
  const search = new URLSearchParams();

  if (params.page && params.page > 1) {
    search.set("page", params.page.toString());
  }
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);

  const qs = search.toString();
  return `/household/${householdId}/transactions${qs ? `?${qs}` : ""}`;
}