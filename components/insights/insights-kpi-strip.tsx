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

  const net = values ? values.income - values.spent : 0;
  const budgetLeft =
    values && values.budgetTotal !== null
      ? values.budgetTotal - values.spent
      : null;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Spent this month"
        value={
          values ? (
            <Amount value={values.spent} currency={currency} tone="expense" />
          ) : (
            "Loading..."
          )
        }
      />
      <KpiCard
        label="Income this month"
        value={
          values ? (
            <Amount value={values.income} currency={currency} tone="income" />
          ) : (
            "Loading..."
          )
        }
      />
      <KpiCard
        label="Net"
        value={
          values ? (
            <Amount value={net} currency={currency} tone="sign" showPlus />
          ) : (
            "Loading..."
          )
        }
      />
      <KpiCard
        label="Budget left"
        value={
          values ? (
            budgetLeft !== null ? (
              <Amount value={budgetLeft} currency={currency} tone="sign" />
            ) : (
              "Not set"
            )
          ) : (
            "Loading..."
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
