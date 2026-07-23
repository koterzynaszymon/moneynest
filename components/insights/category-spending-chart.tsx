"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  getThemedDoughnutChartOptions,
} from "@/lib/charts/theme";
import { useChartTheme } from "@/lib/charts/use-chart-theme";
import {
  getCategoryExpenseTotals,
  type CategoryExpenseTotals,
} from "@/lib/transactions/queries";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategorySpendingChartProps = {
  householdId: string;
  year: number;
  month: number;
};

export function CategorySpendingChart({
  householdId,
  year,
  month,
}: CategorySpendingChartProps) {
  const colors = useChartTheme();
  const [categoryExpenseTotals, setCategoryExpenseTotals] =
    useState<CategoryExpenseTotals | null>(null);

  useEffect(() => {
    if (householdId && year && month) {
      getCategoryExpenseTotals(householdId, year, month).then(
        setCategoryExpenseTotals,
      );
    }
  }, [householdId, year, month]);

  const data: ChartData<"doughnut"> = {
    labels: categoryExpenseTotals?.labels ?? [],
    datasets: [
      {
        label: "Spent",
        data: categoryExpenseTotals?.values ?? [],
        backgroundColor: colors.chartColors,
        borderColor: colors.tooltipText,
        borderWidth: 2,
      },
    ],
  };

  if (!categoryExpenseTotals || categoryExpenseTotals.values.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No category spending for this month yet.
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={getThemedDoughnutChartOptions(colors)} />
    </div>
  );
}
