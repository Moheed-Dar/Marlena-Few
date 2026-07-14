"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Quote, Star, MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-Time Homebuyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Marlena helped us find our perfect home, and she made the entire process so easy. Any questions we had got answered immediately. She put things in simple terms for us to understand what was happening every step of the way. She was quick, professional and kind. She also went above and beyond what we expected of her!! I will recommend her to anyone buying or selling.",
    date: "28 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Seller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "I couldn't be happier with all the hard work and effort that Marlena put into ensuring a quick and successful sale of my home. She was always available to respond to any questions and address any issues that came up throughout the entire process from start to finish. Marlena was always so kind and helpful, and she went above and beyond to accommodate the special circumstances.",
    date: "44 weeks ago",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const brandBlue = "#012169";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const timer = setTimeout(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setIsVisible(true);
        }
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a1628 0%, ${brandBlue} 50%, #0a1628 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-10 sm:mb-14 lg:mb-16 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle size={16} className="text-white/70" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium text-white/60">
              Client Stories
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-3">
            Real Experiences,
            <br />
            <span className="text-blue-200">Trusted by Clients</span>
          </h2>

          <p
            ref={subtitleRef}
            className={`text-white/50 text-sm sm:text-base md:text-lg max-w-lg mx-auto transition-all duration-700 delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Hear how our clients found homes that truly match their lifestyle
            and expectations.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8"
        >
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:-translate-y-1.5 will-change-transform transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                transitionDelay: `${300 + index * 180}ms`,
              }}
            >
              {/* Top glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(74,111,165,0.15) 0%, transparent 70%)",
                }}
              />

              <div className="relative p-5 sm:p-6 lg:p-8">
                {/* Quote icon */}
                <div className="mb-4">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <Quote size={16} className="text-white/30" />
                  </div>
                </div>

                {/* Stars & Date */}
                <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < t.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/15"
                      }
                    />
                  ))}
                  <span className="text-white/30 text-xs ml-2">{t.date}</span>
                </div>

                {/* Text */}
                <p
                  className="text-white/75 text-sm sm:text-[15px] leading-relaxed mb-5 sm:mb-7"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Divider */}
                <div
                  className="w-full h-px mb-4 sm:mb-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                />

                {/* Author */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0"
                    style={{
                      boxShadow:
                        "0 0 0 2px rgba(255,255,255,0.15), 0 0 0 4px rgba(255,255,255,0.05)",
                    }}
                  >
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 44px, 48px"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-white/40 truncate">{t.role}</p>
                  </div>
                </div>
              </div>

              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}