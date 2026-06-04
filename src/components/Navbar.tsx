import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingBag, Heart, User, Sparkles, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useShop } from "@/lib/use-shop";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, open: openCart, wishCount, openWish } = useCart();
  const { categories } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-soft"
            : "bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <img
                src={logo}
                alt="Affan Cosmetics"
                className="h-14 md:h-20 w-auto object-contain drop-shadow-md"
              />
            </button>

            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center px-4">
              <button
                onClick={() => scrollTo("home")}
                className="px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium hover:text-primary transition relative group whitespace-nowrap"
              >
                Home
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-primary group-hover:w-full transition-all" />
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollTo(c.id)}
                  className="px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium hover:text-primary transition relative group whitespace-nowrap"
                >
                  {c.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-primary group-hover:w-full transition-all" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                aria-label="Admin"
                className="p-2 hover:bg-secondary rounded-full transition hidden sm:block"
              >
                <Shield className="w-5 h-5" />
              </Link>
              <button
                onClick={onSearch}
                aria-label="Search"
                className="p-2 hover:bg-secondary rounded-full transition hidden sm:block"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={openWish}
                aria-label="Wishlist"
                className="p-2 hover:bg-secondary rounded-full transition hidden sm:block relative"
              >
                <Heart className="w-5 h-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </button>
              <button
                onClick={openCart}
                aria-label="Cart"
                className="p-2 hover:bg-secondary rounded-full transition relative hidden md:block"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden p-2 hover:bg-secondary rounded-full transition"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-glow p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gradient">Menu</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => scrollTo("home")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-secondary font-medium flex items-center gap-3"
                >
                  <User className="w-4 h-4 text-primary" /> Home
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => scrollTo(c.id)}
                    className="text-left px-4 py-3 rounded-lg hover:bg-secondary font-medium flex items-center gap-3"
                  >
                    <Sparkles className="w-4 h-4 text-primary" /> {c.name}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}