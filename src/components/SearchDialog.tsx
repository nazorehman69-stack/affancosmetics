import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { type Product } from "@/lib/products";
import { useShop } from "@/lib/use-shop";

export function SearchDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (p: Product) => void;
}) {
  const [q, setQ] = useState("");
  const { allProducts } = useShop();
  const results = q.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase()),
        )
        .slice(0, 8)
    : allProducts.slice(0, 6);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md p-4 flex items-start justify-center pt-24"
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-3xl shadow-glow w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-5 border-b">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search lipstick, perfume, foundation..."
                className="flex-1 bg-transparent outline-none text-lg"
              />
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {results.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">
                  No products found
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          onSelect(p);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary text-left"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.category}
                          </p>
                        </div>
                        <span className="font-bold text-primary">Rs {p.price}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}