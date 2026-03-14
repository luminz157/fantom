-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.issues enable row level security;
alter table public.issue_volunteers enable row level security;
alter table public.messages enable row level security;
alter table public.resources enable row level security;
alter table public.completions enable row level security;

-- PROFILES
create policy "Users can view all profiles"
on public.profiles for select using (true);

create policy "Users can update own profile"
on public.profiles for update using (auth.uid() = id);

-- ISSUES
create policy "Anyone can view issues"
on public.issues for select using (true);

create policy "Authenticated users can create issues"
on public.issues for insert with check (auth.uid() = reported_by);

create policy "Owner can update issue"
on public.issues for update using (auth.uid() = reported_by);

-- ISSUE_VOLUNTEERS
create policy "Anyone can view volunteers"
on public.issue_volunteers for select using (true);

create policy "Volunteers can join issues"
on public.issue_volunteers for insert with check (auth.uid() = volunteer_id);

create policy "Volunteers can leave issues"
on public.issue_volunteers for delete using (auth.uid() = volunteer_id);

-- MESSAGES
create policy "Anyone can view messages"
on public.messages for select using (true);

create policy "Authenticated users can send messages"
on public.messages for insert with check (auth.uid() = sender_id);

-- RESOURCES
create policy "Anyone can view resources"
on public.resources for select using (true);

create policy "Only admins can dispatch resources"
on public.resources for insert with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- COMPLETIONS
create policy "Anyone can view completions"
on public.completions for select using (true);

create policy "Authenticated users can submit completions"
on public.completions for insert with check (auth.uid() = submitted_by);