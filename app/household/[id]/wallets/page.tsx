import { WalletsHeader } from "@/components/wallets/wallets-header";
import { getHouseholdById } from "@/lib/households/queries";
import { getWallets } from "@/lib/wallets/queries";
import { notFound } from "next/navigation";
import { WalletsBody } from "@/components/wallets/wallets-body";

export default async function WalletsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const household = await getHouseholdById(id);
  if (!household) {
    notFound();
  }
  const wallets = await getWallets(id);
  return (
    <div className="space-y-8">
      <WalletsHeader
        householdId={id}
        householdName={household.name}
        walletCount={wallets.length}
      />
      <WalletsBody householdId={household.id} wallets={wallets} />
    </div>
  );
}