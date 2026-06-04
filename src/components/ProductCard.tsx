import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export function ProductCard({
  product,
  onView,
}: {
  product: Product;
  onView: (p: Product) => void;
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
      color: "#3a0a1f",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="card-3d group bg-card rounded-2xl overflow-hidden shadow-soft cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-secondary/60 to-background flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
        />
        {product.oldPrice && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold gradient-primary text-primary-foreground">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(product);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: wished ? "info" : "success",
              title: wished
                ? `${product.name} removed from wishlist`
                : `${product.name} added to wishlist`,
              showConfirmButton: false,
              timer: 1500,
            });
          }}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-md transition hover:text-primary ${
            wished ? "opacity-100 text-primary" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-primary" : ""}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => onView(product)}
            className="flex-1 py-2 bg-background/95 backdrop-blur rounded-full text-sm font-medium hover:bg-background flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2 gradient-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">Rs {product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}