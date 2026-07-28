"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Amount } from "@/components/ui/amount";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBudget } from "@/lib/budgets/queries";
import {
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
} from "@/lib/transactions/queries";

type InsightsKpiStripProps = {
  householdId: string;
  currency: string;
  year: number;
  month: number;
};

type KpiValues = {
  spent: number;
  income: number;
  budgetTotal: number | null;
};

export function InsightsKpiStrip({
  householdId,
  currency,
  year,
  month,
}: InsightsKpiStripProps) {
  const [values, setValues] = useState<KpiValues | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadKpis() {
      const [spent, income, budgetResult] = await Promise.all([
        getMonthlyExpenseTotal(householdId, year, month),
        getMonthlyIncomeTotal(householdId, year, month),
        getBudget(householdId, year, month),
      ]);

      if (!isActive) {
        return;
      }

      setValues({
        spent,
        income,
        budgetTotal: budgetResult.success
          ? Number(budgetResult.budget.total_amount)
          : null,
      });
    }

    loadKpis();

    return () => {
      isActive = false;
    };
  }, [householdId, year, month]);

  if (!values) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCardSkeleton label="Spent this month" />
        <KpiCardSkeleton label="Income this month" />
        <KpiCardSkeleton label="Net" />
        <KpiCardSkeleton label="Budget left" />
      </section>
    );
  }

  const net = values.income - values.spent;
  const budgetLeft =
    values.budgetTotal !== null ? values.budgetTotal - values.spent : null;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Spent this month"
        value={
          <Amount value={values.spent} currency={currency} tone="expense" />
        }
      />
      <KpiCard
        label="Income this month"
        value={
          <Amount value={values.income} currency={currency} tone="income" />
        }
      />
      <KpiCard
        label="Net"
        value={<Amount value={net} currency={currency} tone="sign" showPlus />}
      />
      <KpiCard
        label="Budget left"
        value={
          budgetLeft !== null ? (
            <Amount value={budgetLeft} currency={currency} tone="sign" />
          ) : (
            "Not set"
          )
        }
      />
    </section>
  );
}

function KpiCard({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function KpiCardSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardDescription>{label}</CardDescription>
        <Skeleton className="h-7 w-24" />
      </CardHeader>
    </Card>
  );
}
