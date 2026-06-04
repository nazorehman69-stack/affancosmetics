import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/use-settings";

export function HeroSlider() {
  const [i, setI] = useState(0);
  const { settings } = useSettings();
  const slides =
    settings.hero && settings.hero.length > 0 ? settings.hero : heroSlides;
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[i % slides.length];
  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="relative h-[88vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Floating 3D-ish blobs */}
      <div className="absolute top-32 right-20 w-72 h-72 rounded-full gradient-primary opacity-30 blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-20 left-40 w-96 h-96 rounded-full bg-accent opacity-20 blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 container mx-auto h-full flex items-center px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl pt-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Premium Beauty Store</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              <span className="text-gradient">{slide.title}</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  document
                    .getElementById("lipstick")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow hover:scale-105 transition-transform"
              >
                {slide.cta}
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("perfume")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-background/60 backdrop-blur-md border border-primary/30 rounded-full font-semibold hover:bg-background transition"
              >
                Browse Categories
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        aria-label="Prev"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 backdrop-blur-md hover:bg-background transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 backdrop-blur-md hover:bg-background transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-10 gradient-primary" : "w-2 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}