"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { getThemedChartOptions } from "@/lib/charts/theme";
import { useChartTheme } from "@/lib/charts/use-chart-theme";
import {
  getWeeklyExpenseTotals,
  type WeeklyExpenseTotals,
} from "@/lib/transactions/queries";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function WeekByWeekSpendingChart({
  householdId,
  year,
  month,
}: {
  householdId: string;
  year: number;
  month: number;
}) {
  const colors = useChartTheme();
  const [weeklyExpenseTotals, setWeeklyExpenseTotals] =
    useState<WeeklyExpenseTotals | null>(null);

  useEffect(() => {
    let isActive = true;

    if (householdId && year && month) {
      getWeeklyExpenseTotals(householdId, year, month).then((totals) => {
        if (isActive) {
          setWeeklyExpenseTotals(totals);
        }
      });
    }

    return () => {
      isActive = false;
    };
  }, [householdId, year, month]);

  if (!weeklyExpenseTotals) {
    return <BarChartSkeleton />;
  }

  const hasSpending = weeklyExpenseTotals.values.some((value) => value > 0);

  if (!hasSpending) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No weekly spending for this month yet.
      </div>
    );
  }

  const data: ChartData<"bar"> = {
    labels: weeklyExpenseTotals.labels,
    datasets: [
      {
        label: "Spent",
        data: weeklyExpenseTotals.values,
        backgroundColor: colors.barFill,
        borderColor: colors.barBorder,
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="h-64">
      <Bar data={data} options={getThemedChartOptions(colors)} />
    </div>
  );
}
