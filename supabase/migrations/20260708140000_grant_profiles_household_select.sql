grant select on table public.profiles to authenticated;

drop policy if exists "Household members can view each other's profiles"
on public.profiles;

create policy "Household members can view each other's profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.household_members hm1
    join public.household_members hm2
      on hm1.household_id = hm2.household_id
    where hm1.member_id = auth.uid()
      and hm2.member_id = public.profiles.id
  )
);