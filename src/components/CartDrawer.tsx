import { useCart } from "@/lib/cart-store";
import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { supabase } from "@/integrations/supabase/client";

const WHATSAPP_NUMBER = "923310292105";
const STORE_ADDRESS = "New Karachi, APWA School ki back side";

export function CartDrawer() {
  const { items, isOpen, close, inc, dec, remove, total, clear } = useCart();

  const checkout = async () => {
    if (items.length === 0) return;
    const { value: form } = await Swal.fire({
      title: "Complete your order",
      html: `
        <input id="sw-name" class="swal2-input" placeholder="Full Name">
        <input id="sw-phone" class="swal2-input" placeholder="Phone Number">
        <textarea id="sw-address" class="swal2-textarea" placeholder="Delivery Address"></textarea>
        <input id="sw-city" class="swal2-input" placeholder="City">
        <textarea id="sw-notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>
      `,
      focusConfirm: false,
      confirmButtonText: "Send via WhatsApp",
      confirmButtonColor: "#d6336c",
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById("sw-name") as HTMLInputElement).value.trim();
        const phone = (document.getElementById("sw-phone") as HTMLInputElement).value.trim();
        const address = (document.getElementById("sw-address") as HTMLTextAreaElement).value.trim();
        const city = (document.getElementById("sw-city") as HTMLInputElement).value.trim();
        const notes = (document.getElementById("sw-notes") as HTMLTextAreaElement).value.trim();
        if (!name || !phone || !address || !city) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }
        return { name, phone, address, city, notes };
      },
    });
    if (!form) return;

    // Save order to database
    try {
      await supabase.from("orders").insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes || null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
        total,
      });
    } catch (e) {
      console.error("Failed to save order", e);
    }

    const lines = [
      "*New Order — Affan Cosmetics*",
      "",
      "*Items:*",
      ...items.map(
        (i) => `• ${i.name} × ${i.qty} = Rs ${i.price * i.qty}`,
      ),
      "",
      `*Total: Rs ${total}*`,
      "",
      "*Customer Details:*",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `City: ${form.city}`,
      `Address: ${form.address}`,
      form.notes ? `Notes: ${form.notes}` : "",
      "",
      `*Store Address:* ${STORE_ADDRESS}`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    Swal.fire({
      icon: "success",
      title: "Order sent!",
      text: "We'll confirm your order on WhatsApp shortly.",
      timer: 2200,
      showConfirmButton: false,
    });
    clear();
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
          onClick={close}
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
              <h2 className="text-xl font-bold text-gradient">
                Your Bag ({items.length})
              </h2>
              <button onClick={close} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p>Your bag is empty</p>
                  <p className="text-sm mt-2">Add some beauty essentials</p>
                </div>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.category}</p>
                      <p className="text-primary font-bold mt-1">
                        Rs {i.price * i.qty}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => dec(i.id)}
                          className="p-1 rounded-full bg-background hover:text-primary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => inc(i.id)}
                          className="p-1 rounded-full bg-background hover:text-primary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => remove(i.id)}
                          className="ml-auto p-1 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <footer className="p-6 border-t space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rs {total}</span>
                </div>
                <button
                  onClick={checkout}
                  className="w-full py-4 gradient-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition"
                >
                  <MessageCircle className="w-5 h-5" /> Order via WhatsApp
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  Order will be sent to {WHATSAPP_NUMBER}
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}