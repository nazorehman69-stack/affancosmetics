CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings admin insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "settings admin update" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.site_settings(id, data) VALUES ('main', '{}'::jsonb) ON CONFLICT (id) DO NOTHING;