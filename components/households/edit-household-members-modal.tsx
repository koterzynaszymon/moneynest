"use client";

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
import { Delete, Edit, Trash, Trash2 } from "lucide-react";
import { HouseholdMemberView } from "@/lib/types/user";
import { useState } from "react";
import { addHouseholdMember, removeHouseholdMember } from "@/lib/households/actions";
import { toast } from "sonner";

export default function EditHouseholdMembersModal({
  householdId,
  members,
}: {
  householdId: string;
  members: HouseholdMemberView[];
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedEmail = email.trim().toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isAlreadyAMember = members.some(
    (member) => member.email.trim().toLowerCase() === normalizedEmail,
  );
  const isSubmitDisabled =
    !email.trim() || !isValidEmail || isAlreadyAMember || isLoading;



  async function handleRemoveMember(memberId: string) {

    if(confirm("Are you sure you want to remove this member from the household?")) {  
      const result = await removeHouseholdMember(householdId, memberId);
      if(result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    }
  }

  async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
    setError(null);
    e.preventDefault();
    setIsLoading(true);

    const result = await addHouseholdMember(householdId, normalizedEmail);
    if (result.success) {
      toast.success(result.message);
      setEmail("");
      setIsLoading(false);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setIsLoading(false);
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Edit className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleAddMember}>
          <DialogHeader>
            <DialogTitle>Current Household Members</DialogTitle>
            <DialogDescription>
              Manage the members of your household.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4 mt-3">
            <Field>
              <div className="">
                {members.map((member) => (
                  <div
                    key={member.user_id}
                    className="grid grid-cols-[minmax(0,1fr)_5rem_2.5rem] items-center gap-3 mb-2"
                  >
                    <span className="truncate">{member.email}</span>
                    <span className="text-sm text-muted-foreground text-right">
                      {member.role === "owner" ? "Owner" : "Member"}
                    </span>
                    <button type="button" className="justify-self-end" onClick={() => handleRemoveMember(member.user_id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </Field>
            <Field className="">
              <h3 className="text-sm font-medium text-center">
                Add New Member
              </h3>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </Field>
            {normalizedEmail && !isValidEmail && (
              <p className="text-sm text-red-500">
                Please enter a valid email address
              </p>
            )}
            {normalizedEmail && isAlreadyAMember && (
              <p className="text-sm text-red-500">
                This email is already a member of the household
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </FieldGroup>
          <DialogFooter className="mt-4 mb-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isLoading ? "Adding user..." : "Add user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
