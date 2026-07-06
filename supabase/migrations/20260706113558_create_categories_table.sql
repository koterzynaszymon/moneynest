CREATE TYPE public.category_type AS ENUM ('income', 'expense');

create table public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type public.category_type NOT NULL DEFAULT 'expense',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, name, type)
);

create index category_household_id_idx on public.categories(household_id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view categories"
on public.categories FOR SELECT
TO authenticated
USING (public.is_household_member(household_id));

CREATE POLICY "Members can create categories"
on public.categories FOR INSERT
TO authenticated
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can update categories"
on public.categories FOR UPDATE
TO authenticated
USING (public.is_household_member(household_id))
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can delete categories"
on public.categories FOR DELETE
TO authenticated
USING (public.is_household_member(household_id));