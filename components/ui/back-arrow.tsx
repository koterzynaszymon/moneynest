"use client";

import { Button } from "./button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackArrow() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 justify-start w-fit hover:bg-transparent hover:text-foreground"
      onClick={() => router.back()}
    >
      <MoveLeft className="w-4 h-4" />
      <p className="text-sm font-medium">Back</p>
    </Button>
  );
}
