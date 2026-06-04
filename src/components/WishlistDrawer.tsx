import { useCart } from "@/lib/cart-store";
import { X, Trash2, ShoppingBag, Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, closeWish, removeWish, add, setViewProduct } = useCart();

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
          onClick={closeWish}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-glow flex flex-col"
          >
            <header className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gradient flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                Wishlist ({wishlist.length})
              </h2>
              <button onClick={closeWish} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Your wishlist is empty</p>
                  <p className="text-sm mt-2">Tap the heart on products to save them</p>
                </div>
              ) : (
                wishlist.map((p) => (
                  <div key={p.id} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
                    <button
                      onClick={() => {
                        closeWish();
                        setViewProduct(p);
                      }}
                      className="shrink-0"
                    >
                      <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 rounded-lg object-contain bg-background hover:scale-105 transition"
                    />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => {
                          closeWish();
                          setViewProduct(p);
                        }}
                        className="text-left w-full"
                      >
                        <p className="font-semibold text-sm truncate hover:text-primary transition">{p.name}</p>
                      </button>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                      <p className="text-primary font-bold mt-1">Rs {p.price}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button
                          onClick={() => {
                            closeWish();
                            setViewProduct(p);
                          }}
                          className="text-xs px-3 py-1.5 bg-secondary border border-border rounded-full font-medium flex items-center gap-1 hover:border-primary"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => {
                            add(p);
                            Swal.fire({
                              toast: true,
                              position: "top-end",
                              icon: "success",
                              title: `${p.name} added to cart`,
                              showConfirmButton: false,
                              timer: 1600,
                            });
                          }}
                          className="text-xs px-3 py-1.5 gradient-primary text-primary-foreground rounded-full font-medium flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" /> Add
                        </button>
                        <button
                          onClick={() => removeWish(p.id)}
                          className="ml-auto p-1 hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}