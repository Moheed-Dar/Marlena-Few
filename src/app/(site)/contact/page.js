"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Home,
  Building2,
  Briefcase,
  PhoneCall,
} from "lucide-react";
import { motion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import ContactForm from "@/components/forms/ContactForm"; // adjust path as needed

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
// FAQ DATA
// ============================================
const FAQS = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We typically respond within 24 hours during business days. For urgent matters, please call us directly.",
  },
  {
    q: "Do you charge any consultation fee?",
    a: "No, our initial consultation is completely free. We believe in building trust first.",
  },
  {
    q: "Can I schedule a property visit?",
    a: "Absolutely! Just mention the property you're interested in and we'll arrange a visit at your convenience.",
  },
];

// ============================================
// SERVICES DATA
// ============================================
const SERVICES = [
  {
    icon: Home,
    title: "Buy Property",
    desc: "Find your dream home from our verified listings across premium locations.",
  },
  {
    icon: Building2,
    title: "Sell Property",
    desc: "List your property and reach thousands of potential buyers instantly.",
  },
  {
    icon: Briefcase,
    title: "Property Management",
    desc: "Complete property management and tenant handling services.",
  },
  {
    icon: MessageSquare,
    title: "Legal Assistance",
    desc: "Expert legal guidance for property documentation and transfers.",
  },
];

// ============================================
// QUICK LINKS DATA
// ============================================
const QUICK_LINKS = [
  { label: "Browse Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Home", href: "/" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ContactPage() {
  return (
    <div
      className={`min-h-screen bg-[#0b1120] relative overflow-x-hidden ${inter.variable} font-(family-name:--font-inter)`}
    >
      {/* ===== BACKGROUND =====
          FIX: Changed from `fixed` to `absolute` — prevents per-frame GPU repaint
          on scroll which was causing mobile glitch/tearing artifact.
      ===== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(61,139,253,0.06)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(61,139,253,0.04)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
            <Link href="/" className="hover:text-[#3D8BFD] transition-colors">
              Home
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-white/60">Contact</span>
          </div>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-linear-to-r from-[#3D8BFD] to-transparent" />
              <span className="text-[10px] font-bold text-[#3D8BFD]/60 uppercase tracking-[0.25em]">
                Get In Touch
              </span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-[4.25rem] text-white tracking-tight leading-[1.15] mb-4 ${playfair.variable} font-(family-name:--font-playfair)`}
            >
              Contact Us
            </h1>
            <p className="text-white/35 text-sm sm:text-[15px] leading-relaxed">
              Have a question about a property or need expert advice? Our
              dedicated team is ready to help you find your perfect investment.
            </p>
          </div>
        </div>
      </div>

      {/* ===== FORM + SIDEBAR ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* ===== LEFT — FORM ===== */}
          <div className="lg:col-span-2">
            {/*
              FIX: Added `isolate` — creates a stacking context so blur layers
              inside do not bleed into sibling layers, preventing tearing on mobile.
            */}
            <div className="relative isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl border border-white/6 overflow-hidden">
              {/*
                FIX: `hidden md:block` on blur decorators — heavy blur layers are
                removed on mobile entirely, eliminating GPU compositing overload.
              */}
              <div className="hidden md:block absolute top-0 left-0 w-48 h-48 bg-[#3D8BFD]/4 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2 pointer-events-none" />
              <div className="hidden md:block absolute bottom-0 right-0 w-48 h-48 bg-[#3D8BFD]/4 rounded-full blur-3xl translate-x-1/3 translate-y-1/2 pointer-events-none" />

              <div className="relative z-10 p-5 sm:p-7">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Why Contact Us */}
              <div className="relative hidden md:block isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl p-5 border border-white/6 overflow-hidden">
                <div className="hidden md:block absolute top-0 right-0 w-28 h-28 bg-[#3D8BFD]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-base text-white mb-1 font-playfair">
                    Why Contact Us?
                  </h3>
                  <div className="w-10 h-0.5 bg-linear-to-r from-[#3D8BFD] to-transparent rounded-full mb-4" />
                  <div className="space-y-3">
                    {[
                      {
                        title: "Expert Guidance",
                        desc: "Personalized recommendations based on your budget & preferences.",
                      },
                      {
                        title: "Verified Listings",
                        desc: "All properties verified by our team for your peace of mind.",
                      },
                      {
                        title: "Best Deals",
                        desc: "Exclusive off-market properties & early bird offers.",
                      },
                      {
                        title: "Free Consultation",
                        desc: "No hidden fees, completely free to start.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#3D8BFD]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#3D8BFD]/15">
                          <CheckCircle2 size={11} className="text-[#3D8BFD]/70" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white/80">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-white/25 leading-snug mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Our Services */}
              <div className="relative isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl p-5 border border-white/6 overflow-hidden">
                <div className="hidden md:block absolute top-0 left-0 w-28 h-28 bg-[#3D8BFD]/4 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} className="text-[#3D8BFD]/70" />
                    <h4 className="text-[9px] font-bold text-white/25 uppercase tracking-[0.25em]">
                      Our Services
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {SERVICES.map((item, i) => (
                      <Link
                        key={i}
                        href="/services"
                        className="flex items-center gap-3 p-2 bg-white/3 rounded-lg border border-white/5 hover:bg-[#3D8BFD]/5 hover:border-[#3D8BFD]/15 hover:scale-[1.02] transition-all"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#3D8BFD]/10 flex items-center justify-center shrink-0">
                          <item.icon size={13} className="text-[#3D8BFD]/70" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white/80">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-white/25 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MORE INFO SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#3D8BFD]/30 to-transparent" />
            <span className="text-[10px] font-bold text-[#3D8BFD]/70 uppercase tracking-[0.25em]">
              More Info
            </span>
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#3D8BFD]/30 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl text-white font-playfair">
            Quick Access
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Emergency Contact */}
          <div className="relative hidden md:block isolate bg-linear-to-br from-red-500/8 to-red-500/3 rounded-2xl p-5 border border-red-500/20 overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/20">
                  <PhoneCall size={15} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-300">Emergency</p>
                  <p className="text-[11px] text-white/30 mt-0.5">Urgent inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-500/15">
                <Phone size={12} className="text-red-400/70" />
                <span className="text-xs font-semibold text-red-300">+1 226 932 5002</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="relative hidden md:block isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl p-5 border border-white/6 overflow-hidden hover:border-[#3D8BFD]/15 transition-colors">
            <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 bg-[#3D8BFD]/3 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[#3D8BFD]/70" />
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Office Hours
                </h4>
              </div>
              <div className="space-y-2">
                {[
                  { day: "Mon - Fri", time: "9 AM - 7 PM", active: true },
                  { day: "Saturday", time: "10 AM - 5 PM", active: true },
                  { day: "Sunday", time: "Closed", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className={`text-xs ${item.active ? "text-white/60" : "text-white/25"}`}>
                      {item.day}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.active
                          ? "bg-[#3D8BFD]/10 text-[#3D8BFD] border border-[#3D8BFD]/15"
                          : "bg-white/5 text-white/30 border border-white/5"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="relative isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl p-5 border border-white/6 overflow-hidden hover:border-[#3D8BFD]/15 transition-colors">
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                Quick Links
              </h4>
              <div className="space-y-1">
                {QUICK_LINKS.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center justify-between group py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight
                      size={11}
                      className="text-white/20 group-hover:text-[#3D8BFD]/60 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted Agency */}
          <div className="relative hidden md:block isolate bg-[#3D8BFD]/5 rounded-2xl p-5 border border-[#3D8BFD]/15 overflow-hidden hover:border-[#3D8BFD]/25 transition-colors">
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#3D8BFD]/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#3D8BFD]/15 flex items-center justify-center shrink-0 border border-[#3D8BFD]/20">
                  <ShieldCheck size={16} className="text-[#3D8BFD]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#3D8BFD]">Trusted Agency</p>
                  <p className="text-[11px] text-white/25">Since 2020</p>
                </div>
              </div>
              <div className="space-y-2">
                {["Verified Listings", "Secure Deals", "Happy Clients"].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#3D8BFD]/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={9} className="text-[#3D8BFD]/70" />
                    </div>
                    <span className="text-[11px] text-white/40">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#3D8BFD]/30 to-transparent" />
            <span className="text-[10px] font-bold text-[#3D8BFD]/70 uppercase tracking-[0.25em]">
              Common Questions
            </span>
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#3D8BFD]/30 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl text-white font-playfair">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative isolate bg-linear-to-br from-white/5 to-white/2 rounded-2xl p-6 border border-white/6 overflow-hidden hover:border-[#3D8BFD]/15 transition-colors group"
            >
              <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#3D8BFD]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-[#3D8BFD]/10 flex items-center justify-center mb-3 border border-[#3D8BFD]/15">
                  <span className="text-[#3D8BFD] font-bold text-sm">{index + 1}</span>
                </div>
                <h3 className="text-base text-white mb-2 leading-snug font-playfair">
                  {faq.q}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}