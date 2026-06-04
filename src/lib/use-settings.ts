import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  cloudinary?: { cloud_name?: string; upload_preset?: string };
  social?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  info?: {
    brand_name?: string;
    tagline?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  hero?: Array<{ image: string; title: string; subtitle: string; cta: string }>;
};

export async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await (supabase as any)
    .from("site_settings")
    .select("data")
    .eq("id", "main")
    .maybeSingle();
  return (data?.data ?? {}) as SiteSettings;
}

export function useSettings() {
  const q = useQuery({
    queryKey: ["site_settings"],
    queryFn: fetchSettings,
    staleTime: 30_000,
  });
  return { settings: q.data ?? {}, isLoading: q.isLoading, refetch: q.refetch };
}

export async function saveSettings(next: SiteSettings) {
  const { error } = await (supabase as any)
    .from("site_settings")
    .upsert({ id: "main", data: next, updated_at: new Date().toISOString() });
  if (error) throw error;
}