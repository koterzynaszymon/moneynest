export type HouseholdMemberView = {
    user_id: string;
    role: "owner" | "member";
    email: string;
    name: string;
    avatar_url: string;
}

export type HouseholdMemberRow = {
  member_id: string;
  role: "owner" | "member";
  profiles: {
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  } | null;
};