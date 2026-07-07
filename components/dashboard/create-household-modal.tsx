"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createHousehold } from "@/lib/households/actions";
import { toast } from "sonner";

export default function CreateHouseholdModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [householdName, setHouseholdName] = useState("My home");
  const [currency, setCurrency] = useState("PLN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setError(null);
    e.preventDefault();
    if (!householdName.trim() || householdName.trim().length < 3) {
      setError("Household name must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const result = await createHousehold(householdName, currency);
    if (result.success) {
      router.refresh();
      setOpen(false);
      toast.success("Your household has been created successfully");
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setIsLoading(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="" onClick={() => setOpen(true)}>
          Create Household
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Household</DialogTitle>
            <DialogDescription>
              Create a new household to start tracking your finances.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Household Name</Label>
              <Input
                id="name-1"
                name="name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="username-1">Currency</Label>
              <Input
                id="username-1"
                name="username"
                defaultValue="PLN"
                disabled
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Household"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
