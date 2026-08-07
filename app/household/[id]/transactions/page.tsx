import { TransactionsHeader } from "@/components/transactions/transactions-header";
import { TransactionsBody } from "@/components/transactions/transactions-body";
import { getHouseholdById } from "@/lib/households/queries";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories/queries";
import { getTransactions } from "@/lib/transactions/queries";
import { getWallets } from "@/lib/wallets/queries";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    type?: string;
    sort?: string;
    order?: string;
    year?: string;
    month?: string;
  }>;
}) {
  const { id } = await params;
  const {
    page: pageParam,
    type: typeParam,
    sort: sortParam,
    order: orderParam,
    year: yearParam,
    month: monthParam,
  } = await searchParams;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const parsedPage = Number(pageParam ?? 1);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const type =
    typeParam === "expense" || typeParam === "income" ? typeParam : "all";
  const sort = sortParam === "amount" ? sortParam : "date";
  const order = orderParam === "asc" ? orderParam : "desc";
  const parsedYear = Number(yearParam);
  const parsedMonth = Number(monthParam);
  const hasValidYear =
    Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100;
  const hasValidMonth =
    Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12;
  const requestedYear = hasValidYear ? parsedYear : currentYear;
  const requestedMonth = hasValidMonth ? parsedMonth : currentMonth;
  const isFutureMonth =
    requestedYear > currentYear ||
    (requestedYear === currentYear && requestedMonth > currentMonth);
  const year = isFutureMonth ? currentYear : requestedYear;
  const month = isFutureMonth ? currentMonth : requestedMonth;
  const household = await getHouseholdById(id);
  if (!household) {
    notFound();
  }
  const categories = await getCategories(id);
  const wallets = await getWallets(id);
  const { transactions, totalPages } = await getTransactions(
    id,
    page,
    10,
    type,
    sort,
    order,
    year,
    month,
  );
  return (
    <div className="space-y-8">
      <TransactionsHeader
        householdId={id}
        categories={categories}
        wallets={wallets}
      />
      <TransactionsBody
        transactions={transactions}
        categories={categories}
        wallets={wallets}
        currentPage={page}
        totalPages={totalPages}
        householdId={id}
        year={year}
        month={month}
      />
    </div>
  );
}