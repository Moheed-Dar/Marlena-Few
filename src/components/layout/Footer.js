"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Send, ArrowUpRight, ArrowUp } from "lucide-react";

export default function Footer() {
  const brandBlue = "#012169";
  const darkBg = "#020c1f";
  const [email, setEmail] = useState("");
  
  // Scroll to top button state
  const [isVisible, setIsVisible] = useState(false);

  const currentYear = new Date().getFullYear();

  // Scroll listener for button visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  // Real SVG Social Media Icons with actual links
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/marlenafew.cbsw/",
      hoverColor: "#E4405F",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61565034290975",
      hoverColor: "#1877F2",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@MarlenaFew",
      hoverColor: "#FF0000",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@marlenafew.cbsw",
      hoverColor: "#000000",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  // ✅ Updated: Sky blue hover color (#2B7FFF) for quick links
  const linkClass =
    "group relative text-gray-400 hover:text-[#2B7FFF] transition-colors duration-300 flex items-center gap-2 text-sm py-1 w-fit";

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: darkBg }}
    >
      {/* Decorative Top Border Gradient */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#012169] to-transparent" />

      {/* Subtle Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${brandBlue}25 0%, transparent 70%)`,
          filter: "blur(120px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid Layout - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mb-12">
          {/* Column 1: Logo, Description & Social Links */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/images/logo2.png"
                alt="Marlena Few Logo"
                width={120}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover luxury living with Marlena Few. We specialize in premium
              real estate, offering exclusive properties that redefine elegance
              and comfort.
            </p>

            {/* Real Social Icons with actual links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.hoverColor;
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = `0 4px 10px ${social.hoverColor}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#012169]" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClass}>
                    {/* ✅ Updated: Arrow hover color to #2B7FFF */}
                    <ArrowUpRight
                      size={14}
                      className="text-gray-600 group-hover:text-[#2B7FFF] transition-all duration-300 -rotate-45 group-hover:rotate-0 group-hover:scale-110"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    {/* ✅ Updated: Underline color to #2B7FFF */}
                    <span className="absolute bottom-0 left-3 w-0 h-px bg-[#2B7FFF] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#012169]" />
              Contact Us
            </h3>

            <div className="space-y-4 mb-6">
              <a
                href="#"
                className="group flex items-start gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 shrink-0">
                  <MapPin
                    size={14}
                    className="text-[#012169] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 mt-1.5">
                  123 Luxury Lane, Beverly Hills, CA 90210
                </span>
              </a>

              <a
                href="tel:+1234567890"
                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 shrink-0">
                  <Phone
                    size={14}
                    className="text-[#012169] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  +1 (234) 567-890
                </span>
              </a>

              <a
                href="mailto:info@marlenafew.com"
                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 shrink-0">
                  <Mail
                    size={14}
                    className="text-[#012169] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  info@marlenafew.com
                </span>
              </a>
            </div>

            {/* Newsletter Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#012169]/80 focus:ring-1 focus:ring-[#012169]/50 transition-all duration-300"
              />
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#012169] flex items-center justify-center text-white hover:bg-white hover:text-[#012169] transition-all duration-300 shadow-lg shadow-[#012169]/30"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} Marlena Few. All rights reserved.
          </p>
        </div>
      </div>

      {/* ✅ SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 cursor-pointer right-6 z-50 w-11 h-11 rounded-full bg-[#2B7FFF] text-white flex items-center justify-center shadow-lg shadow-[#2B7FFF]/30 hover:bg-[#5A9AFF] hover:scale-110 transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}