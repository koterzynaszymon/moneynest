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
import { DoughnutChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { getThemedDoughnutChartOptions } from "@/lib/charts/theme";
import { useChartTheme } from "@/lib/charts/use-chart-theme";
import {
  getCategoryIncomeTotals,
  type CategoryIncomeTotals,
} from "@/lib/transactions/queries";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryIncomeChartProps = {
  householdId: string;
  year: number;
  month: number;
};

export function CategoryIncomeChart({
  householdId,
  year,
  month,
}: CategoryIncomeChartProps) {
  const colors = useChartTheme();
  const [categoryIncomeTotals, setCategoryIncomeTotals] =
    useState<CategoryIncomeTotals | null>(null);

  useEffect(() => {
    let isActive = true;

    if (householdId && year && month) {
      getCategoryIncomeTotals(householdId, year, month).then((totals) => {
        if (isActive) {
          setCategoryIncomeTotals(totals);
        }
      });
    }

    return () => {
      isActive = false;
    };
  }, [householdId, year, month]);

  if (!categoryIncomeTotals) {
    return <DoughnutChartSkeleton />;
  }

  if (categoryIncomeTotals.values.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No category income for this month yet.
      </div>
    );
  }

  const data: ChartData<"doughnut"> = {
    labels: categoryIncomeTotals.labels,
    datasets: [
      {
        label: "Income",
        data: categoryIncomeTotals.values,
        backgroundColor: colors.chartColors,
        borderColor: colors.tooltipText,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={getThemedDoughnutChartOptions(colors)} />
    </div>
  );
}
