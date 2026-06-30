"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, X, Home, Building2, BookOpen, Phone, Star, FileText, User } from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

// Default links with icons
const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Services", href: "/properties", icon: Building2 },
  { label: "Blog", href: "/blog", icon: BookOpen },
];

const CMS_LINKS = [
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Testimonials & Stories", href: "/blog", icon: Star },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

export default function FullscreenMenu({ isOpen, onClose }) {
  const circleRef = useRef(null);
  const menuRef = useRef(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // GSAP Pulse Animation for blue circle
  useEffect(() => {
    if (!isOpen || !circleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scale: 1.3,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      gsap.to(circleRef.current, {
        opacity: 0.6,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });

    return () => ctx.revert();
  }, [isOpen]);

  // GSAP slide-in animation for desktop menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* ========== DESKTOP MENU (md and above) - Same as original ========== */}
      <div
        ref={menuRef}
        className="hidden md:flex fixed top-25 left-0 right-0 z-[999] justify-center px-4 lg:px-8"
      >
        <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Top Section: Preview + Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Left: Hero Preview Image */}
            <div className="relative h-44 lg:h-auto lg:min-h-[280px]">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                alt="Marlena Properties Preview"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Preview Logo with Animated Blue Circle */}
              <div className="absolute top-3 left-3">
                <div className="relative w-24 h-8 flex items-center justify-center">
                  <div
                    ref={circleRef}
                    className="absolute w-9 h-9 rounded-full bg-[#012169]/80"
                    style={{ transform: "scale(1)" }}
                  />
                  <div className="relative z-10 w-20 h-7">
                    <Image
                      src="/images/logo.png"
                      alt="Marlena"
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Title */}
              <div className="absolute bottom-3 left-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  Marlena Few
                </h2>
              </div>
            </div>

            {/* Right: Navigation Links */}
            <div className="p-5 lg:p-6 bg-white">
              <div className="grid grid-cols-2 gap-6">
                
                {/* Main Pages */}
                <div>
                  <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">
                    Main Pages
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {DEFAULT_NAV_LINKS.map((link, index) => (
                      <Link 
                        key={index} 
                        href={link.href} 
                        onClick={onClose}
                        className="group relative py-1.5 text-gray-600 hover:text-[#012169] transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#012169] transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CMS Pages */}
                <div>
                  <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">
                    CMS Pages
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {CMS_LINKS.map((link, index) => (
                      <Link 
                        key={index} 
                        href={link.href} 
                        onClick={onClose}
                        className="group relative py-1.5 text-gray-600 hover:text-[#012169] transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#012169] transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Section: Email + Buttons */}
          <div className="border-t border-gray-100 p-4 flex items-center justify-between gap-3">
            
            <a 
              href="mailto:marlena-few@coldwellbanker.ca" 
              className="flex items-center gap-2 text-gray-500 hover:text-[#012169] transition-colors"
            >
              <Mail size={15} />
              <span className="text-sm font-medium">marlena-few@coldwellbanker.ca</span>
            </a>

            <div className="flex items-center gap-2">
              <Link 
                href="/admin/login"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-colors"
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </Link>
              <Link 
                href="/properties"
                onClick={onClose}
                className="px-4 py-2 bg-[#0a1628] text-white text-sm font-semibold rounded-lg hover:bg-[#012169] transition-colors"
              >
                All Properties
              </Link>
              <button 
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center bg-[#0a1628] text-white rounded-lg hover:bg-[#012169] transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ========== MOBILE SIDEBAR (below md) ========== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-[998] bg-black/70 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Mobile Sidebar - Slides from Right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-[999] w-[300px] bg-white shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                onClick={onClose}
                className="absolute top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-[#012169] text-white hover:bg-[#0a1628] transition-colors shadow-lg"
              >
                <X size={18} />
              </motion.button>

              {/* Hero Image */}
              <div className="relative h-36 shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                  alt="Marlena"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30">
                    <div className="w-6 h-6 rounded-full bg-[#012169] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">M</span>
                    </div>
                    <span className="text-white font-semibold text-xs">Marlena Few</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3">
                  <p className="text-white/70 text-[10px] tracking-widest uppercase">Premium Real Estate</p>
                  <h2 className="text-lg font-bold text-white tracking-tight">Find Your Dream Home</h2>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 px-4 py-3 overflow-hidden">
                
                {/* Main Pages */}
                <div className="mb-2">
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    Main Pages
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    {DEFAULT_NAV_LINKS.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={onClose}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0f4ff] transition-all duration-300"
                        >
                          <div className="w-8 h-8 rounded-md bg-[#f0f4ff] group-hover:bg-[#012169] flex items-center justify-center transition-all duration-300">
                            <Icon size={15} className="text-[#012169] group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="text-gray-700 group-hover:text-[#012169] font-medium text-sm transition-colors duration-300">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-2" />

                {/* CMS Pages */}
                <div>
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    Explore
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    {CMS_LINKS.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={onClose}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0f4ff] transition-all duration-300"
                        >
                          <div className="w-8 h-8 rounded-md bg-gray-50 group-hover:bg-[#012169] flex items-center justify-center transition-all duration-300">
                            <Icon size={15} className="text-[#012169] group-hover:text-white transition-colors duration-300" />
                          </div>
                          <span className="text-gray-700 group-hover:text-[#012169] font-medium text-sm transition-colors duration-300">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom Section - Under Contact Us */}
              <div className="border-t border-gray-100 px-4 py-3 shrink-0">
                
                {/* Email */}
                <a
                  href="mailto:marlena-few@coldwellbanker.ca"
                  className="flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#012169] transition-colors mb-3"
                >
                  <Mail size={12} />
                  <span className="text-[11px] font-medium">marlena-few@coldwellbanker.ca</span>
                </a>

                {/* Centered Buttons */}
                <div className="flex flex-col items-center gap-2">
                  {/* Admin Login */}
                  <Link
                    href="/admin/login"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-all duration-300"
                  >
                    <ShieldCheck size={16} />
                    <span>Admin Login</span>
                  </Link>

                  {/* All Properties - Blue Color */}
                  <Link
                    href="/properties"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#012169] text-white text-sm font-semibold rounded-xl hover:bg-[#0a1628] transition-all duration-300"
                  >
                    <FileText size={16} />
                    <span>All Properties</span>
                  </Link>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}