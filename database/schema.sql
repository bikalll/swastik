-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 
-- 1. Hero Sections Table
--
create table public.hero_sections (
  id uuid default uuid_generate_v4() primary key,
  page_slug text not null unique,
  eyebrow text,
  title text not null,
  subtitle text,
  background_image text,
  cta_primary_text text,
  cta_primary_link text,
  cta_secondary_text text,
  cta_secondary_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Services Table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  icon_name text,
  starting_price text,
  features text[],
  image_url text,
  display_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Product Categories
create table public.product_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2),
  original_price decimal(10,2),
  badge text,
  image_url text,
  category_id uuid references public.product_categories(id),
  features text[],
  display_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Collections Table
create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  item_count text,
  badge text,
  category_slug text,
  display_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Testimonials Table
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text,
  location text,
  quote text not null,
  rating integer default 5,
  rating_text text,
  avatar_url text,
  display_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Partners Table
create table public.partners (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  logo_url text not null,
  website_url text,
  is_top_partner boolean default false,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. FAQs Table
create table public.faqs (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Site Settings Table
create table public.site_settings (
  key text primary key,
  value text,
  description text,
  type text default 'text',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Contact Submissions Table
create table public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  project_type text,
  budget text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Enable RLS for all tables)
alter table public.hero_sections enable row level security;
alter table public.services enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.testimonials enable row level security;
alter table public.partners enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_submissions enable row level security;

-- Public Read Access Policies
create policy "Public Read Hero" on public.hero_sections for select using (true);
create policy "Public Read Services" on public.services for select using (true);
create policy "Public Read Categories" on public.product_categories for select using (true);
create policy "Public Read Products" on public.products for select using (true);
create policy "Public Read Collections" on public.collections for select using (true);
create policy "Public Read Testimonials" on public.testimonials for select using (true);
create policy "Public Read Partners" on public.partners for select using (true);
create policy "Public Read FAQs" on public.faqs for select using (true);
create policy "Public Read Settings" on public.site_settings for select using (true);

-- Contact Form Submission Policy
create policy "Public Submit Contact" on public.contact_submissions for insert with check (true);

-- Authenticated Admin Access (Full Access)
-- Note: In a real app, you'd check for a specific role. For simplicity, we allow any authenticated user (admin).
create policy "Admin Full Access Hero" on public.hero_sections for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Services" on public.services for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Categories" on public.product_categories for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Products" on public.products for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Collections" on public.collections for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Partners" on public.partners for all using (auth.role() = 'authenticated');
create policy "Admin Full Access FAQs" on public.faqs for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Settings" on public.site_settings for all using (auth.role() = 'authenticated');
create policy "Admin Full Access Submissions" on public.contact_submissions for all using (auth.role() = 'authenticated');

-- Storage Buckets (Execute this via Storage API or Dashboard usually, but good to document)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- insert into storage.buckets (id, name, public) values ('testimonials', 'testimonials', true); 
-- insert into storage.buckets (id, name, public) values ('collections', 'collections', true);
-- insert into storage.buckets (id, name, public) values ('partners', 'partners', true);
