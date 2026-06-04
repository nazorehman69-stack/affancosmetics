import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";
import { LogOut, Plus, Trash2, Package, Tag, ShoppingBag, Settings as SettingsIcon, Save } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useSettings, saveSettings, type SiteSettings } from "@/lib/use-settings";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Affan Cosmetics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "categories" | "products" | "orders" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("categories");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setReady(true);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card border rounded-3xl p-8">
          <h1 className="text-xl font-bold mb-3">Not authorized</h1>
          <p className="text-sm text-muted-foreground mb-4">
            This account is not an admin. Sign in as <b>admin@affancosmetics.com</b>.
          </p>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-full gradient-primary text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-auto" />
            <span className="font-bold text-gradient hidden sm:block">Admin Dashboard</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {([
            { id: "categories", label: "Categories", icon: Tag },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "categories" && <CategoriesPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

/* ---------------- Categories ---------------- */

type Category = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  banner_url: string | null;
  sort_order: number;
};

function CategoriesPanel() {
  const qc = useQueryClient();
  const { data: cats = [], refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data ?? []) as Category[];
    },
  });

  const [form, setForm] = useState({ name: "", slug: "", tagline: "", banner_url: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      form.slug.trim() ||
      form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({
      name: form.name.trim(),
      slug,
      tagline: form.tagline.trim() || null,
      banner_url: form.banner_url.trim() || null,
    });
    if (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message });
      return;
    }
    Swal.fire({ icon: "success", title: "Category added", timer: 1400, showConfirmButton: false });
    setForm({ name: "", slug: "", tagline: "", banner_url: "" });
    refetch();
    qc.invalidateQueries({ queryKey: ["shop"] });
  };

  const remove = async (id: string) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete category?",
      text: "All its products will also be removed.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c",
    });
    if (!ok.isConfirmed) return;
    await supabase.from("categories").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({ queryKey: ["shop"] });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-card border rounded-2xl p-6 space-y-3 h-fit">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </h2>
        <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field
          label="Slug (auto from name if blank)"
          value={form.slug}
          onChange={(v) => setForm({ ...form, slug: v })}
          placeholder="lipstick"
        />
        <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
        <ImageUpload
          label="Banner Image"
          value={form.banner_url}
          onChange={(v) => setForm({ ...form, banner_url: v })}
        />
        <button className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold">
          Add Category
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-bold text-lg">All Categories ({cats.length})</h2>
        {cats.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
        {cats.map((c) => (
          <div key={c.id} className="bg-card border rounded-xl p-4 flex items-center gap-3">
            {c.banner_url ? (
              <img src={c.banner_url} alt="" className="w-14 h-14 rounded-lg object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-secondary" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">/{c.slug} · {c.tagline}</p>
            </div>
            <button onClick={() => remove(c.id)} className="p-2 hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Products ---------------- */

type DbProduct = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
};

function ProductsPanel() {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return (data ?? []) as Category[];
    },
  });
  const { data: prods = [], refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as DbProduct[];
    },
  });

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    old_price: "",
    image_url: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) {
      Swal.fire({ icon: "warning", title: "Choose a category first" });
      return;
    }
    const { error } = await supabase.from("products").insert({
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      old_price: form.old_price ? Number(form.old_price) : null,
      image_url: form.image_url.trim() || null,
    });
    if (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message });
      return;
    }
    Swal.fire({ icon: "success", title: "Product added", timer: 1400, showConfirmButton: false });
    setForm({ category_id: form.category_id, name: "", description: "", price: "", old_price: "", image_url: "" });
    refetch();
    qc.invalidateQueries({ queryKey: ["shop"] });
  };

  const remove = async (id: string) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c",
    });
    if (!ok.isConfirmed) return;
    await supabase.from("products").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({ queryKey: ["shop"] });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-card border rounded-2xl p-6 space-y-3 h-fit">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </h2>
        <div>
          <label className="text-sm font-medium mb-1 block">Category *</label>
          <select
            required
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border bg-background"
          >
            <option value="">Select category…</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Field label="Product Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border bg-background"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (Rs) *" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required type="number" />
          <Field
            label="Old Price (optional)"
            value={form.old_price}
            onChange={(v) => setForm({ ...form, old_price: v })}
            type="number"
          />
        </div>
        <ImageUpload
          label="Product Image *"
          value={form.image_url}
          onChange={(v) => setForm({ ...form, image_url: v })}
        />
        <button className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold">
          Add Product
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-bold text-lg">All Products ({prods.length})</h2>
        {prods.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
        {prods.map((p) => {
          const cat = cats.find((c) => c.id === p.category_id);
          return (
            <div key={p.id} className="bg-card border rounded-xl p-3 flex items-center gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {cat?.name ?? "Uncategorized"} · Rs {p.price}
                  {p.old_price ? ` (was Rs ${p.old_price})` : ""}
                </p>
              </div>
              <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string | null;
  notes: string | null;
  items: Array<{ id: string; name: string; qty: number; price: number }>;
  total: number;
  status: string;
  created_at: string;
};

function OrdersPanel() {
  const { data: orders = [], refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as Order[];
    },
  });

  const remove = async (id: string) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete order?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c",
    });
    if (!ok.isConfirmed) return;
    await supabase.from("orders").delete().eq("id", id);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Orders ({orders.length})</h2>
        <button onClick={() => refetch()} className="text-sm text-primary">
          Refresh
        </button>
      </div>
      {orders.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      )}
      {orders.map((o) => (
        <div key={o.id} className="bg-card border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-semibold">{o.customer_name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary text-lg">Rs {o.total}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{o.status}</span>
            </div>
          </div>
          <div className="text-sm space-y-1 mb-3">
            <p><b>Phone:</b> <a href={`tel:${o.phone}`} className="text-primary">{o.phone}</a></p>
            <p><b>Address:</b> {o.address}{o.city ? `, ${o.city}` : ""}</p>
            {o.notes && <p><b>Notes:</b> {o.notes}</p>}
          </div>
          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">ITEMS</p>
            <ul className="text-sm space-y-1">
              {Array.isArray(o.items) &&
                o.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {it.name} × {it.qty}
                    </span>
                    <span className="font-medium">Rs {it.price * it.qty}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => remove(o.id)}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Field ---------------- */

/* ---------------- Settings ---------------- */

function SettingsPanel() {
  const { settings, refetch } = useSettings();
  const [draft, setDraft] = useState<SiteSettings>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(settings || {});
  }, [settings]);

  const update = (patch: Partial<SiteSettings>) => setDraft({ ...draft, ...patch });
  const updateGroup = <K extends keyof SiteSettings>(key: K, patch: any) =>
    setDraft({ ...draft, [key]: { ...(draft[key] as any), ...patch } });

  const hero = draft.hero ?? [];
  const setHero = (next: SiteSettings["hero"]) => setDraft({ ...draft, hero: next });

  const addHero = () =>
    setHero([...(hero ?? []), { image: "", title: "", subtitle: "", cta: "Shop Now" }]);
  const updateHero = (i: number, patch: any) => {
    const next = [...hero];
    next[i] = { ...next[i], ...patch };
    setHero(next);
  };
  const removeHero = (i: number) => setHero(hero.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await saveSettings(draft);
      await refetch();
      Swal.fire({ icon: "success", title: "Settings saved", timer: 1300, showConfirmButton: false });
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Failed", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Brand info */}
      <section className="bg-card border rounded-2xl p-6 space-y-3">
        <h2 className="font-bold text-lg">Brand & Contact Info</h2>
        <Field
          label="Brand Name"
          value={draft.info?.brand_name ?? ""}
          onChange={(v) => updateGroup("info", { brand_name: v })}
        />
        <Field
          label="Tagline"
          value={draft.info?.tagline ?? ""}
          onChange={(v) => updateGroup("info", { tagline: v })}
        />
        <Field
          label="Phone"
          value={draft.info?.phone ?? ""}
          onChange={(v) => updateGroup("info", { phone: v })}
          placeholder="+92 331 0292105"
        />
        <Field
          label="Email"
          value={draft.info?.email ?? ""}
          onChange={(v) => updateGroup("info", { email: v })}
        />
        <Field
          label="Address"
          value={draft.info?.address ?? ""}
          onChange={(v) => updateGroup("info", { address: v })}
        />
      </section>

      {/* Social */}
      <section className="bg-card border rounded-2xl p-6 space-y-3">
        <h2 className="font-bold text-lg">Social Links</h2>
        <Field
          label="WhatsApp Number (digits only, with country code)"
          value={draft.social?.whatsapp ?? ""}
          onChange={(v) => updateGroup("social", { whatsapp: v })}
          placeholder="923310292105"
        />
        <Field
          label="Instagram URL"
          value={draft.social?.instagram ?? ""}
          onChange={(v) => updateGroup("social", { instagram: v })}
        />
        <Field
          label="Facebook URL"
          value={draft.social?.facebook ?? ""}
          onChange={(v) => updateGroup("social", { facebook: v })}
        />
        <Field
          label="YouTube URL"
          value={draft.social?.youtube ?? ""}
          onChange={(v) => updateGroup("social", { youtube: v })}
        />
        <Field
          label="TikTok URL"
          value={draft.social?.tiktok ?? ""}
          onChange={(v) => updateGroup("social", { tiktok: v })}
        />
      </section>

      {/* Hero slides */}
      <section className="bg-card border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Hero Banner Slides</h2>
          <button
            type="button"
            onClick={addHero}
            className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary"
          >
            <Plus className="w-4 h-4" /> Add slide
          </button>
        </div>
        {hero.length === 0 && (
          <p className="text-sm text-muted-foreground">Using default slides. Add your own to override.</p>
        )}
        {hero.map((h, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3 bg-background">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Slide {i + 1}</span>
              <button onClick={() => removeHero(i)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ImageUpload
              label="Background Image"
              value={h.image}
              onChange={(v) => updateHero(i, { image: v })}
            />
            <Field label="Title" value={h.title} onChange={(v) => updateHero(i, { title: v })} />
            <Field label="Subtitle" value={h.subtitle} onChange={(v) => updateHero(i, { subtitle: v })} />
            <Field label="CTA Text" value={h.cta} onChange={(v) => updateHero(i, { cta: v })} />
          </div>
        ))}
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save All Settings"}
      </button>
    </div>
  );
}

/* ---------------- Field ---------------- */

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border bg-background"
      />
    </div>
  );
}