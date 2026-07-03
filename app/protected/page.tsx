import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

async function ProtectedContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <p className="text-foreground/60">
      You are signed in as{" "}
      <span className="font-medium text-foreground">{data.claims.email}</span>.
    </p>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Protected</h1>
      <Suspense fallback={<p className="text-foreground/60">Loading…</p>}>
        <ProtectedContent />
      </Suspense>
    </div>
  );
}
