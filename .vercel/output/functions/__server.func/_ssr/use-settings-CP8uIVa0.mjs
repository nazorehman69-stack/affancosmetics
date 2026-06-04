import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DLFEH1A2.mjs";
async function fetchSettings() {
  const { data } = await supabase.from("site_settings").select("data").eq("id", "main").maybeSingle();
  return data?.data ?? {};
}
function useSettings() {
  const q = useQuery({
    queryKey: ["site_settings"],
    queryFn: fetchSettings,
    staleTime: 3e4
  });
  return { settings: q.data ?? {}, isLoading: q.isLoading, refetch: q.refetch };
}
async function saveSettings(next) {
  const { error } = await supabase.from("site_settings").upsert({ id: "main", data: next, updated_at: (/* @__PURE__ */ new Date()).toISOString() });
  if (error) throw error;
}
export {
  saveSettings as s,
  useSettings as u
};
