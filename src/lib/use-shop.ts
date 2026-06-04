import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "./products";

type DbCategory = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  banner_url: string | null;
  sort_order: number;
};
type DbProduct = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
};

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1522335789203-aaa9c01eea9d?auto=format&fit=crop&w=1600&q=85";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1599733589046-8a35aa3a6e57?auto=format&fit=crop&w=800&q=80";

async function fetchShop(): Promise<Category[]> {
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);
  const categories = (cats ?? []) as DbCategory[];
  const products = (prods ?? []) as DbProduct[];
  return categories.map((c) => ({
    id: c.slug,
    name: c.name,
    tagline: c.tagline ?? "",
    banner: c.banner_url || FALLBACK_BANNER,
    products: products
      .filter((p) => p.category_id === c.id)
      .map<Product>((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        oldPrice: p.old_price != null ? Number(p.old_price) : undefined,
        image: p.image_url || FALLBACK_IMG,
        category: c.name,
        description: p.description ?? "",
      })),
  }));
}

export function useShop() {
  const q = useQuery({ queryKey: ["shop"], queryFn: fetchShop, staleTime: 30_000 });
  const categories = q.data ?? [];
  const allProducts = categories.flatMap((c) => c.products);
  return { categories, allProducts, isLoading: q.isLoading };
}