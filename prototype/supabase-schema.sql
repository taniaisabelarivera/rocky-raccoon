-- Run in Supabase SQL Editor.
-- Stores only learning progress; authentication users are managed by Supabase Auth.
create table if not exists public.learner_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed text[] not null default '{}',
  points integer not null default 0 check (points >= 0),
  quizzes integer not null default 0 check (quizzes >= 0),
  updated_at timestamptz not null default now()
);

alter table public.learner_progress enable row level security;

drop policy if exists "Learners can read their own progress" on public.learner_progress;
create policy "Learners can read their own progress"
  on public.learner_progress for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "Learners can create their own progress" on public.learner_progress;
create policy "Learners can create their own progress"
  on public.learner_progress for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "Learners can update their own progress" on public.learner_progress;
create policy "Learners can update their own progress"
  on public.learner_progress for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
