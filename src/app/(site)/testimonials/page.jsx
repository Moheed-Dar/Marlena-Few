"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Star, MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
    const cardsRef = useRef(null);

    const brandBlue = "#012169";

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });

            gsap.from(".t-card", {
                opacity: 0,
                y: 60,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
        >
            {/* Dark background with subtle gradient */}
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
                        background: `radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div
                    ref={headingRef}
                    className="text-center mb-14 sm:mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <MessageCircle size={16} className="text-white/70" />
                        <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-white/60">
                            Client Stories
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                    >
                        Real Experiences,
                        <br />
                        <span className="text-blue-200">Trusted by Clients</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/50 text-base sm:text-lg max-w-lg mx-auto"
                    >
                        Hear how our clients found homes that truly match their lifestyle and expectations.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.id}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="t-card group relative rounded-2xl overflow-hidden border border-white/10"
                            style={{
                                background: `linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
                            }}
                        >
                            {/* Subtle top glow */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, rgba(74,111,165,0.15) 0%, transparent 70%)`,
                                }}
                            />

                            <div className="relative p-6 sm:p-8">
                                {/* Quote icon */}
                                <div className="mb-5">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                                    >
                                        <Quote size={18} className="text-white/30" />
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-4">
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
                                <p className="text-white/75 text-[15px] leading-relaxed mb-7">
                                    &ldquo;{t.text}&rdquo;
                                </p>

                                {/* Divider */}
                                <div
                                    className="w-full h-px mb-5"
                                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                                />

                                {/* Author */}
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-offset-2"
                                        style={{
                                            ringColor: "rgba(255,255,255,0.2)",
                                            ringOffsetColor: "transparent",
                                        }}
                                    >
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">
                                            {t.name}
                                        </h4>
                                        <p className="text-xs text-white/40">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hover border glow */}
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.3)`,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}