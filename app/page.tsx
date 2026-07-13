import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";
import { ArrowRight, PiggyBank, PieChart, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const features = [
  {
    icon: Users,
    title: "Shared households",
    description:
      "Invite your family or flatmates and manage one budget together.",
  },
  {
    icon: Wallet,
    title: "Track every transaction",
    description: "Log income and expenses so nothing slips through the cracks.",
  },
  {
    icon: PieChart,
    title: "Clear insights",
    description: "See where the money goes with categories and budgets.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="sticky top-0 z-50 w-full flex justify-center border-b border-border/60 bg-background/70 backdrop-blur-md">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm h-16">
            <Link href={"/"} className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <PiggyBank className="h-5 w-5" />
              </span>
              <span className="font-display text-base">MoneyNest</span>
            </Link>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-16 items-center w-full max-w-5xl px-5 py-20">
          <section className="flex flex-col gap-6 items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Shared household finance, made simple
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Manage money together in your{" "}
              <span className="text-primary">MoneyNest</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Track shared expenses, set budgets, and stay on the same page with
              the people you share a home with.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" variant="brand">
                <Link href="/dashboard">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
          </section>

          <section className="grid w-full gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t border-border/60 mx-auto text-center text-xs py-8">
        <p className="text-muted-foreground">
          &copy; 2026 MoneyNest. All rights reserved.
        </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
