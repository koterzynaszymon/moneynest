"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { WeekByWeekSpendingChart } from "./week-by-week-spending-chart";

export function InsightsBody({ householdId }: { householdId: string }) {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  return (
  <div className="space-y-6 mt-6">
    <section className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Week by week spending</CardTitle>
          <CardDescription>
            View your spending by week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeekByWeekSpendingChart householdId={householdId} year={year} month={month} />
        </CardContent>
        </Card>
      </section>
    </div>
  );
}