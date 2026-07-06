CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    year INT NOT NULL CHECK (year >= 2000 AND year <= 2100),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, year, month)
);

CREATE INDEX budget_household_id_idx ON public.budgets(household_id);
CREATE INDEX budget_household_period_idx ON public.budgets(household_id, year DESC, month DESC);
CREATE TABLE public.category_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (budget_id, category_id)
);
CREATE INDEX category_budget_budget_id_idx ON public.category_budgets(budget_id);
CREATE INDEX category_budget_category_id_idx ON public.category_budgets(category_id);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_budgets ENABLE ROW LEVEL SECURITY;
-- BUDGETS POLICIES

CREATE POLICY "Members can view budgets"
on public.budgets FOR SELECT
TO authenticated
USING (public.is_household_member(household_id));

CREATE POLICY "Members can create budgets"
on public.budgets FOR INSERT
TO authenticated
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can update budgets"
on public.budgets FOR UPDATE
TO authenticated
USING (public.is_household_member(household_id))
WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "Members can delete budgets"
on public.budgets FOR DELETE
TO authenticated
USING (public.is_household_member(household_id));

-- CATEGORY BUDGETS POLICIES

CREATE POLICY "Members can view category budgets"
on public.category_budgets FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND public.is_household_member(b.household_id)
    )
);

CREATE POLICY "Members can create category budgets"
ON public.category_budgets FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.budgets b
        JOIN public.categories c
            ON c.household_id = b.household_id
            AND c.id = category_id
        WHERE b.id = budget_id
        AND public.is_household_member(b.household_id)
        AND c.type = 'expense'
    )
);

CREATE POLICY "Members can update category budgets"
ON public.category_budgets FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND public.is_household_member(b.household_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.budgets b
        JOIN public.categories c
            ON c.household_id = b.household_id
            AND c.id = category_id
        WHERE b.id = budget_id
        AND public.is_household_member(b.household_id)
        AND c.type = 'expense'
    )
);


CREATE POLICY "Members can delete category budgets"
ON public.category_budgets FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND public.is_household_member(b.household_id)
    )
);