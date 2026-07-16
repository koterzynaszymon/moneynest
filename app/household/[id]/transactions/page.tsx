import { TransactionsHeader } from "@/components/transactions/transactions-header";
import { TransactionsBody } from "@/components/transactions/transactions-body";
import { getHouseholdById } from "@/lib/households/queries";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories/queries";
import { getTransactions } from "@/lib/transactions/queries";

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
  }>;
}) {
  const { id } = await params;
  const {
    page: pageParam,
    type: typeParam,
    sort: sortParam,
    order: orderParam,
  } = await searchParams;
  const parsedPage = Number(pageParam ?? 1);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const type =
    typeParam === "expense" || typeParam === "income" ? typeParam : "all";
  const sort = sortParam === "amount" ? sortParam : "date";
  const order = orderParam === "asc" ? orderParam : "desc";
  const household = await getHouseholdById(id);
  if (!household) {
    notFound();
  }
  const categories = await getCategories(id);
  const { transactions, totalPages } = await getTransactions(
    id,
    page,
    10,
    type,
    sort,
    order,
  );
  return (
    <div className="space-y-8">
      <TransactionsHeader householdId={id} categories={categories} />
      <TransactionsBody
        transactions={transactions}
        categories={categories}
        currentPage={page}
        totalPages={totalPages}
        householdId={id}
      />
    </div>
  );
}