"use client";

import Link from "next/link";
import type { Category } from "@/lib/types/categories";
import type { Transactions } from "@/lib/types/transactions";
import type { Wallets } from "@/lib/types/wallets";
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
  ChevronLeftIcon,
  ChevronRightIcon,
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
  wallets: Wallets[];
  currentPage: number;
  totalPages: number;
  householdId: string;
  year: number;
  month: number;
};

export function TransactionsBody({
  transactions,
  categories,
  wallets,
  currentPage,
  totalPages,
  householdId,
  year,
  month,
}: TransactionsBodyProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const filterType = getTransactionTypeFilter(searchParams.get("type"));
  const filterSort = getTransactionSort(searchParams.get("sort"));
  const filterOrder = getTransactionOrder(searchParams.get("order"));
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isCurrentMonth = year === currentYear && month === currentMonth;
  const previousMonth = shiftMonth(year, month, -1);
  const nextMonth = shiftMonth(year, month, 1);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={buildTransactionsFilterUrl(householdId, {
                type: filterType,
                sort: filterSort,
                order: filterOrder,
                year: previousMonth.year,
                month: previousMonth.month,
              })}
              replace
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <span className="min-w-36 text-center text-sm font-medium">
            {monthLabel}
          </span>
          {isCurrentMonth ? (
            <Button variant="outline" size="icon" disabled aria-label="Next month">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={buildTransactionsFilterUrl(householdId, {
                  type: filterType,
                  sort: filterSort,
                  order: filterOrder,
                  year: nextMonth.year,
                  month: nextMonth.month,
                })}
                replace
                aria-label="Next month"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant={filterType === "all" ? "secondary" : "outline"}
            asChild
          >
            <Link
              href={buildTransactionsFilterUrl(householdId, {
                type: "all",
                sort: filterSort,
                order: filterOrder,
                year,
                month,
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
                year,
                month,
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
                year,
                month,
              })}
              replace
            >
              Income
            </Link>
          </Button>
        </div>
      </div>
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <h1>No transactions found</h1>
          <p className="mb-2">
            {isCurrentMonth
              ? "Create your first transaction to get started."
              : `No transactions for ${monthLabel}.`}
          </p>
        </div>
      ) : (
        <>
      <Table>
        <TableCaption>A list of your transactions for {monthLabel}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={buildTransactionsFilterUrl(householdId, {
                    type: filterType,
                    sort: "date",
                    order: getNextSortOrder("date", filterSort, filterOrder),
                    year,
                    month,
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
            <TableHead>Wallet</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <Link
                  href={buildTransactionsFilterUrl(householdId, {
                    type: filterType,
                    sort: "amount",
                    order: getNextSortOrder("amount", filterSort, filterOrder),
                    year,
                    month,
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
              <TableCell className="text-muted-foreground">
                {getWalletName(transaction.wallet_id, wallets)}
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
                  wallets={wallets}
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
                year,
                month,
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
                year,
                month,
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

function getWalletName(walletId: string | null, wallets: Wallets[]) {
  if (!walletId) return "—";
  return wallets.find((wallet) => wallet.id === walletId)?.name ?? "—";
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

function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function buildTransactionsFilterUrl(
  householdId: string,
  params: {
    page?: number;
    type?: TransactionTypeFilter;
    sort?: TransactionSort;
    order?: TransactionOrder;
    year?: number;
    month?: number;
  },
) {
  const search = new URLSearchParams();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (params.page && params.page > 1) {
    search.set("page", params.page.toString());
  }
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);
  if (
    params.year !== undefined &&
    params.month !== undefined &&
    (params.year !== currentYear || params.month !== currentMonth)
  ) {
    search.set("year", params.year.toString());
    search.set("month", params.month.toString());
  }

  const qs = search.toString();
  return `/household/${householdId}/transactions${qs ? `?${qs}` : ""}`;
}