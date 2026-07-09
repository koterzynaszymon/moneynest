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

import { useRouter } from "next/navigation";

export function HouseholdCard({
  id,
  name,
  currency,
  memberCount,
}: {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
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
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Members: {memberCount}</p>
        <p>Currency: {currency}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-4">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => handleDelete()}
          disabled={isLoading}
        >
          Delete Household
        </Button>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/household/${id}`}>View Household</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
