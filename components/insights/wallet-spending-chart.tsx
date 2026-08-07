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
  getWalletExpenseTotals,
  type WalletExpenseTotals,
} from "@/lib/transactions/queries";

ChartJS.register(ArcElement, Tooltip, Legend);

type WalletSpendingChartProps = {
  householdId: string;
  year: number;
  month: number;
};

export function WalletSpendingChart({
  householdId,
  year,
  month,
}: WalletSpendingChartProps) {
  const colors = useChartTheme();
  const [walletExpenseTotals, setWalletExpenseTotals] =
    useState<WalletExpenseTotals | null>(null);

  useEffect(() => {
    let isActive = true;

    if (householdId && year && month) {
      getWalletExpenseTotals(householdId, year, month).then((totals) => {
        if (isActive) {
          setWalletExpenseTotals(totals);
        }
      });
    }

    return () => {
      isActive = false;
    };
  }, [householdId, year, month]);

  if (!walletExpenseTotals) {
    return <DoughnutChartSkeleton />;
  }

  if (walletExpenseTotals.values.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No wallet spending for this month yet.
      </div>
    );
  }

  const data: ChartData<"doughnut"> = {
    labels: walletExpenseTotals.labels,
    datasets: [
      {
        label: "Spent",
        data: walletExpenseTotals.values,
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
