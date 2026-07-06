create table public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

create index transaction_household_id_idx on public.transactions(household_id);
create index transaction_category_id_idx on public.transactions(category_id);
create index transaction_created_by_idx on public.transactions(created_by);
create index transaction_household_date_idx on public.transactions(household_id, transaction_date DESC);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view transactions"
on public.transactions FOR SELECT
TO authenticated
USING (public.is_household_member(household_id));

CREATE POLICY "Members can create transactions"
on public.transactions FOR INSERT
TO authenticated
WITH CHECK (
    public.is_household_member(household_id)
    AND created_by = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = category_id
        AND c.household_id = household_id
    )
);

CREATE POLICY "Members can update transactions"
on public.transactions FOR UPDATE
TO authenticated
USING (public.is_household_member(household_id))
WITH CHECK (
    public.is_household_member(household_id)
    AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = category_id
        AND c.household_id = household_id
    )
);

CREATE POLICY "Members can delete transactions"
on public.transactions FOR DELETE
TO authenticated
USING (public.is_household_member(household_id));