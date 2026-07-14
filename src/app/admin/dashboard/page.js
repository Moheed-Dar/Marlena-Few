"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/api";
import { getStoredUser, clearStoredUser } from "@/lib/auth";
import {
  LogOut,
  Users,
  Building2,
  ChevronDown,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Eye,
  MessageSquare,
  Menu,
  X,
  User,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// ============================================
// LAZY LOAD THE PAGE COMPONENTS
// ============================================
const PropertiesPage = lazy(() => import("@/app/admin/dashboard/properties/page"));
const LeadsPage = lazy(() => import("@/app/admin/dashboard/leads/page"));
const ContactsPage = lazy(() => import("@/app/admin/dashboard/contacts/page"));

// ============================================
// TAB CONFIG – Added "Home" as first tab
// ============================================
const TABS = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard, component: null },
  { id: "properties", label: "Properties", icon: Building2, component: PropertiesPage },
  { id: "leads", label: "Leads", icon: Users, component: LeadsPage },
  { id: "contacts", label: "Contacts", icon: MessageSquare, component: ContactsPage },
];

// ============================================
// STATS – shown only on Home tab
// ============================================
const STATS = [
  {
    label: "Total Properties",
    value: "142",
    icon: Building2,
    color: "#2B7FFF",
    bg: "rgba(43,127,255,0.1)",
    border: "rgba(43,127,255,0.2)",
  },
  {
    label: "Total Leads",
    value: "89",
    icon: Users,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    label: "Total Views",
    value: "12.4k",
    icon: Eye,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    label: "Inquiries",
    value: "34",
    icon: MessageSquare,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // ---- Auth check ----
  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.replace("/admin/login");
      return;
    }
    setUser(storedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    setShowDropdown(false);
    try {
      await logoutAdmin();
    } catch {
      // API fail bhi toh local clean karo
    }
    clearStoredUser();
    router.replace("/admin/login");
  }, [router]);

  // ---- Close dropdown on outside click ----
  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showDropdown]);

  // ---- Get active component ----
  const activeTabData = TABS.find((t) => t.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#13273f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#2B7FFF]/60" />
          <p className="text-white/40 text-sm tracking-wider uppercase">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#13273f] flex ${inter.variable} font-(family-name:--font-inter)`}
    >
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1b3454] border-r border-white/10 shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25">
            <ShieldCheck size={16} className="text-[#2B7FFF]" />
          </div>
          <span
            className={`text-white font-bold text-sm ${playfair.variable} font-(family-name:--font-playfair)`}
          >
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom – empty (removed Pro Tip) */}
        <div className="p-4 border-t border-white/10">
          <div className="text-[10px] text-white/20 text-center">
            v1.0 • Admin Panel
          </div>
        </div>
      </aside>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#1b3454] border-r border-white/10 z-50 lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25">
                    <ShieldCheck size={16} className="text-[#2B7FFF]" />
                  </div>
                  <span className="text-white font-bold text-sm">Admin</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                >
                  <X size={18} className="text-white/50" />
                </button>
              </div>
              <nav className="py-6 px-3 space-y-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                          : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/10">
                <div className="text-[10px] text-white/20 text-center">
                  v1.0 • Admin Panel
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#1b3454] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5"
            >
              <Menu size={20} className="text-white/50" />
            </button>
            <h2 className="text-white font-semibold text-sm hidden sm:block">
              {TABS.find((t) => t.id === activeTab)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="relative flex items-center gap-3">
            {/* User dropdown – removed notification bell */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25 text-[#2B7FFF] text-xs font-bold uppercase">
                  {user?.name?.[0] || "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-xs font-semibold leading-tight">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-white/40 text-[10px] leading-tight">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-white/30 hidden sm:block transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 w-52 bg-[#1b3454] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-white/40 text-xs truncate">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          router.push("/admin/profile");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                      >
                        <User size={14} />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {loggingOut ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <LogOut size={14} />
                        )}
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* ---- HOME TAB: show welcome + stats + quick overview ---- */}
          {activeTab === "home" ? (
            <>
              <div className="mb-6">
                <h1
                  className={`text-2xl sm:text-3xl font-bold text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                >
                  Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                </h1>
                <p className="text-white/40 text-sm">
                  Here&apos;s what&apos;s happening with your platform today.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="relative bg-[#1b3454] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors overflow-hidden group"
                    >
                      <div
                        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: stat.bg }}
                      />
                      <div className="relative flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                        >
                          <Icon size={18} style={{ color: stat.color }} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                      <p className="text-white/40 text-xs">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick overview placeholder */}
              <div className="bg-[#1b3454] rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/40 text-sm">Recent Activity</p>
                    <p className="text-white text-sm mt-2">No recent activity to show.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/40 text-sm">Upcoming Tasks</p>
                    <p className="text-white text-sm mt-2">All caught up!</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ---- OTHER TABS: only the lazy-loaded component ---- */
            <div className="bg-[#1b3454] rounded-2xl p-4 sm:p-6 border border-white/10 min-h-100">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={28} className="animate-spin text-[#2B7FFF]/50" />
                  </div>
                }
              >
                {ActiveComponent && <ActiveComponent />}
              </Suspense>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}