create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  city text not null default 'Bengaluru',
  language_preference text not null default 'hinglish' check (language_preference in ('hindi','english','hinglish')),
  created_at timestamptz not null default now()
);

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  nickname text not null,
  species text not null,
  common_name_hindi text,
  location text not null default 'Home',
  created_at timestamptz not null default now()
);

create table if not exists public.plant_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  storage_url text not null,
  health_score integer not null check (health_score between 0 and 100),
  analysis_json jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now()
);

create table if not exists public.care_logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  action_type text not null check (action_type in ('watering','sunlight','fertilizer','pruning','repotting','treatment','observation')),
  notes text not null default '',
  weather_context_json jsonb not null default '{}'::jsonb,
  logged_at timestamptz not null default now()
);

create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  photo_id uuid references public.plant_photos(id) on delete set null,
  gemini_analysis_json jsonb not null default '{}'::jsonb,
  treatment_plan jsonb not null default '[]'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  anonymous_label text not null,
  city text not null,
  image_url text not null,
  description text not null,
  ai_diagnosis_json jsonb not null default '{}'::jsonb,
  upvotes integer not null default 0 check (upvotes >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  content text not null,
  is_ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.disease_patterns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  symptoms text[] not null default '{}',
  treatment text not null,
  embedding vector(768),
  severity text not null default 'medium' check (severity in ('low','medium','high')),
  created_at timestamptz not null default now()
);

create table if not exists public.species_care (
  id uuid primary key default gen_random_uuid(),
  species_name text not null unique,
  hindi_name text,
  care_requirements_json jsonb not null,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create table if not exists public.care_schedules (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  schedule_date date not null,
  schedule_json jsonb not null,
  weather_snapshot_json jsonb not null default '{}'::jsonb,
  completed_tasks jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (plant_id, schedule_date)
);

create index if not exists users_created_at_idx on public.users(created_at desc);
create index if not exists plants_user_id_idx on public.plants(user_id);
create index if not exists plants_created_at_idx on public.plants(created_at desc);
create index if not exists plant_photos_plant_id_idx on public.plant_photos(plant_id);
create index if not exists plant_photos_taken_at_idx on public.plant_photos(taken_at desc);
create index if not exists care_logs_plant_id_idx on public.care_logs(plant_id);
create index if not exists care_logs_logged_at_idx on public.care_logs(logged_at desc);
create index if not exists diagnoses_plant_id_idx on public.diagnoses(plant_id);
create index if not exists community_posts_user_id_idx on public.community_posts(user_id);
create index if not exists community_posts_city_created_at_idx on public.community_posts(city, created_at desc);
create index if not exists community_replies_post_id_idx on public.community_replies(post_id);
create index if not exists disease_patterns_name_idx on public.disease_patterns(lower(name));
create index if not exists disease_patterns_embedding_idx on public.disease_patterns using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists species_care_species_name_idx on public.species_care(lower(species_name));
create index if not exists species_care_embedding_idx on public.species_care using ivfflat (embedding vector_cosine_ops) with (lists = 50);
create index if not exists care_schedules_plant_id_idx on public.care_schedules(plant_id);
create index if not exists care_schedules_schedule_date_idx on public.care_schedules(schedule_date desc);

alter table public.users enable row level security;
alter table public.plants enable row level security;
alter table public.plant_photos enable row level security;
alter table public.care_logs enable row level security;
alter table public.diagnoses enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;
alter table public.disease_patterns enable row level security;
alter table public.species_care enable row level security;
alter table public.care_schedules enable row level security;

create policy "users_read_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "plants_owner_all" on public.plants for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plant_photos_owner_all" on public.plant_photos for all using (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid())) with check (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()));
create policy "care_logs_owner_all" on public.care_logs for all using (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid())) with check (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()));
create policy "diagnoses_owner_all" on public.diagnoses for all using (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid())) with check (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()));
create policy "care_schedules_owner_all" on public.care_schedules for all using (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid())) with check (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()));

create policy "community_posts_read_all" on public.community_posts for select using (true);
create policy "community_posts_insert_authenticated" on public.community_posts for insert with check (auth.uid() = user_id or user_id is null);
create policy "community_posts_update_owner" on public.community_posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "community_replies_read_all" on public.community_replies for select using (true);
create policy "community_replies_insert_authenticated" on public.community_replies for insert with check (auth.uid() = user_id or user_id is null);
create policy "community_replies_update_owner" on public.community_replies for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "disease_patterns_read_all" on public.disease_patterns for select using (true);
create policy "species_care_read_all" on public.species_care for select using (true);

create or replace function public.match_disease_patterns(query_embedding vector(768), match_count int default 3)
returns table (
  id uuid,
  name text,
  description text,
  symptoms text[],
  treatment text,
  severity text,
  similarity float
)
language sql
stable
as $$
  select
    dp.id,
    dp.name,
    dp.description,
    dp.symptoms,
    dp.treatment,
    dp.severity,
    1 - (dp.embedding <=> query_embedding) as similarity
  from public.disease_patterns dp
  where dp.embedding is not null
  order by dp.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.match_species_care(query_embedding vector(768), match_count int default 3)
returns table (
  id uuid,
  species_name text,
  hindi_name text,
  care_requirements_json jsonb,
  similarity float
)
language sql
stable
as $$
  select
    sc.id,
    sc.species_name,
    sc.hindi_name,
    sc.care_requirements_json,
    1 - (sc.embedding <=> query_embedding) as similarity
  from public.species_care sc
  where sc.embedding is not null
  order by sc.embedding <=> query_embedding
  limit match_count;
$$;

alter publication supabase_realtime add table public.community_posts;
alter publication supabase_realtime add table public.community_replies;
