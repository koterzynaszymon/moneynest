import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { PiggyBank } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
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

        <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl p-5">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs py-8">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
