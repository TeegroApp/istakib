-- İstakib MVP — Supabase Schema
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın.

-- Aşamalar (Kanban sütunları)
create table if not exists stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#6366f1',
  position integer not null default 0,
  created_at timestamptz default now()
);

-- Hiyerarşik kategoriler
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#10b981',
  parent_id uuid references categories(id) on delete cascade,
  level integer not null default 1,
  created_at timestamptz default now()
);

-- Tasklar
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  stage_id uuid references stages(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  priority text check (priority in ('düşük', 'orta', 'yüksek', 'acil')) default 'orta',
  due_date date,
  tags text[] default '{}',
  position integer not null default 0,
  archived boolean default false,
  archived_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at otomatik güncelle
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- Real-time aktif et
alter publication supabase_realtime add table stages;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table tasks;

-- Örnek başlangıç verileri
insert into stages (name, color, position) values
  ('Fikir',       '#8b5cf6', 0),
  ('Planlama',    '#3b82f6', 1),
  ('Devam Ediyor','#f59e0b', 2),
  ('İncelemede',  '#ec4899', 3),
  ('Bitti',       '#10b981', 4)
on conflict do nothing;
