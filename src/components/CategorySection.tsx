import type { Category, Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

export function CategorySection({
  category,
  onView,
}: {
  category: Category;
  onView: (p: Product) => void;
}) {
  return (
    <section id={category.id} className="py-16 md:py-24 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative h-56 md:h-72 rounded-3xl overflow-hidden mb-10 md:mb-14 bg-gradient-to-br from-secondary via-background to-secondary"
        >
          <img
            src={category.banner}
            alt={category.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/90 mb-3 font-medium">
                Collection
              </p>
              <h2 className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">
                {category.name}
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-md drop-shadow">
                {category.tagline}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}