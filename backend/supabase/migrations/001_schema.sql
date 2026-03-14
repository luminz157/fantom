-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text not null,
  avatar_url      text,
  role            text not null default 'citizen' check (role in ('citizen', 'volunteer', 'admin')),
  points          integer not null default 0,
  tasks_completed integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ISSUES
create table public.issues (
  id                uuid primary key default uuid_generate_v4(),
  reported_by       uuid references public.profiles(id) on delete set null,
  title             text not null,
  description       text,
  image_url         text,
  lat               double precision not null,
  lng               double precision not null,
  address           text,
  issue_type        text,
  severity          text default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  urgency_score     integer default 5 check (urgency_score between 1 and 10),
  volunteers_needed integer default 2,
  status            text default 'open' check (status in ('open', 'in_progress', 'completed', 'rejected')),
  ai_analysis       jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ISSUE_VOLUNTEERS
create table public.issue_volunteers (
  id           uuid primary key default uuid_generate_v4(),
  issue_id     uuid references public.issues(id) on delete cascade not null,
  volunteer_id uuid references public.profiles(id) on delete cascade not null,
  is_leader    boolean not null default false,
  joined_at    timestamptz not null default now(),
  unique (issue_id, volunteer_id)
);

-- MESSAGES
create table public.messages (
  id         uuid primary key default uuid_generate_v4(),
  issue_id   uuid references public.issues(id) on delete cascade not null,
  sender_id  uuid references public.profiles(id) on delete set null,
  content    text not null,
  created_at timestamptz not null default now()
);

-- RESOURCES
create table public.resources (
  id             uuid primary key default uuid_generate_v4(),
  issue_id       uuid references public.issues(id) on delete cascade not null,
  dispatched_by  uuid references public.profiles(id) on delete set null,
  resource_type  text not null,
  notes          text,
  dispatched_at  timestamptz not null default now()
);

-- COMPLETIONS
create table public.completions (
  id           uuid primary key default uuid_generate_v4(),
  issue_id     uuid references public.issues(id) on delete cascade not null,
  submitted_by uuid references public.profiles(id) on delete set null,
  before_url   text,
  after_url    text,
  ai_verified  boolean default false,
  ai_notes     text,
  verified_at  timestamptz
);