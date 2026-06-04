import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { X, ShoppingBag, Star, Minus, Plus, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export function ProductDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add, toggleWish, isWished } = useCart();
  const [qty, setQty] = useState(1);
  const wished = product ? isWished(product.id) : false;

  useEffect(() => {
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
      showConfirmButton: false,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 md:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-2xl md:rounded-3xl shadow-glow max-w-4xl w-full grid md:grid-cols-2 overflow-hidden my-2 md:my-8 max-h-[92vh] md:max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/90 hover:bg-secondary z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 sm:h-64 md:h-auto md:aspect-square bg-gradient-to-br from-secondary/60 to-background overflow-hidden flex items-center justify-center p-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 md:p-10 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-primary mb-2 font-semibold">
                {product.category}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">{product.name}</h2>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(124 reviews)</span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-baseline gap-3 mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  Rs {product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    Rs {product.oldPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-2 border rounded-full px-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-2 hover:text-primary"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-2 hover:text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 md:py-4 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={() => product && toggleWish(product)}
                  aria-label="Wishlist"
                  className={`p-3 md:p-4 border border-border rounded-full hover:bg-secondary ${
                    wished ? "text-primary border-primary" : ""
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wished ? "fill-primary" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}