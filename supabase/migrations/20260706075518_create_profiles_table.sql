CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Anonymous',
    avatar_url TEXT NOT NULL DEFAULT 'https://placehold.co/600x400',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name) 
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles for select to authenticated using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
