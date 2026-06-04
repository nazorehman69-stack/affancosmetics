import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Affan Cosmetics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        await Swal.fire({
          icon: "success",
          title: "Account created!",
          text: "You can now sign in.",
          timer: 1800,
          showConfirmButton: false,
        });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Authentication failed",
        text: err instanceof Error ? err.message : "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-glow p-8 border">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Affan Cosmetics" className="h-20 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-center text-gradient mb-2">
          {mode === "login" ? "Admin Login" : "Create Admin Account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Manage categories, products and orders
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-semibold shadow-glow disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-sm text-muted-foreground hover:text-primary mt-4"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}