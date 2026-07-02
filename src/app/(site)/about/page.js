"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TiktokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef(null);
  const bioRef = useRef(null);

  const brandBlue = "#012169";

  const images = [
    { src: "/images/img1.jpg", alt: "Modern Home 1" },
    { src: "/images/img2.jpg", alt: "Modern Home 2" },
    { src: "/images/img3.jpg", alt: "Modern Home 3" },
    { src: "/images/img4.png", alt: "Modern Home 4" },
  ];

  const socialLinks = [
    { icon: InstagramIcon, href: "https://www.instagram.com/marlenafew.cbsw/", label: "Instagram", color: "#E4405F" },
    { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61565034290975", label: "Facebook", color: "#1877F2" },
    { icon: YoutubeIcon, href: "https://www.youtube.com/@MarlenaFew", label: "YouTube", color: "#FF0000" },
    { icon: TiktokIcon, href: "https://www.tiktok.com/@marlenafew.cbsw", label: "TikTok", color: "#000000" },
  ];

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

      gsap.from(bioRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const frameVariants = [
    { rotate: -3, y: 20 },
    { rotate: 2, y: -10 },
    { rotate: -2, y: 15 },
    { rotate: 3, y: -5 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #012069c7 0%, #1a3a7adc 25%, #4a6fa5 45%, #8fa8d0 60%, #86a9d8 75%, #9cc5ee 90%, #c7e0f8 100%)"
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="text-xs sm:text-sm text-white/70 uppercase tracking-[0.3em] font-medium">
            Who We Are
          </span>
        </motion.div>

        <div ref={headingRef} className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/80 leading-tight max-w-4xl mx-auto">
            We craft modern homes that blend{" "}
            <span className="text-white font-medium">elegance</span>,{" "}
            <span className="text-white font-medium">comfort</span>, and{" "}
            <span className="text-white font-medium">functionality</span>,
          </h2>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-white/60 font-light max-w-3xl mx-auto">
            creating refined spaces that inspire better living and deliver lasting value{" "}
            <span className="text-white font-medium">every day.</span>
          </p>
        </div>

        <div ref={imagesRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-20 sm:mb-28">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="about-image relative group cursor-pointer"
              initial={{ opacity: 0, y: 50, rotate: frameVariants[index % 4].rotate }}
              whileInView={{ 
                opacity: 1, 
                y: frameVariants[index % 4].y,
                rotate: frameVariants[index % 4].rotate 
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0, 
                y: -10,
                zIndex: 10,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[#012169]/0 group-hover:bg-[#012169]/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto group-hover:bg-[#012169]/30 transition-colors duration-500" />
                </div>
              </div>
              <motion.div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#012169]/30 group-hover:bg-[#012169]/50 transition-colors duration-300"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
              />
            </motion.div>
          ))}
        </div>

        <div ref={bioRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="text-xs text-white/70 uppercase tracking-[0.3em] font-medium">
                About Me
              </span>
            </motion.div>

            <motion.h3 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#012169] mb-8 leading-tight"
            >
              Hi, I&apos;m{" "}
              <span className="relative">
                Marlena
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="#012169" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </span>
            </motion.h3>

            <motion.div variants={itemVariants} className="space-y-5 text-gray-200 text-base sm:text-lg leading-relaxed">
              <p>
                If you&apos;re looking for a Realtor who believes in{" "}
                <span className="text-[#012169] font-medium">honesty</span>,{" "}
                <span className="text-[#012169] font-medium">communication</span>, and making the process feel a little less stressful, you&apos;re in the right place.
              </p>
              <p>
                My background is in <span className="text-[#012169] font-medium">healthcare</span>, where I learned the importance of patience, compassion, and showing up for people when they need support. Those same values guide the way I work with my clients today.
              </p>
              <p>
                I know buying or selling a home can feel overwhelming at times, but you don&apos;t have to navigate it alone. Whether you&apos;re just starting to explore your options or ready to make a move, I&apos;m here to help every step of the way.
              </p>
              <p className="text-[#012169] font-medium text-lg">
                I believe real estate should feel personal, and I look forward to getting to know your story.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10">
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium mb-4">
                Connect With Me
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl border border-gray-300 flex items-center justify-center text-gray-500 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.1, 
                      y: -3,
                      backgroundColor: social.color,
                      borderColor: social.color,
                      color: "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-3/4 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/img1.jpg"
                alt="Marlena Few"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#012169]/30 via-transparent to-transparent" />
            </div>
            <motion.div
              className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-white rounded-2xl shadow-xl p-4 sm:p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#012169]">12+</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Years Experience</p>
            </motion.div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-[#012169]/10" />
            <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-[#012169]/5" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}