import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    if (localStorage.getItem("adminToken")) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Welcome back, Admin!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-background px-4">
      {/* Background glow effects */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 size-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, var(--neon), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 size-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, var(--neon-2), transparent 70%)" }}
      />
      
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-mono transition-colors"
        >
          <ArrowLeft size={16} /> // back to home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass p-8 rounded-2xl neon-border relative"
      >
        <div className="text-center mb-8">
          <div className="mx-auto size-12 rounded-xl bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] grid place-items-center font-bold text-primary-foreground font-mono text-xl shadow-neon">
            A
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Admin Terminal</h2>
          <p className="mt-2 text-sm text-muted-foreground">Authorized access only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-muted-foreground">
                <Mail size={16} />
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/30 transition-all font-display text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-muted-foreground">
                <Lock size={16} />
              </span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/30 transition-all font-display text-foreground"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] py-3 font-medium text-primary-foreground shadow-neon disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Console"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
