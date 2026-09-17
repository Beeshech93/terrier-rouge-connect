-- Facebook Page publishing: settings table (admin-only) and tracking columns on projects.
CREATE TABLE IF NOT EXISTS public.facebook_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text,
  page_name text,
  page_access_token text,
  is_active boolean NOT NULL DEFAULT false,
  auto_publish boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.facebook_settings ENABLE ROW LEVEL SECURITY;

-- Unlike payment_settings, this table holds a real secret (Page access token),
-- so there is intentionally no public read policy: admins only, both ways.
CREATE POLICY "facebook_settings_admin_all"
  ON public.facebook_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS facebook_post_id text,
  ADD COLUMN IF NOT EXISTS facebook_published_at timestamptz;
