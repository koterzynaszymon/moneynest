ALTER TABLE public.transactions ADD COLUMN wallet_id UUID REFERENCES public.wallets(id) ON DELETE RESTRICT;

CREATE INDEX transaction_wallet_id_idx ON public.transactions(wallet_id);

DROP POLICY "Members can create transactions" ON public.transactions;
DROP POLICY "Members can update transactions" ON public.transactions;

CREATE POLICY "Members can create transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (
    public.is_household_member(household_id)
    AND created_by = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = category_id
        AND c.household_id = household_id
    )
    AND (
        wallet_id IS NULL
        OR EXISTS (
            SELECT 1 FROM public.wallets w
            WHERE w.id = wallet_id
            AND w.household_id = household_id
        )
    )
);

CREATE POLICY "Members can update transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (public.is_household_member(household_id))
WITH CHECK (
    public.is_household_member(household_id)
    AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = category_id
        AND c.household_id = household_id
    )
    AND (
        wallet_id IS NULL
        OR EXISTS (
            SELECT 1 FROM public.wallets w
            WHERE w.id = wallet_id
            AND w.household_id = household_id
        )
    )
);