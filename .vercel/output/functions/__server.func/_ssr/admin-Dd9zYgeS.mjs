import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DLFEH1A2.mjs";
import { S as Swal } from "../_libs/sweetalert2.mjs";
import { l as logo } from "./router-BHs-3oPd.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-AdF8M1aR.mjs";
import { u as useSettings, s as saveSettings } from "./use-settings-CP8uIVa0.mjs";
import "../_libs/seroval.mjs";
import { L as LogOut, T as Tag, P as Package, S as ShoppingBag, a as Settings, b as Plus, c as Trash2, d as Save, X, e as LoaderCircle, U as Upload, f as Link$1 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const uploadImage = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  file: stringType().min(20).max(15e6),
  folder: stringType().max(64).optional()
}).parse(input)).handler(createSsrRpc("517e57626f28d980da370f8a4c53b0e50df7fe8917f6b2c47c9e1d36a65a4adb"));
function ImageUpload({
  value,
  onChange,
  label = "Image"
}) {
  const fileRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const upload = useServerFn(uploadImage);
  const handleFile = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Max 10 MB" });
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error("Read failed"));
        r.readAsDataURL(file);
      });
      const { url } = await upload({ data: { file: dataUrl } });
      onChange(url);
      Swal.fire({ icon: "success", title: "Image uploaded", timer: 1200, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Upload failed", text: e.message });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", children: label }),
    value && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2 inline-block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "", className: "h-24 w-24 object-cover rounded-lg border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(""),
          className: "absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => fileRef.current?.click(),
          disabled: busy,
          className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm",
          children: [
            busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
            busy ? "Uploading…" : "Upload Image"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "url",
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder: "…or paste image URL",
          className: "flex-1 px-3 py-2 rounded-xl border bg-background text-sm"
        }
      )
    ] })
  ] });
}
function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = reactExports.useState(false);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("categories");
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({
          to: "/auth"
        });
        return;
      }
      const {
        data: roles
      } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setReady(true);
    })();
  }, [navigate]);
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/auth"
    });
  };
  if (!ready) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Loading admin…" });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center bg-card border rounded-3xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold mb-3", children: "Not authorized" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
        "This account is not an admin. Sign in as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "admin@affancosmetics.com" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "px-4 py-2 rounded-full gradient-primary text-primary-foreground", children: "Sign out" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b bg-card sticky top-0 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 h-16 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", className: "h-12 w-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gradient hidden sm:block", children: "Admin Dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
        " Sign out"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 overflow-x-auto", children: [{
        id: "categories",
        label: "Categories",
        icon: Tag
      }, {
        id: "products",
        label: "Products",
        icon: Package
      }, {
        id: "orders",
        label: "Orders",
        icon: ShoppingBag
      }, {
        id: "settings",
        label: "Settings",
        icon: Settings
      }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.id), className: `flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition ${tab === t.id ? "gradient-primary text-primary-foreground shadow-glow" : "bg-secondary hover:bg-secondary/80"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "w-4 h-4" }),
        t.label
      ] }, t.id)) }),
      tab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesPanel, {}),
      tab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsPanel, {}),
      tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersPanel, {}),
      tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPanel, {})
    ] })
  ] });
}
function CategoriesPanel() {
  const qc = useQueryClient();
  const {
    data: cats = [],
    refetch
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("categories").select("*").order("sort_order", {
        ascending: true
      });
      return data ?? [];
    }
  });
  const [form, setForm] = reactExports.useState({
    name: "",
    slug: "",
    tagline: "",
    banner_url: ""
  });
  const submit = async (e) => {
    e.preventDefault();
    const slug = form.slug.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const {
      error
    } = await supabase.from("categories").insert({
      name: form.name.trim(),
      slug,
      tagline: form.tagline.trim() || null,
      banner_url: form.banner_url.trim() || null
    });
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Category added",
      timer: 1400,
      showConfirmButton: false
    });
    setForm({
      name: "",
      slug: "",
      tagline: "",
      banner_url: ""
    });
    refetch();
    qc.invalidateQueries({
      queryKey: ["shop"]
    });
  };
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete category?",
      text: "All its products will also be removed.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c"
    });
    if (!ok.isConfirmed) return;
    await supabase.from("categories").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({
      queryKey: ["shop"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "bg-card border rounded-2xl p-6 space-y-3 h-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add Category"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name *", value: form.name, onChange: (v) => setForm({
        ...form,
        name: v
      }), required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Slug (auto from name if blank)", value: form.slug, onChange: (v) => setForm({
        ...form,
        slug: v
      }), placeholder: "lipstick" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tagline", value: form.tagline, onChange: (v) => setForm({
        ...form,
        tagline: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUpload, { label: "Banner Image", value: form.banner_url, onChange: (v) => setForm({
        ...form,
        banner_url: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold", children: "Add Category" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg", children: [
        "All Categories (",
        cats.length,
        ")"
      ] }),
      cats.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No categories yet." }),
      cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-4 flex items-center gap-3", children: [
        c.banner_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.banner_url, alt: "", className: "w-14 h-14 rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg bg-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            "/",
            c.slug,
            " · ",
            c.tagline
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(c.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }, c.id))
    ] })
  ] });
}
function ProductsPanel() {
  const qc = useQueryClient();
  const {
    data: cats = []
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    }
  });
  const {
    data: prods = [],
    refetch
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const [form, setForm] = reactExports.useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    old_price: "",
    image_url: ""
  });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.category_id) {
      Swal.fire({
        icon: "warning",
        title: "Choose a category first"
      });
      return;
    }
    const {
      error
    } = await supabase.from("products").insert({
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      old_price: form.old_price ? Number(form.old_price) : null,
      image_url: form.image_url.trim() || null
    });
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Product added",
      timer: 1400,
      showConfirmButton: false
    });
    setForm({
      category_id: form.category_id,
      name: "",
      description: "",
      price: "",
      old_price: "",
      image_url: ""
    });
    refetch();
    qc.invalidateQueries({
      queryKey: ["shop"]
    });
  };
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c"
    });
    if (!ok.isConfirmed) return;
    await supabase.from("products").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({
      queryKey: ["shop"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "bg-card border rounded-2xl p-6 space-y-3 h-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add Product"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", children: "Category *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: form.category_id, onChange: (e) => setForm({
          ...form,
          category_id: e.target.value
        }), className: "w-full px-3 py-2.5 rounded-xl border bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select category…" }),
          cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product Name *", value: form.name, onChange: (v) => setForm({
        ...form,
        name: v
      }), required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }), rows: 3, className: "w-full px-3 py-2 rounded-xl border bg-background" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Price (Rs) *", value: form.price, onChange: (v) => setForm({
          ...form,
          price: v
        }), required: true, type: "number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Old Price (optional)", value: form.old_price, onChange: (v) => setForm({
          ...form,
          old_price: v
        }), type: "number" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUpload, { label: "Product Image *", value: form.image_url, onChange: (v) => setForm({
        ...form,
        image_url: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold", children: "Add Product" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg", children: [
        "All Products (",
        prods.length,
        ")"
      ] }),
      prods.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No products yet." }),
      prods.map((p) => {
        const cat = cats.find((c) => c.id === p.category_id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-3 flex items-center gap-3", children: [
          p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "w-16 h-16 rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-secondary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              cat?.name ?? "Uncategorized",
              " · Rs ",
              p.price,
              p.old_price ? ` (was Rs ${p.old_price})` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(p.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] }, p.id);
      })
    ] })
  ] });
}
function OrdersPanel() {
  const {
    data: orders = [],
    refetch
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("orders").select("*").order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete order?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d6336c"
    });
    if (!ok.isConfirmed) return;
    await supabase.from("orders").delete().eq("id", id);
    refetch();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg", children: [
        "Orders (",
        orders.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => refetch(), className: "text-sm text-primary", children: "Refresh" })
    ] }),
    orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders yet." }),
    orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: o.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(o.created_at).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-primary text-lg", children: [
            "Rs ",
            o.total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-secondary", children: o.status })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Phone:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${o.phone}`, className: "text-primary", children: o.phone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Address:" }),
          " ",
          o.address,
          o.city ? `, ${o.city}` : ""
        ] }),
        o.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Notes:" }),
          " ",
          o.notes
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "ITEMS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm space-y-1", children: Array.isArray(o.items) && o.items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            it.name,
            " × ",
            it.qty
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            "Rs ",
            it.price * it.qty
          ] })
        ] }, idx)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => remove(o.id), className: "text-xs text-muted-foreground hover:text-destructive flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
        " Delete"
      ] }) })
    ] }, o.id))
  ] });
}
function SettingsPanel() {
  const {
    settings,
    refetch
  } = useSettings();
  const [draft, setDraft] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setDraft(settings || {});
  }, [settings]);
  const updateGroup = (key, patch) => setDraft({
    ...draft,
    [key]: {
      ...draft[key],
      ...patch
    }
  });
  const hero = draft.hero ?? [];
  const setHero = (next) => setDraft({
    ...draft,
    hero: next
  });
  const addHero = () => setHero([...hero ?? [], {
    image: "",
    title: "",
    subtitle: "",
    cta: "Shop Now"
  }]);
  const updateHero = (i, patch) => {
    const next = [...hero];
    next[i] = {
      ...next[i],
      ...patch
    };
    setHero(next);
  };
  const removeHero = (i) => setHero(hero.filter((_, idx) => idx !== i));
  const save = async () => {
    setSaving(true);
    try {
      await saveSettings(draft);
      await refetch();
      Swal.fire({
        icon: "success",
        title: "Settings saved",
        timer: 1300,
        showConfirmButton: false
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: e.message
      });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card border rounded-2xl p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Brand & Contact Info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Brand Name", value: draft.info?.brand_name ?? "", onChange: (v) => updateGroup("info", {
        brand_name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tagline", value: draft.info?.tagline ?? "", onChange: (v) => updateGroup("info", {
        tagline: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", value: draft.info?.phone ?? "", onChange: (v) => updateGroup("info", {
        phone: v
      }), placeholder: "+92 331 0292105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", value: draft.info?.email ?? "", onChange: (v) => updateGroup("info", {
        email: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", value: draft.info?.address ?? "", onChange: (v) => updateGroup("info", {
        address: v
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card border rounded-2xl p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Social Links" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "WhatsApp Number (digits only, with country code)", value: draft.social?.whatsapp ?? "", onChange: (v) => updateGroup("social", {
        whatsapp: v
      }), placeholder: "923310292105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Instagram URL", value: draft.social?.instagram ?? "", onChange: (v) => updateGroup("social", {
        instagram: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Facebook URL", value: draft.social?.facebook ?? "", onChange: (v) => updateGroup("social", {
        facebook: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "YouTube URL", value: draft.social?.youtube ?? "", onChange: (v) => updateGroup("social", {
        youtube: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "TikTok URL", value: draft.social?.tiktok ?? "", onChange: (v) => updateGroup("social", {
        tiktok: v
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card border rounded-2xl p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Hero Banner Slides" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addHero, className: "text-sm flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add slide"
        ] })
      ] }),
      hero.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Using default slides. Add your own to override." }),
      hero.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-xl p-4 space-y-3 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
            "Slide ",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeHero(i), className: "text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUpload, { label: "Background Image", value: h.image, onChange: (v) => updateHero(i, {
          image: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", value: h.title, onChange: (v) => updateHero(i, {
          title: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subtitle", value: h.subtitle, onChange: (v) => updateHero(i, {
          subtitle: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "CTA Text", value: h.cta, onChange: (v) => updateHero(i, {
          cta: v
        }) })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: save, disabled: saving, className: "w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
      " ",
      saving ? "Saving…" : "Save All Settings"
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, required, value, placeholder, onChange: (e) => onChange(e.target.value), className: "w-full px-3 py-2.5 rounded-xl border bg-background" })
  ] });
}
export {
  AdminPage as component
};
