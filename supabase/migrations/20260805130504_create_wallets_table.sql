CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (household_id, name)
);

CREATE INDEX wallets_household_id_idx ON public.wallets(household_id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view wallets"
on public.wallets FOR SELECT
TO authenticated
USING (public.is_household_member(household_id));

CREATE POLICY "Members can create wallets"
on public.wallets FOR INSERT
TO authenticated
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can update wallets"
on public.wallets FOR UPDATE
TO authenticated
USING (public.is_household_member(household_id))
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can delete wallets"
on public.wallets FOR DELETE
TO authenticated
USING (public.is_household_member(household_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.wallets TO authenticated;
