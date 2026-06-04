import { Home, Search, ShoppingBag, MessageCircle, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useSettings } from "@/lib/use-settings";

export function BottomBar({ onSearch }: { onSearch: () => void }) {
  const { count, open, wishCount, openWish } = useCart();
  const { settings } = useSettings();
  const num = (settings.social?.whatsapp || settings.info?.phone || "923310292105").replace(/\D/g, "");
  const wa = `https://wa.me/${num}`;
  const items = [
    {
      icon: Home,
      label: "Home",
      onClick: () =>
        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }),
    },
    { icon: Search, label: "Search", onClick: onSearch },
    {
      icon: ShoppingBag,
      label: "Cart",
      onClick: open,
      badge: count,
    },
    { icon: Heart, label: "Wishlist", onClick: openWish, badge: wishCount },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      onClick: () => window.open(wa, "_blank"),
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden">
      <div className="bg-background/90 backdrop-blur-xl shadow-glow rounded-full border border-border px-2 py-2 flex items-center gap-1">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={it.onClick}
            aria-label={it.label}
            className="relative p-3 rounded-full hover:bg-secondary transition"
          >
            <it.icon className="w-5 h-5" />
            {it.badge ? (
              <span className="absolute top-0 right-0 w-4 h-4 text-[10px] font-bold gradient-primary text-primary-foreground rounded-full flex items-center justify-center">
                {it.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}