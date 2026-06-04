import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DLFEH1A2.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as logo } from "./router-BHs-3oPd.mjs";
import { u as useSettings } from "./use-settings-CP8uIVa0.mjs";
import { S as Swal } from "../_libs/sweetalert2.mjs";
import { g as Shield, h as Search, H as Heart, S as ShoppingBag, M as Menu, X, i as User, j as Sparkles, C as ChevronLeft, k as ChevronRight, I as Instagram, F as Facebook, Y as Youtube, l as Music2, m as MessageCircle, n as MapPin, o as Phone, p as Mail, q as Star, r as Minus, b as Plus, c as Trash2, E as Eye, s as House } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const Ctx = reactExports.createContext(null);
function CartProvider({ children }) {
  const [items, setItems] = reactExports.useState([]);
  const [isOpen, setOpen] = reactExports.useState(false);
  const [wishlist, setWishlist] = reactExports.useState([]);
  const [wishlistOpen, setWishlistOpen] = reactExports.useState(false);
  const [viewProduct, setViewProduct] = reactExports.useState(null);
  const add = (p) => setItems((prev) => {
    const found = prev.find((i) => i.id === p.id);
    return found ? prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
  });
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const inc = (id) => setItems(
    (prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i)
  );
  const dec = (id) => setItems(
    (prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter((i) => i.qty > 0)
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const toggleWish = (p) => setWishlist(
    (prev) => prev.find((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p]
  );
  const removeWish = (id) => setWishlist((prev) => prev.filter((i) => i.id !== id));
  const isWished = (id) => wishlist.some((i) => i.id === id);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        items,
        isOpen,
        add,
        remove,
        inc,
        dec,
        clear: () => setItems([]),
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle: () => setOpen((o) => !o),
        total,
        count,
        wishlist,
        wishlistOpen,
        toggleWish,
        removeWish,
        isWished,
        openWish: () => setWishlistOpen(true),
        closeWish: () => setWishlistOpen(false),
        wishCount: wishlist.length,
        viewProduct,
        setViewProduct
      },
      children
    }
  );
}
function useCart() {
  const v = reactExports.useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
const FALLBACK_BANNER = "https://images.unsplash.com/photo-1522335789203-aaa9c01eea9d?auto=format&fit=crop&w=1600&q=85";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1599733589046-8a35aa3a6e57?auto=format&fit=crop&w=800&q=80";
async function fetchShop() {
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("products").select("*").order("created_at", { ascending: false })
  ]);
  const categories = cats ?? [];
  const products = prods ?? [];
  return categories.map((c) => ({
    id: c.slug,
    name: c.name,
    tagline: c.tagline ?? "",
    banner: c.banner_url || FALLBACK_BANNER,
    products: products.filter((p) => p.category_id === c.id).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      oldPrice: p.old_price != null ? Number(p.old_price) : void 0,
      image: p.image_url || FALLBACK_IMG,
      category: c.name,
      description: p.description ?? ""
    }))
  }));
}
function useShop() {
  const q = useQuery({ queryKey: ["shop"], queryFn: fetchShop, staleTime: 3e4 });
  const categories = q.data ?? [];
  const allProducts = categories.flatMap((c) => c.products);
  return { categories, allProducts, isLoading: q.isLoading };
}
function Navbar({ onSearch }) {
  const [open, setOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  const { count, open: openCart, wishCount, openWish } = useCart();
  const { categories } = useShop();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "header",
      {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl shadow-soft" : "bg-background/40 backdrop-blur-md"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-16 md:h-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => scrollTo("home"),
              className: "flex items-center gap-2 group flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: logo,
                  alt: "Affan Cosmetics",
                  className: "h-14 md:h-20 w-auto object-contain drop-shadow-md"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden lg:flex items-center gap-0.5 flex-1 justify-center px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => scrollTo("home"),
                className: "px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium hover:text-primary transition relative group whitespace-nowrap",
                children: [
                  "Home",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-primary group-hover:w-full transition-all" })
                ]
              }
            ),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => scrollTo(c.id),
                className: "px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium hover:text-primary transition relative group whitespace-nowrap",
                children: [
                  c.name,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-primary group-hover:w-full transition-all" })
                ]
              },
              c.id
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/admin",
                "aria-label": "Admin",
                className: "p-2 hover:bg-secondary rounded-full transition hidden sm:block",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onSearch,
                "aria-label": "Search",
                className: "p-2 hover:bg-secondary rounded-full transition hidden sm:block",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: openWish,
                "aria-label": "Wishlist",
                className: "p-2 hover:bg-secondary rounded-full transition hidden sm:block relative",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5" }),
                  wishCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center", children: wishCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: openCart,
                "aria-label": "Cart",
                className: "p-2 hover:bg-secondary rounded-full transition relative hidden md:block",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5" }),
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center", children: count })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setOpen(true),
                className: "lg:hidden p-2 hover:bg-secondary rounded-full transition",
                "aria-label": "Menu",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-6 h-6" })
              }
            )
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden",
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.aside,
          {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
            transition: { type: "spring", damping: 25 },
            onClick: (e) => e.stopPropagation(),
            className: "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-glow p-6 overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gradient", children: "Menu" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setOpen(false),
                    className: "p-2 hover:bg-secondary rounded-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => scrollTo("home"),
                    className: "text-left px-4 py-3 rounded-lg hover:bg-secondary font-medium flex items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }),
                      " Home"
                    ]
                  }
                ),
                categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => scrollTo(c.id),
                    className: "text-left px-4 py-3 rounded-lg hover:bg-secondary font-medium flex items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }),
                      " ",
                      c.name
                    ]
                  },
                  c.id
                ))
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
const heroBanner = "/assets/herobanner-BjVUD1bd.png";
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;
const heroSlides = [
  {
    image: heroBanner,
    title: "Affan Cosmetics",
    subtitle: "Discover your signature beauty",
    cta: "Shop Now"
  },
  {
    image: img("photo-1596462502278-27bfdc403348"),
    title: "New Season Glow",
    subtitle: "Premium beauty essentials",
    cta: "Explore Now"
  },
  {
    image: img("photo-1583241800698-9c3550778cdc"),
    title: "Luxury Made Affordable",
    subtitle: "Hand-picked luxury cosmetics",
    cta: "View Collection"
  },
  {
    image: img("photo-1503236823255-94609f598e71"),
    title: "Bold Lips, Bold You",
    subtitle: "New lipstick shades just landed",
    cta: "Shop Lipstick"
  }
];
function HeroSlider() {
  const [i, setI] = reactExports.useState(0);
  const { settings } = useSettings();
  const slides = settings.hero && settings.hero.length > 0 ? settings.hero : heroSlides;
  reactExports.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5e3);
    return () => clearInterval(t);
  }, [slides.length]);
  const slide = slides[i % slides.length];
  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "home", className: "relative h-[88vh] min-h-[600px] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 1.1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 1 },
        className: "absolute inset-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: slide.image,
              alt: slide.title,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30" })
        ]
      },
      i
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-32 right-20 w-72 h-72 rounded-full gradient-primary opacity-30 blur-3xl animate-float pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute bottom-20 left-40 w-96 h-96 rounded-full bg-accent opacity-20 blur-3xl animate-float pointer-events-none",
        style: { animationDelay: "2s" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 container mx-auto h-full flex items-center px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, delay: 0.2 },
        className: "max-w-2xl pt-20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Premium Beauty Store" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: slide.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-2xl text-muted-foreground mb-8 max-w-xl", children: slide.subtitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  document.getElementById("lipstick")?.scrollIntoView({ behavior: "smooth" });
                },
                className: "px-8 py-4 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow hover:scale-105 transition-transform",
                children: slide.cta
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => document.getElementById("perfume")?.scrollIntoView({ behavior: "smooth" }),
                className: "px-8 py-4 bg-background/60 backdrop-blur-md border border-primary/30 rounded-full font-semibold hover:bg-background transition",
                children: "Browse Categories"
              }
            )
          ] })
        ]
      },
      i
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: prev,
        "aria-label": "Prev",
        className: "absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 backdrop-blur-md hover:bg-background transition",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: next,
        "aria-label": "Next",
        className: "absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 backdrop-blur-md hover:bg-background transition",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10", children: slides.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setI(idx),
        className: `h-2 rounded-full transition-all ${idx === i ? "w-10 gradient-primary" : "w-2 bg-foreground/30"}`
      },
      idx
    )) })
  ] });
}
function ProductCard({
  product,
  onView
}) {
  const { add, toggleWish, isWished } = useCart();
  const wished = isWished(product.id);
  const handleAdd = () => {
    add(product);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.name} added to cart`,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      background: "#fff",
      color: "#3a0a1f"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.5 },
      className: "card-3d group bg-card rounded-2xl overflow-hidden shadow-soft cursor-pointer flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden aspect-square bg-gradient-to-br from-secondary/60 to-background flex items-center justify-center p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image,
              alt: product.name,
              loading: "lazy",
              className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            }
          ),
          product.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold gradient-primary text-primary-foreground", children: [
            "-",
            Math.round((product.oldPrice - product.price) / product.oldPrice * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                toggleWish(product);
                Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: wished ? "info" : "success",
                  title: wished ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
                  showConfirmButton: false,
                  timer: 1500
                });
              },
              "aria-label": "Wishlist",
              className: `absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-md transition hover:text-primary ${wished ? "opacity-100 text-primary" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${wished ? "fill-primary" : ""}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => onView(product),
                className: "flex-1 py-2 bg-background/95 backdrop-blur rounded-full text-sm font-medium hover:bg-background flex items-center justify-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                  " View"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleAdd,
                className: "flex-1 py-2 gradient-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
                  " Add"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-1", children: product.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-base leading-snug mb-2 line-clamp-2 flex-1", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-primary", children: [
              "Rs ",
              product.price
            ] }),
            product.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground line-through", children: [
              "Rs ",
              product.oldPrice
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CategorySection({
  category,
  onView
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: category.id, className: "py-16 md:py-24 scroll-mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.7 },
        className: "relative h-56 md:h-72 rounded-3xl overflow-hidden mb-10 md:mb-14 bg-gradient-to-br from-secondary via-background to-secondary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: category.banner,
              alt: category.name,
              className: "w-full h-full object-cover object-center",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center px-8 md:px-16 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-white/90 mb-3 font-medium", children: "Collection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg", children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl text-white/90 max-w-md drop-shadow", children: category.tagline })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6", children: category.products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, onView }, p.id)) })
  ] }) });
}
function ProductDialog({
  product,
  onClose
}) {
  const { add, toggleWish, isWished } = useCart();
  const [qty, setQty] = reactExports.useState(1);
  const wished = product ? isWished(product.id) : false;
  reactExports.useEffect(() => {
    setQty(1);
    if (product) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);
  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) add(product);
    Swal.fire({
      icon: "success",
      title: "Added to cart!",
      text: `${qty} × ${product.name}`,
      timer: 1600,
      showConfirmButton: false
    });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: product && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      className: "fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 md:p-4 overflow-y-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.9, y: 40 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.9, y: 40 },
          onClick: (e) => e.stopPropagation(),
          className: "relative bg-background rounded-2xl md:rounded-3xl shadow-glow max-w-4xl w-full grid md:grid-cols-2 overflow-hidden my-2 md:my-8 max-h-[92vh] md:max-h-[85vh] overflow-y-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "absolute top-4 right-4 p-2 rounded-full bg-background/90 hover:bg-secondary z-10",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 sm:h-64 md:h-auto md:aspect-square bg-gradient-to-br from-secondary/60 to-background overflow-hidden flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.image,
                alt: product.name,
                className: "w-full h-full object-contain"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-10 flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary mb-2 font-semibold", children: product.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-2 md:mb-3", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 md:mb-4", children: [
                [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-accent text-accent" }, s)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground ml-1", children: "(124 reviews)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed", children: product.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 mb-4 md:mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl md:text-3xl font-bold text-primary", children: [
                  "Rs ",
                  product.price
                ] }),
                product.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg text-muted-foreground line-through", children: [
                  "Rs ",
                  product.oldPrice
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4 md:mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Quantity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-full px-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setQty((q) => Math.max(1, q - 1)),
                      className: "p-2 hover:text-primary",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-semibold", children: qty }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setQty((q) => q + 1),
                      className: "p-2 hover:text-primary",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleAdd,
                    className: "flex-1 py-3 md:py-4 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow flex items-center justify-center gap-2 hover:scale-[1.02] transition",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5" }),
                      " Add to Cart"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => product && toggleWish(product),
                    "aria-label": "Wishlist",
                    className: `p-3 md:p-4 border border-border rounded-full hover:bg-secondary ${wished ? "text-primary border-primary" : ""}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-5 h-5 ${wished ? "fill-primary" : ""}` })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  ) });
}
const WHATSAPP_NUMBER = "923310292105";
const STORE_ADDRESS = "New Karachi, APWA School ki back side";
function CartDrawer() {
  const { items, isOpen, close, inc, dec, remove, total, clear } = useCart();
  const checkout = async () => {
    if (items.length === 0) return;
    const { value: form } = await Swal.fire({
      title: "Complete your order",
      html: `
        <input id="sw-name" class="swal2-input" placeholder="Full Name">
        <input id="sw-phone" class="swal2-input" placeholder="Phone Number">
        <textarea id="sw-address" class="swal2-textarea" placeholder="Delivery Address"></textarea>
        <input id="sw-city" class="swal2-input" placeholder="City">
        <textarea id="sw-notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>
      `,
      focusConfirm: false,
      confirmButtonText: "Send via WhatsApp",
      confirmButtonColor: "#d6336c",
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("sw-name").value.trim();
        const phone = document.getElementById("sw-phone").value.trim();
        const address = document.getElementById("sw-address").value.trim();
        const city = document.getElementById("sw-city").value.trim();
        const notes = document.getElementById("sw-notes").value.trim();
        if (!name || !phone || !address || !city) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }
        return { name, phone, address, city, notes };
      }
    });
    if (!form) return;
    try {
      await supabase.from("orders").insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes || null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price
        })),
        total
      });
    } catch (e) {
      console.error("Failed to save order", e);
    }
    const lines = [
      "*New Order — Affan Cosmetics*",
      "",
      "*Items:*",
      ...items.map(
        (i) => `• ${i.name} × ${i.qty} = Rs ${i.price * i.qty}`
      ),
      "",
      `*Total: Rs ${total}*`,
      "",
      "*Customer Details:*",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `City: ${form.city}`,
      `Address: ${form.address}`,
      form.notes ? `Notes: ${form.notes}` : "",
      "",
      `*Store Address:* ${STORE_ADDRESS}`
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    Swal.fire({
      icon: "success",
      title: "Order sent!",
      text: "We'll confirm your order on WhatsApp shortly.",
      timer: 2200,
      showConfirmButton: false
    });
    clear();
    close();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm",
      onClick: close,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.aside,
        {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { type: "spring", damping: 25 },
          onClick: (e) => e.stopPropagation(),
          className: "absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-glow flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "p-6 border-b flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-gradient", children: [
                "Your Bag (",
                items.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, className: "p-2 hover:bg-secondary rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your bag is empty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Add some beauty essentials" })
            ] }) : items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-xl bg-secondary/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: i.image,
                  alt: i.name,
                  className: "w-20 h-20 rounded-lg object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: i.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: i.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold mt-1", children: [
                  "Rs ",
                  i.price * i.qty
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => dec(i.id),
                      className: "p-1 rounded-full bg-background hover:text-primary",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium w-6 text-center", children: i.qty }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => inc(i.id),
                      className: "p-1 rounded-full bg-background hover:text-primary",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => remove(i.id),
                      className: "ml-auto p-1 hover:text-destructive",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] })
            ] }, i.id)) }),
            items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "p-6 border-t space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-lg font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                  "Rs ",
                  total
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: checkout,
                  className: "w-full py-4 gradient-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5" }),
                    " Order via WhatsApp"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
                "Order will be sent to ",
                WHATSAPP_NUMBER
              ] })
            ] })
          ]
        }
      )
    }
  ) });
}
function WishlistDrawer() {
  const { wishlist, wishlistOpen, closeWish, removeWish, add, setViewProduct } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: wishlistOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm",
      onClick: closeWish,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.aside,
        {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { type: "spring", damping: 25 },
          onClick: (e) => e.stopPropagation(),
          className: "absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-glow flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "p-6 border-b flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-gradient flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 text-primary fill-primary" }),
                "Wishlist (",
                wishlist.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeWish, className: "p-2 hover:bg-secondary rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: wishlist.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your wishlist is empty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Tap the heart on products to save them" })
            ] }) : wishlist.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-xl bg-secondary/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    closeWish();
                    setViewProduct(p);
                  },
                  className: "shrink-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: p.image,
                      alt: p.name,
                      className: "w-20 h-20 rounded-lg object-contain bg-background hover:scale-105 transition"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      closeWish();
                      setViewProduct(p);
                    },
                    className: "text-left w-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate hover:text-primary transition", children: p.name })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: p.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-1", children: p.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold mt-1", children: [
                  "Rs ",
                  p.price
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        closeWish();
                        setViewProduct(p);
                      },
                      className: "text-xs px-3 py-1.5 bg-secondary border border-border rounded-full font-medium flex items-center gap-1 hover:border-primary",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                        " View"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        add(p);
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "success",
                          title: `${p.name} added to cart`,
                          showConfirmButton: false,
                          timer: 1600
                        });
                      },
                      className: "text-xs px-3 py-1.5 gradient-primary text-primary-foreground rounded-full font-medium flex items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3 h-3" }),
                        " Add"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => removeWish(p.id),
                      className: "ml-auto p-1 hover:text-destructive",
                      "aria-label": "Remove",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] })
            ] }, p.id)) })
          ]
        }
      )
    }
  ) });
}
function BottomBar({ onSearch }) {
  const { count, open, wishCount, openWish } = useCart();
  const { settings } = useSettings();
  const num = (settings.social?.whatsapp || settings.info?.phone || "923310292105").replace(/\D/g, "");
  const wa = `https://wa.me/${num}`;
  const items = [
    {
      icon: House,
      label: "Home",
      onClick: () => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
    },
    { icon: Search, label: "Search", onClick: onSearch },
    {
      icon: ShoppingBag,
      label: "Cart",
      onClick: open,
      badge: count
    },
    { icon: Heart, label: "Wishlist", onClick: openWish, badge: wishCount },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      onClick: () => window.open(wa, "_blank")
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background/90 backdrop-blur-xl shadow-glow rounded-full border border-border px-2 py-2 flex items-center gap-1", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: it.onClick,
      "aria-label": it.label,
      className: "relative p-3 rounded-full hover:bg-secondary transition",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "w-5 h-5" }),
        it.badge ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 right-0 w-4 h-4 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center", children: it.badge }) : null
      ]
    },
    it.label
  )) }) });
}
function SearchDialog({
  open,
  onClose,
  onSelect
}) {
  const [q, setQ] = reactExports.useState("");
  const { allProducts } = useShop();
  const results = q.trim() ? allProducts.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8) : allProducts.slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      className: "fixed inset-0 z-[80] bg-black/60 backdrop-blur-md p-4 flex items-start justify-center pt-24",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.95, y: -20 },
          animate: { scale: 1, y: 0 },
          exit: { scale: 0.95, y: -20 },
          onClick: (e) => e.stopPropagation(),
          className: "bg-background rounded-3xl shadow-glow w-full max-w-2xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-5 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-5 h-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  value: q,
                  onChange: (e) => setQ(e.target.value),
                  placeholder: "Search lipstick, perfume, foundation...",
                  className: "flex-1 bg-transparent outline-none text-lg"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 hover:bg-secondary rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto p-3", children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-12 text-muted-foreground", children: "No products found" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: results.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  onSelect(p);
                  onClose();
                },
                className: "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: p.image,
                      alt: p.name,
                      className: "w-14 h-14 rounded-lg object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: p.category })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
                    "Rs ",
                    p.price
                  ] })
                ]
              }
            ) }, p.id)) }) })
          ]
        }
      )
    }
  ) });
}
function Footer() {
  const { categories } = useShop();
  const { settings } = useSettings();
  const s = settings.social ?? {};
  const info = settings.info ?? {};
  const phone = info.phone || "+923310292105";
  const email = info.email || "hello@affancosmetics.com";
  const address = info.address || "New Karachi, APWA School ki back side, Karachi, Pakistan";
  const wa = s.whatsapp || phone.replace(/\D/g, "");
  const social = [
    s.instagram && { icon: Instagram, href: s.instagram, label: "Instagram" },
    s.facebook && { icon: Facebook, href: s.facebook, label: "Facebook" },
    s.youtube && { icon: Youtube, href: s.youtube, label: "Youtube" },
    s.tiktok && { icon: Music2, href: s.tiktok, label: "TikTok" },
    { icon: MessageCircle, href: `https://wa.me/${wa.replace(/\D/g, "")}`, label: "WhatsApp" }
  ].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-secondary/40 mt-16 pt-16 pb-28 md:pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Affan Cosmetics", className: "h-20 md:h-24 w-auto mb-4 drop-shadow-md" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Premium cosmetic essentials delivered to your doorstep across Karachi." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-4", children: "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: categories.slice(0, 6).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" }),
            className: "text-sm text-muted-foreground hover:text-primary",
            children: c.name
          }
        ) }, c.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: address })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${phone}`, className: "hover:text-primary", children: phone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${email}`, className: "hover:text-primary", children: email })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-4", children: "Follow Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: social.map((s2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: s2.href,
            target: "_blank",
            rel: "noreferrer",
            "aria-label": s2.label,
            className: "w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:gradient-primary hover:text-primary-foreground transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(s2.icon, { className: "w-4 h-4" })
          },
          s2.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-6", children: "Cash on delivery available across Pakistan." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border mt-12 pt-6 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Affan Cosmetics. All rights reserved."
    ] })
  ] }) });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndexInner, {}) });
}
function IndexInner() {
  const [active, setActive] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState(false);
  const {
    viewProduct,
    setViewProduct
  } = useCart();
  const {
    categories,
    isLoading
  } = useShop();
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const current = viewProduct ?? active;
  const close = () => {
    setActive(null);
    setViewProduct(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { onSearch: () => setSearch(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSlider, {}),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-32 text-center text-muted-foreground", children: "Loading collections…" }) : categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-32 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground mb-2", children: "No products yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Admin can add categories & products from the dashboard." })
      ] }) : categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategorySection, { category: c, onView: setActive }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDialog, { product: current, onClose: close }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomBar, { onSearch: () => setSearch(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchDialog, { open: search, onClose: () => setSearch(false), onSelect: setActive })
  ] });
}
export {
  Index as component
};
