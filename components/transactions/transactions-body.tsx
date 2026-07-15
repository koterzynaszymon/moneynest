import { getTransactions } from "@/lib/transactions/queries";
import type { Category } from "@/lib/types/categories";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "../ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Badge } from "../ui/badge";

export async function TransactionsBody({ householdId, categories }: { householdId: string, categories: Category[] }) {

    const transactions = await getTransactions(householdId);
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <h1>No transactions found</h1>
                <p className="mb-2">Create your first transaction to get started.</p>
            </div>
        );
    }
    return (
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
                <Badge variant={getCategoryType(transaction.category_id, categories)}>
                  {getCategoryName(transaction.category_id, categories)}
                </Badge>
              </TableCell>
              <TableCell className={`${getCategoryType(transaction.category_id, categories) === "income" ? "text-green-500" : "text-red-500"} text-right font-bold`}>{transaction.amount}</TableCell>
              <TableCell className="text-right w-28">
                <Button variant="outline" size="icon" className="hover:border-blue-500 hover:text-blue-500 mr-2">
                    <PencilIcon className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:border-red-500 hover:text-red-500"
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}

function getCategoryType(categoryId: string, categories: Category[]) {
    return categories.find((category) => category.id === categoryId)?.type === "income" ? "income" : "expense";
}

function getCategoryName(categoryId: string, categories: Category[]) {
    return categories.find((category) => category.id === categoryId)?.name;
}