create type public.app_role as enum (
  'tourist', 'site_manager', 'governorate_analyst', 'governorate_admin', 'national_admin'
);

create table public.governorates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_en text not null,
  name_ar text not null,
  created_at timestamptz not null default now()
);

insert into public.governorates (code, name_en, name_ar) values
  ('CAI', 'Cairo', 'القاهرة'), ('ALX', 'Alexandria', 'الإسكندرية'),
  ('GIZ', 'Giza', 'الجيزة'), ('QLY', 'Qalyubia', 'القليوبية'),
  ('PSD', 'Port Said', 'بورسعيد'), ('SUZ', 'Suez', 'السويس'),
  ('DKH', 'Dakahlia', 'الدقهلية'), ('SHR', 'Sharqia', 'الشرقية'),
  ('GHR', 'Gharbia', 'الغربية'), ('MNF', 'Monufia', 'المنوفية'),
  ('BEH', 'Beheira', 'البحيرة'), ('ISM', 'Ismailia', 'الإسماعيلية'),
  ('DAM', 'Damietta', 'دمياط'), ('KFS', 'Kafr El Sheikh', 'كفر الشيخ'),
  ('FAY', 'Faiyum', 'الفيوم'), ('BNS', 'Beni Suef', 'بني سويف'),
  ('MNY', 'Minya', 'المنيا'), ('ASY', 'Asyut', 'أسيوط'),
  ('SHG', 'Sohag', 'سوهاج'), ('QNA', 'Qena', 'قنا'),
  ('LXR', 'Luxor', 'الأقصر'), ('ASW', 'Aswan', 'أسوان'),
  ('RSA', 'Red Sea', 'البحر الأحمر'), ('NVL', 'New Valley', 'الوادي الجديد'),
  ('MAT', 'Matrouh', 'مطروح'), ('NSI', 'North Sinai', 'شمال سيناء'),
  ('SSI', 'South Sinai', 'جنوب سيناء');

alter table public.governorates enable row level security;

create policy "Governorates are viewable by everyone"
  on public.governorates for select using (true);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'tourist',
  governorate_id uuid references public.governorates(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "National admins can view all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'national_admin')
  );

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create function public.current_user_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.current_user_governorate()
returns uuid language sql stable security definer set search_path = public as $$
  select governorate_id from public.profiles where id = auth.uid();
$$;
