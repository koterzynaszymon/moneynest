import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HouseholdWithMemberCount } from "@/lib/types/household";
import { HouseholdMemberView } from "@/lib/types/user";
import { Users } from "lucide-react";
import EditHouseholdMembersModal from "./edit-household-members-modal";

function getInitials(name: string, email: string) {
  const label = name.trim() || email.trim() || "?";

  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type HouseholdHeaderProps = {
  household: HouseholdWithMemberCount;
  members: HouseholdMemberView[];
  isOwner: boolean;
};

export function HouseholdHeader({
  household,
  members,
  isOwner,
}: HouseholdHeaderProps) {
  const previewMembers = members.slice(0, 3);
  const hasPreviewMembers = previewMembers.length > 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 ">
          <Badge variant="secondary">Household</Badge>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {household.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Shared finance space for your members, categories, budgets, and
              transactions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>Currency: {household.currency}</span>
            <span>Members: {household.memberCount}</span>
          </div>
        </div>

        <div className="flex min-w-0 w-full flex-col items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3 sm:w-auto sm:flex-row sm:items-center sm:justify-around">
          <div className="flex -space-x-2">
            {hasPreviewMembers ? (
              previewMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-xs font-semibold text-primary"
                  title={member.name || member.email}
                >
                  {getInitials(member.name, member.email)}
                </div>
              ))
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-muted-foreground">
                0
              </div>
            )}
          </div>
          <div className="min-w-0 w-full sm:w-auto">
            <div className="mb-0.5 flex items-center justify-between gap-2 font-medium">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span>
                  {household.memberCount}{" "}
                  {household.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
              {isOwner ? (
                <EditHouseholdMembersModal
                  members={members}
                  householdId={household.id}
                />
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Manage who belongs in this household.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
