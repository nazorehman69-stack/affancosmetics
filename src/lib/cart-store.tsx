import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = Product & { qty: number };

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  add: (p: Product) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  total: number;
  count: number;
  // Wishlist
  wishlist: Product[];
  wishlistOpen: boolean;
  toggleWish: (p: Product) => void;
  removeWish: (id: string) => void;
  isWished: (id: string) => boolean;
  openWish: () => void;
  closeWish: () => void;
  wishCount: number;
  // Quick view
  viewProduct: Product | null;
  setViewProduct: (p: Product | null) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const add = (p: Product) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      return found
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const inc = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    );
  const dec = (id: string) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const toggleWish = (p: Product) =>
    setWishlist((prev) =>
      prev.find((i) => i.id === p.id)
        ? prev.filter((i) => i.id !== p.id)
        : [...prev, p],
    );
  const removeWish = (id: string) =>
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  const isWished = (id: string) => wishlist.some((i) => i.id === id);

  return (
    <Ctx.Provider
      value={{
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
        setViewProduct,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}