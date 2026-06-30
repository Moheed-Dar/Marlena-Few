"use client"; // <- یہ لائن ایرر فکس کر دیگی

import Image from "next/image";
import { MapPin, Phone, Mail, Send, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const brandBlue = "#012169";
  const darkBg = "#020c1f"; 

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Properties", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const propertyLinks = [
    { name: "Modern Villa", href: "#" },
    { name: "Luxury Estate", href: "#" },
    { name: "Ocean View", href: "#" },
    { name: "Skyline Penthouse", href: "#" },
    { name: "Coastal Retreat", href: "#" },
  ];

  // Real SVG Social Media Icons with Brand Hover Colors
  const socialLinks = [
    { 
      name: "Facebook", 
      href: "#", 
      hoverColor: "#1877F2",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    },
    { 
      name: "Twitter", 
      href: "#", 
      hoverColor: "#000000", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    },
    { 
      name: "Instagram", 
      href: "#", 
      hoverColor: "#E4405F",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    },
    { 
      name: "LinkedIn", 
      href: "#", 
      hoverColor: "#0A66C2",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    }
  ];

  // Reusable animated link class
  const linkClass = "group relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm py-1 w-fit";

  return (
    <footer className="relative overflow-hidden text-white" style={{ backgroundColor: darkBg }}>
      {/* Decorative Top Border Gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#012169] to-transparent" />

      {/* Subtle Background Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${brandBlue}25 0%, transparent 70%)`, filter: "blur(120px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image 
                src="/images/logo2.png" 
                alt="Marlena Few Logo" 
                width={140} 
                height={50} 
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover luxury living with Marlena Few. We specialize in premium real estate, offering exclusive properties that redefine elegance and comfort.
            </p>
            
            {/* Real Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
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
                    <ArrowUpRight 
                      size={14} 
                      className="text-gray-600 group-hover:text-[#012169] transition-all duration-300 -rotate-45 group-hover:rotate-0 group-hover:scale-110" 
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-3 w-0 h-[1px] bg-[#012169] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Properties */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#012169]" />
              Featured Properties
            </h3>
            <ul className="space-y-2">
              {propertyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClass}>
                    <ArrowUpRight 
                      size={14} 
                      className="text-gray-600 group-hover:text-[#012169] transition-all duration-300 -rotate-45 group-hover:rotate-0 group-hover:scale-110" 
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-3 w-0 h-[1px] bg-[#012169] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#012169]" />
              Contact Us
            </h3>
            
            <div className="space-y-4 mb-6">
              <a href="#" className="group flex items-start gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 flex-shrink-0">
                  <MapPin size={14} className="text-[#012169] group-hover:text-white transition-colors" />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 mt-1.5">
                  123 Luxury Lane, Beverly Hills, CA 90210
                </span>
              </a>
              
              <a href="tel:+1234567890" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 flex-shrink-0">
                  <Phone size={14} className="text-[#012169] group-hover:text-white transition-colors" />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  +1 (234) 567-890
                </span>
              </a>
              
              <a href="mailto:info@marlenafew.com" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-[#012169] group-hover:border-transparent transition-all duration-300 flex-shrink-0">
                  <Mail size={14} className="text-[#012169] group-hover:text-white transition-colors" />
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
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Marlena Few. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="relative text-gray-500 hover:text-white text-sm transition-colors duration-300 group">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#012169] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative text-gray-500 hover:text-white text-sm transition-colors duration-300 group">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#012169] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative text-gray-500 hover:text-white text-sm transition-colors duration-300 group">
              Sitemap
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#012169] group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}