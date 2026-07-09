create or replace function public.get_user_id_by_email_for_household(p_household_id uuid, p_email text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
found_user_id uuid;
begin
    if auth.uid() is null then
    raise exception 'User not authenticated';
    end if;

    if not exists (
    select 1
    from public.households h
    where h.id = p_household_id
      and h.owner_id = auth.uid()
  ) then
    raise exception 'Not household owner';
  end if;
  select p.id
  into found_user_id
  from public.profiles p
  where lower(trim(p.email)) = lower(trim(p_email))
  limit 1;
  return found_user_id;
end;
$$;

revoke all on function public.get_user_id_by_email_for_household(uuid, text) from public;
grant execute on function public.get_user_id_by_email_for_household(uuid, text) to authenticated;