"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CategoryIncomeChart } from "./category-income-chart";
import { CategorySpendingChart } from "./category-spending-chart";
import { WeekByWeekSpendingChart } from "./week-by-week-spending-chart";

export function InsightsBody({ householdId }: { householdId: string }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-4 md:grid-cols-2 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Week by week spending</CardTitle>
            <CardDescription>View your spending by week.</CardDescription>
          </CardHeader>
          <CardContent>
            <WeekByWeekSpendingChart
              householdId={householdId}
              year={year}
              month={month}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by category</CardTitle>
            <CardDescription>
              See which categories take the biggest share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategorySpendingChart
              householdId={householdId}
              year={year}
              month={month}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income by category</CardTitle>
            <CardDescription>
              See which income sources contributed this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryIncomeChart
              householdId={householdId}
              year={year}
              month={month}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}