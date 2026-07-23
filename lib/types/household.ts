import type { Database } from "./database";

export type Household = Database["public"]["Tables"]["households"]["Row"];

export type HouseholdWithMemberCount = Household & {
  memberCount: number;
};