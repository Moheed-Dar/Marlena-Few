"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, ChevronLeft, ChevronRight, Star, MessageCircle, Home } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "First-Time Homebuyer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        propertyImage: "/banner/banner2.jpg",
        rating: 5,
        text: "Marlena helped us find our perfect home, and she made the entire process so easy. Any questions we had got answered immediately. She put things in simple terms for us to understand what was happening every step of the way. She was quick, professional and kind. She also went above and beyond what we expected of her!! I will recommend her to anyone buying or selling. I am beyond grateful we chose to trust her through this process.",
        date: "28 weeks ago",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Home Seller",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        propertyImage: "/banner/banner4.jpg",
        rating: 5,
        text: "I couldn't be happier with all the hard work and effort that Marlena put into ensuring a quick and successful sale of my home. She was always available to respond to any questions and address any issues that came up throughout the entire process from start to finish. Marlena was always so kind and helpful, and she went above and beyond to accommodate the special circumstances that I was dealing with in downsizing from a large home to an apartment. I found Marlena to not only be a knowledgeable professional but also a warm and wonderful person that helped me through the stressful process of selling my home.",
        date: "44 weeks ago",
    },
];

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const cardsRef = useRef(null);
    const intervalRef = useRef(null);
    const isMounted = useRef(false);

    const brandBlue = "#012169";
    const brandBlueLight = "#4a6fa5";

    const currentTestimonial = testimonials[currentIndex];

    const nextTestimonial = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [isAnimating]);

    const prevTestimonial = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [isAnimating]);

    const goToTestimonial = useCallback((index) => {
        if (index === currentIndex || isAnimating) return;
        setIsAnimating(true);
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex, isAnimating]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 700);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        intervalRef.current = setInterval(() => {
            setIsAnimating(true);
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const resetInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setIsAnimating(true);
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);
    }, []);

    const handleNext = useCallback(() => {
        nextTestimonial();
        resetInterval();
    }, [nextTestimonial, resetInterval]);

    const handlePrev = useCallback(() => {
        prevTestimonial();
        resetInterval();
    }, [prevTestimonial, resetInterval]);

    const handleGoTo = useCallback((index) => {
        goToTestimonial(index);
        resetInterval();
    }, [goToTestimonial, resetInterval]);

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
            gsap.from(cardsRef.current, {
                opacity: 0,
                y: 60,
                duration: 0.8,
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

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 120 : -120,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 120 : -120,
            opacity: 0,
        }),
    };

    const imageVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 80 : -80,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 80 : -80,
            opacity: 0,
            scale: 0.95,
        }),
    };

    const textVariants = {
        enter: {
            opacity: 0,
            y: 30,
        },
        center: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: -20,
        },
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/banner/banner4.jpg"
                    alt="Real estate background"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    priority
                />
                {/* Blue gradient overlays */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${brandBlue}ee 0%, ${brandBlue}cc 40%, #0a2a5ecc 100%)`,
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at 70% 30%, transparent 0%, ${brandBlue}aa 70%)`,
                    }}
                />
                {/* Subtle noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={headingRef}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 sm:mb-20"
                >
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-2 mb-4"
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
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                        >
                            Real Experiences,
                            <br />
                            <span className="text-blue-200">Trusted by Clients</span>
                        </motion.h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/50 text-base sm:text-lg max-w-sm lg:text-right"
                    >
                        Hear how our clients found homes that truly match their lifestyle
                        and expectations.
                    </motion.p>
                </div>

                <div ref={cardsRef} className="relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                        <div className="lg:col-span-6 relative overflow-hidden">
                            <AnimatePresence mode="wait" custom={direction} initial={false}>
                                <motion.div
                                    key={`image-${currentIndex}`}
                                    custom={direction}
                                    variants={imageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-2xl"
                                >
                                    <Image
                                        src={currentTestimonial.propertyImage}
                                        alt={currentTestimonial.name + "'s property"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority={currentIndex === 0}
                                        loading={currentIndex === 0 ? "eager" : "lazy"}
                                    />
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            background: `linear-gradient(180deg, transparent 50%, ${brandBlue}dd 100%)`,
                                        }}
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                                        <div>
                                            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                                                <Home size={14} />
                                                <span>Featured Property</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(currentTestimonial.rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={18}
                                                        className="fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
                                            <span className="text-white text-xs font-medium">
                                                {currentTestimonial.date}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div
                                className="absolute -top-4 -right-4 w-28 h-28 rounded-full border-2 opacity-15 pointer-events-none"
                                style={{ borderColor: "white" }}
                            />
                            <div
                                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10 pointer-events-none"
                                style={{ backgroundColor: "white" }}
                            />
                        </div>

                        <div className="lg:col-span-6 relative" style={{ height: "420px" }}>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={`content-${currentIndex}`}
                                    variants={textVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    className="absolute inset-0"
                                >
                                    <blockquote className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed mb-8 font-light">
                                        &ldquo;{currentTestimonial.text}&rdquo;
                                    </blockquote>

                                    <div className="flex items-center gap-4">
                                        <div
                                            className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 shrink-0 ring-offset-transparent"
                                            style={{ ringColor: "rgba(255,255,255,0.3)" }}
                                        >
                                            <Image
                                                src={currentTestimonial.avatar}
                                                alt={currentTestimonial.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white text-lg">
                                                {currentTestimonial.name}
                                            </h4>
                                            <p className="text-sm text-blue-200/70">
                                                {currentTestimonial.role}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={
                                                            i < currentTestimonial.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-white/20"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-12">
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleGoTo(index)}
                                    disabled={isAnimating}
                                    className="group relative p-1 disabled:cursor-not-allowed"
                                    aria-label={`Go to testimonial ${index + 1}`}
                                >
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${index === currentIndex
                                                ? "scale-125"
                                                : "bg-white/25 hover:bg-white/40"
                                            }`}
                                        style={{
                                            backgroundColor:
                                                index === currentIndex ? "white" : undefined,
                                        }}
                                    />
                                    {index === currentIndex && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute inset-0 rounded-full border-2"
                                            style={{ borderColor: "white" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrev}
                                disabled={isAnimating}
                                className="w-12 h-12 cursor-pointer rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 backdrop-blur-sm"
                                style={{
                                    borderColor: "rgba(255,255,255,0.3)",
                                    color: "white",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isAnimating) {
                                        e.currentTarget.style.backgroundColor = "white";
                                        e.currentTarget.style.color = brandBlue;
                                        e.currentTarget.style.borderColor = "white";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                                    e.currentTarget.style.color = "white";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                                }}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                disabled={isAnimating}
                                className="w-12 h-12 cursor-pointer rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 backdrop-blur-sm"
                                style={{
                                    borderColor: "rgba(255,255,255,0.3)",
                                    color: "white",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isAnimating) {
                                        e.currentTarget.style.backgroundColor = "white";
                                        e.currentTarget.style.color = brandBlue;
                                        e.currentTarget.style.borderColor = "white";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                                    e.currentTarget.style.color = "white";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                                }}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}