"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { deleteHousehold } from "@/lib/households/actions";
import Link from "next/link";
import { ArrowRight, Coins, Trash2, Users } from "lucide-react";

import { useRouter } from "next/navigation";

export function HouseholdCard({
  id,
  name,
  currency,
  memberCount,
  isOwner,
}: {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  async function handleDelete() {
    const confirmed = confirm(
      `Delete "${name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setIsLoading(true);
    const result = await deleteHousehold(id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Users className="h-4 w-4" />
          </span>
          <CardTitle className="font-display text-lg">{name}</CardTitle>
        </div>
        {isOwner ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive text-destructive"
            onClick={() => handleDelete()}
            disabled={isLoading}
            aria-label={`Delete ${name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-between">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Coins className="h-4 w-4" />
          {currency}
        </span>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/household/${id}`}>
            View household
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
