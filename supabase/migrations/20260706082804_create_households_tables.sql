CREATE TABLE public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'PLN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX household_owner_id_idx on public.households (owner_id);

CREATE TABLE public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX household_members_household_id_idx on public.household_members(household_id);
CREATE INDEX household_members_member_id_idx on public.household_members(member_id);

CREATE OR REPLACE FUNCTION public.is_household_member(household_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_id = $1
    AND member_id = auth.uid()
);
$$;


alter table public.households enable row level security;
alter table public.household_members enable row level security;

-- HOUSEHOLDS POLICIES

CREATE POLICY "Owners can view their households"
ON public.households FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Members can view their households"
ON public.households FOR SELECT
USING (public.is_household_member(id));

CREATE POLICY "Users can create households"
ON public.households FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their households"
on public.households FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- HOUSEHOLD MEMBERS POLICIES

CREATE POLICY "Members can view their household members"
ON public.household_members FOR SELECT
TO authenticated
USING (public.is_household_member(household_id));

CREATE POLICY "Owners can add members to their households"
ON public.household_members FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.households
        WHERE id = household_id
        AND owner_id = auth.uid()
    )
);

CREATE POLICY "Owners can remove members from their households"
on public.household_members FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.households
        WHERE id = household_id
        AND owner_id = auth.uid()
    )
);
