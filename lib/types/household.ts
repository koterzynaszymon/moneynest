export type Household = {
  id: string;
  name: string;
  owner_id: string;
  currency: string;
  created_at: string;
  updated_at: string;    
}

export type HouseholdWithMemberCount = Household & {
  memberCount: number;
};