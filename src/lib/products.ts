import heroBanner from "@/assets/herobanner.png";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  banner: string;
  products: Product[];
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

export const heroSlides = [
  {
    image: heroBanner,
    title: "Affan Cosmetics",
    subtitle: "Discover your signature beauty",
    cta: "Shop Now",
  },
  {
    image: img("photo-1596462502278-27bfdc403348"),
    title: "New Season Glow",
    subtitle: "Premium beauty essentials",
    cta: "Explore Now",
  },
  {
    image: img("photo-1583241800698-9c3550778cdc"),
    title: "Luxury Made Affordable",
    subtitle: "Hand-picked luxury cosmetics",
    cta: "View Collection",
  },
  {
    image: img("photo-1503236823255-94609f598e71"),
    title: "Bold Lips, Bold You",
    subtitle: "New lipstick shades just landed",
    cta: "Shop Lipstick",
  },
];