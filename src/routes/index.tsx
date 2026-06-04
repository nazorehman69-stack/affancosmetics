import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { CategorySection } from "@/components/CategorySection";
import { ProductDialog } from "@/components/ProductDialog";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { BottomBar } from "@/components/BottomBar";
import { SearchDialog } from "@/components/SearchDialog";
import { Footer } from "@/components/Footer";
import { CartProvider, useCart } from "@/lib/cart-store";
import { type Product } from "@/lib/products";
import { useShop } from "@/lib/use-shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affan Cosmetics — Premium Beauty Store Karachi" },
      {
        name: "description",
        content:
          "Shop premium cosmetics, lipsticks, foundations, perfumes & skincare at Affan Cosmetics. Order on WhatsApp, fast delivery across Karachi.",
      },
      { property: "og:title", content: "Affan Cosmetics — Premium Beauty Store" },
      {
        property: "og:description",
        content: "Premium cosmetics and beauty essentials. Order via WhatsApp.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <IndexInner />
    </CartProvider>
  );
}

function IndexInner() {
  const [active, setActive] = useState<Product | null>(null);
  const [search, setSearch] = useState(false);
  const { viewProduct, setViewProduct } = useCart();
  const { categories, isLoading } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const current = viewProduct ?? active;
  const close = () => {
    setActive(null);
    setViewProduct(null);
  };

  return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => setSearch(true)} />
        <main>
          <HeroSlider />
          {isLoading ? (
            <div className="py-32 text-center text-muted-foreground">Loading collections…</div>
          ) : categories.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-lg text-muted-foreground mb-2">No products yet.</p>
              <p className="text-sm text-muted-foreground">
                Admin can add categories &amp; products from the dashboard.
              </p>
            </div>
          ) : (
            categories.map((c) => (
              <CategorySection key={c.id} category={c} onView={setActive} />
            ))
          )}
        </main>
        <Footer />
        <ProductDialog product={current} onClose={close} />
        <CartDrawer />
        <WishlistDrawer />
        <BottomBar onSearch={() => setSearch(true)} />
        <SearchDialog
          open={search}
          onClose={() => setSearch(false)}
          onSelect={setActive}
        />
      </div>
  );
}
