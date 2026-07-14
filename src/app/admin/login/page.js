"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 👈 FIX: import Image
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  X,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        router.replace(redirectPath);
      } else {
        setError(data.error || data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div
      className={`min-h-screen bg-[#39518A] flex items-center justify-center relative overflow-hidden px-4 ${inter.variable} font-(family-name:--font-inter)`}
    >
      {/* Background with watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
            <Image
              src="/images/logo1.png"
              alt="Watermark"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-[#1b3454] border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all"
      >
        <Home size={16} />
        <span className="text-xs font-medium hidden sm:inline">Back Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#2B7FFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-[#1b3454] backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-10 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25">
              <ShieldCheck size={22} className="text-[#2B7FFF]" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
              >
                Admin Panel
              </h1>
              <p className="text-[11px] text-white/40 uppercase tracking-[0.2em]">
                Secure Access
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-500/15 border border-red-500/25 rounded-xl"
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
                  autoComplete="email"
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={14} className="text-white/30 hover:text-white/60" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
                  autoComplete="current-password"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setPassword("")}
                    className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={14} className="text-white/30 hover:text-white/60" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-white/30" />
                  ) : (
                    <Eye size={16} className="text-white/30" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFields}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white/5 border border-white/10 text-white/50 text-sm font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex-1"
              >
                <X size={14} />
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2B7FFF] hover:bg-[#4D94FF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[#2B7FFF]/20 hover:shadow-[#2B7FFF]/30"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-white/20 text-xs mt-8">
            Protected area — Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
}