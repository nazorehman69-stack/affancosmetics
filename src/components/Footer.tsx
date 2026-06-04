import { Instagram, Facebook, Youtube, MessageCircle, Mail, MapPin, Phone, Music2 } from "lucide-react";
import { useShop } from "@/lib/use-shop";
import { useSettings } from "@/lib/use-settings";
import logo from "@/assets/logo.png";

export function Footer() {
  const { categories } = useShop();
  const { settings } = useSettings();
  const s = settings.social ?? {};
  const info = settings.info ?? {};
  const phone = info.phone || "+923310292105";
  const email = info.email || "hello@affancosmetics.com";
  const address = info.address || "New Karachi, APWA School ki back side, Karachi, Pakistan";
  const wa = s.whatsapp || phone.replace(/\D/g, "");
  const social = [
    s.instagram && { icon: Instagram, href: s.instagram, label: "Instagram" },
    s.facebook && { icon: Facebook, href: s.facebook, label: "Facebook" },
    s.youtube && { icon: Youtube, href: s.youtube, label: "Youtube" },
    s.tiktok && { icon: Music2, href: s.tiktok, label: "TikTok" },
    { icon: MessageCircle, href: `https://wa.me/${wa.replace(/\D/g, "")}`, label: "WhatsApp" },
  ].filter(Boolean) as { icon: any; href: string; label: string }[];
  return (
    <footer className="bg-secondary/40 mt-16 pt-16 pb-28 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <img src={logo} alt="Affan Cosmetics" className="h-20 md:h-24 w-auto mb-4 drop-shadow-md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium cosmetic essentials delivered to your doorstep across Karachi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() =>
                      document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${phone}`} className="hover:text-primary">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:gradient-primary hover:text-primary-foreground transition"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Cash on delivery available across Pakistan.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Affan Cosmetics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}