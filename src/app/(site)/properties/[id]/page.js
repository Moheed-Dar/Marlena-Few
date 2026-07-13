// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Bed,
//   Bath,
//   ArrowLeft,
//   Phone,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Building2,
//   Home,
//   CalendarDays,
//   Eye,
//   CheckCircle2,
//   Layers,
//   ZoomIn,
//   Ruler,
//   Tag,
//   ShieldCheck,
//   Grid3x3,
//   Image as ImageIcon,
//   Crown,
//   Gem,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { gsap } from "gsap";
// import { getPropertyById } from "@/lib/api";
// import { Playfair_Display, Inter } from "next/font/google";
// import LeadForm from "@/components/forms/LeadForm";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// // ============================================
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER_IMG =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [showLightbox, setShowLightbox] = useState(false);

//   const heroRef = useRef(null);

//   // ============================================
//   // FETCH — ab lib/api.js ka function use kar raha hai
//   // ============================================
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await getPropertyById(id);
//         setProperty(res?.data || res);
//       } catch (err) {
//         setError("Property not found or removed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProperty();
//   }, [id]);

//   // ============================================
//   // GSAP
//   // ============================================
//   useEffect(() => {
//     if (!property || loading) return;
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         heroRef.current,
//         { opacity: 0, scale: 1.02 },
//         { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
//       );
//       gsap.fromTo(
//         ".detail-item",
//         { opacity: 0, y: 24 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.5,
//           stagger: 0.07,
//           ease: "power2.out",
//           delay: 0.2,
//         }
//       );
//     });
//     return () => ctx.revert();
//   }, [property, loading]);

//   // ============================================
//   // SAFE IMAGES
//   // ============================================
//   const rawImages = property?.images || [];
//   const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
//   const mainImage =
//     getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

//   // ============================================
//   // IMAGE NAVIGATION
//   // ============================================
//   const nextImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev + 1) % images.length);
//   };
//   const prevImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showLightbox) return;
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "Escape") setShowLightbox(false);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showLightbox, images.length]);

//   // ============================================
//   // SHARE
//   // ============================================
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: property?.title,
//         text: `Check out ${property?.title} at ${property?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   // ============================================
//   // LOADING
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative">
//             <div className="w-14 h-14 border-2px] border-[#2B7FFF]/20 border-t-[#2B7FFF] rounded-full animate-spin" />
//             <Gem
//               size={16}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2B7FFF]/60"
//             />
//           </div>
//           <p
//             className={`text-white/40 text-sm tracking-[0.2em] uppercase ${inter.variable} font-(family-name:--font-inter)`}
//           >
//             Loading property...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR
//   // ============================================
//   if (error || !property) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] flex flex-col items-center justify-center gap-4 px-4">
//         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
//           <X size={32} className="text-white/40" />
//         </div>
//         <h2
//           className={`text-xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//         >
//           Property Not Found
//         </h2>
//         <p className="text-white/50 text-sm text-center max-w-sm">{error}</p>
//         <Link
//           href="/properties"
//           className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF]/10 backdrop-blur-md border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm font-semibold rounded-xl hover:bg-[#2B7FFF]/20 transition-colors"
//         >
//           <ArrowLeft size={16} /> Browse Properties
//         </Link>
//       </div>
//     );
//   }

//   const currentDisplayImage =
//     images.length > 0 ? images[activeImage] || mainImage : mainImage;
//   const hasSingleImage = images.length <= 1;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <div
//       className={`min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] relative overflow-x-hidden ${inter.variable} font-(family-name:--font-inter)`}
//     >
//       {/* ===== LUXURY BACKGROUND ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.07)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.05)_0%,transparent_50%)]" />
//         <div
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(43,127,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(43,127,255,0.4) 1px, transparent 1px)",
//             backgroundSize: "80px 80px",
//           }}
//         />
//       </div>

//       {/* ===== HERO GALLERY ===== */}
//       <div className="relative mt-20 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           {/* Breadcrumb + Badges */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div className="flex items-center gap-2 text-sm text-white/30">
//               <Link
//                 href="/properties"
//                 className="hover:text-[#2B7FFF] transition-colors"
//               >
//                 Properties
//               </Link>
//               <ChevronRight size={14} />
//               <span className="text-white/60 font-medium">
//                 {property.title}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               {property.isFeatured && (
//                 <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2B7FFF]/15 text-[#6BABFF] text-[11px] font-bold rounded-full border border-[#2B7FFF]/25 backdrop-blur-sm">
//                   <Crown
//                     size={11}
//                     className="fill-[#2B7FFF] text-[#2B7FFF]"
//                   />
//                   Featured
//                 </span>
//               )}
//               <span
//                 className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full border backdrop-blur-sm ${
//                   property.status === "available"
//                     ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
//                     : property.status === "sold"
//                       ? "bg-red-500/15 text-red-300 border-red-500/25"
//                       : "bg-blue-500/15 text-blue-300 border-blue-500/25"
//                 }`}
//               >
//                 <ShieldCheck size={11} />
//                 {property.status}
//               </span>
//               <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 text-white/70 text-[11px] font-bold rounded-full border border-white/10 backdrop-blur-sm">
//                 <Tag size={11} />
//                 {property.priceType}
//               </span>
//             </div>
//           </div>

//           {/* Title & Price — LUXURY TYPOGRAPHY */}
//           <div className="mb-7">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
//               <span className="text-[10px] font-bold text-[#2B7FFF]/70 uppercase tracking-[0.25em]">
//                 Exclusive Listing
//               </span>
//             </div>
//             <h1
//               className={`text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-4 ${playfair.variable} font-(family-name:--font-playfair)`}
//             >
//               {property.title}
//             </h1>
//             <div className="flex flex-wrap items-center gap-5 sm:gap-8">
//               <div>
//                 <p
//                   className={`text-3xl sm:text-4xl lg:text-[2.75rem] text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}
//                 >
//                   {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                   {Number(property.price)?.toLocaleString()}
//                 </p>
//                 {property.priceType === "rent" && (
//                   <p className="text-white/30 text-xs mt-1">per month</p>
//                 )}
//               </div>
//               <div className="h-10 w-px bg-white/10 hidden sm:block" />
//               <div className="flex items-center gap-2 text-white/40">
//                 <MapPin size={15} className="text-[#2B7FFF]/70" />
//                 <span className="text-sm font-medium">
//                   {property.location || property.city}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ===== IMAGE GALLERY ===== */}
//           {hasSingleImage ? (
//             <div className="max-w-4xl mx-auto">
//               <div className="relative group">
//                 <div
//                   ref={heroRef}
//                   className="relative w-full aspect-16/10 sm:aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-white/10"
//                   onClick={() => setShowLightbox(true)}
//                 >
//                   <Image
//                     src={currentDisplayImage}
//                     alt={property.title || "Property"}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 1024px) 100vw, 66vw"
//                     priority
//                   />
//                   <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
//                   <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                     <ZoomIn size={18} className="text-white" />
//                   </div>
//                   <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
//                     <ImageIcon size={12} className="text-white/80" />
//                     <span className="text-white text-xs font-semibold">
//                       1 Photo
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//               <div className="lg:col-span-8 relative group">
//                 <div
//                   ref={heroRef}
//                   className="relative w-full aspect-16/10 sm:aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-[#2B7FFF]/10"
//                   onClick={() => setShowLightbox(true)}
//                 >
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={activeImage}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.4 }}
//                       className="absolute inset-0"
//                     >
//                       <Image
//                         src={currentDisplayImage}
//                         alt={property.title || "Property"}
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 100vw, 66vw"
//                         priority
//                       />
//                     </motion.div>
//                   </AnimatePresence>
//                   <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
//                   <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                     <ZoomIn size={18} className="text-white" />
//                   </div>
//                   <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-[#2B7FFF]/20">
//                     <Grid3x3 size={12} className="text-[#2B7FFF]/80" />
//                     <span className="text-white text-xs font-semibold">
//                       {activeImage + 1} / {images.length}
//                     </span>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       prevImage();
//                     }}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                   >
//                     <ChevronLeft size={20} />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       nextImage();
//                     }}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                   >
//                     <ChevronRight size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div className="lg:col-span-4 grid grid-cols-2 gap-2 h-full">
//                 {images.slice(0, 6).map((img, index) => {
//                   const safeImg = getSafeImage(img);
//                   if (!safeImg) return null;
//                   return (
//                     <button
//                       key={index}
//                       onClick={() => setActiveImage(index)}
//                       className={`relative rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-white/30 ${
//                         activeImage === index
//                           ? "ring-2 ring-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/20"
//                           : "opacity-60 hover:opacity-100"
//                       }`}
//                     >
//                       <Image
//                         src={safeImg}
//                         alt={`Property image ${index + 1}`}
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 50vw, 20vw"
//                         priority
//                       />
//                       {activeImage === index && (
//                         <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg shadow-[#2B7FFF]/50 z-10">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-3.5 h-3.5 text-white"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="3"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         </div>
//                       )}
//                       {index === 5 && images.length > 6 && (
//                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
//                           <span className="text-white font-bold text-lg">
//                             +{images.length - 6}
//                           </span>
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {/* ===== LEFT ===== */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Meta */}
//             {property.propertyCode && (
//               <div className="detail-item flex flex-wrap items-center gap-4 text-xs text-white/30">
//                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B7FFF]/5 rounded-full text-[#2B7FFF]/80 font-semibold border border-[#2B7FFF]/15">
//                   <Building2 size={12} />
//                   {property.propertyCode}
//                 </span>
//                 {property.viewsCount > 0 && (
//                   <span className="flex items-center gap-1">
//                     <Eye size={12} /> {property.viewsCount} views
//                   </span>
//                 )}
//                 {property.createdAt && (
//                   <span className="flex items-center gap-1">
//                     <CalendarDays size={12} />
//                     {new Date(property.createdAt).toLocaleDateString(
//                       "en-US",
//                       {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       }
//                     )}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Quick Stats — Luxury Cards */}
//             <div className="detail-item grid grid-cols-2 sm:grid-cols-4 gap-3">
//               {property.bedrooms > 0 && (
//                 <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
//                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
//                   <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
//                     <Bed size={18} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
//                       Beds
//                     </p>
//                     <p
//                       className={`text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.bedrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.bathrooms > 0 && (
//                 <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
//                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
//                   <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
//                     <Bath size={18} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
//                       Baths
//                     </p>
//                     <p
//                       className={`text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.bathrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {(property.areaSize || property.area) > 0 && (
//                 <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
//                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
//                   <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
//                     <Ruler size={18} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
//                       Area
//                     </p>
//                     <p
//                       className={`text-lg font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.areaSize || property.area}
//                       <span className="text-[10px] font-normal text-white/30 ml-0.5">
//                         {property.areaUnit || "sqft"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.propertyType && (
//                 <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
//                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
//                   <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
//                     <Home size={18} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
//                       Type
//                     </p>
//                     <p className="text-sm font-bold text-white leading-tight capitalize">
//                       {property.propertyType}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Description — Luxury with scrollbar */}
//             {property.description && (
//               <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
//                 <div className="absolute top-0 left-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
//                 <div className="relative">
//                   <h3
//                     className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Description
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
//                   <div
//                     className="text-white/50 text-[15px] leading-[1.9] whitespace-pre-line max-h-80 overflow-y-auto pr-3"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor:
//                         "rgba(43,127,255,0.3) transparent",
//                     }}
//                   >
//                     {property.description}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features — Luxury */}
//             {(property.features?.length > 0 ||
//               property.amenities?.length > 0) && (
//               <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
//                 <div className="relative">
//                   <h3
//                     className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Features & Amenities
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                     {[
//                       ...(property.features || []),
//                       ...(property.amenities || []),
//                     ].map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2.5 text-sm text-white/60 bg-white/3 rounded-xl px-3 py-2.5 border border-white/6 hover:bg-[#2B7FFF]/5 hover:border-[#2B7FFF]/15 transition-colors group"
//                       >
//                         <div className="w-5 h-5 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/20 transition-colors">
//                           <CheckCircle2
//                             size={12}
//                             className="text-[#2B7FFF]/70"
//                           />
//                         </div>
//                         <span className="capitalize">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Address */}
//             {property.address && (
//               <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
//                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
//                 <div className="relative">
//                   <h3
//                     className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Address
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
//                   <div className="flex items-start gap-3 bg-[#2B7FFF]/5 rounded-xl p-4 border border-[#2B7FFF]/10">
//                     <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 mt-0.5">
//                       <MapPin
//                         size={14}
//                         className="text-[#2B7FFF]/80"
//                       />
//                     </div>
//                     <p className="text-white/60 text-sm leading-relaxed">
//                       {property.address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== RIGHT SIDEBAR ===== */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24 space-y-4">
//               {/* Price + CTA — Luxury Card */}
//               <div className="relative bg-linear-to-br from-white/[0.07] to-white/8 rounded-2xl border border-white/8 overflow-hidden">
//                 <div className="absolute inset-0 bg-linear-to-br from-[#2B7FFF]/5 via-transparent to-[#2B7FFF]/3 pointer-events-none" />
//                 <div className="relative bg-linear-to-r from-[#2B7FFF]/10 via-[#2B7FFF]/5 to-transparent px-6 py-5 border-b border-white/6">
//                   <p className="text-[10px] text-[#2B7FFF]/60 uppercase tracking-[0.2em] font-bold mb-1">
//                     Asking Price
//                   </p>
//                   <p
//                     className={`text-3xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                     {Number(property.price)?.toLocaleString()}
//                   </p>
//                   <p className="text-white/30 text-xs mt-1.5 capitalize tracking-wide">
//                     {property.priceType} &bull; {property.propertyType}
//                   </p>
//                 </div>

//                 <div className="relative p-5 space-y-3">
//                   {/* ✅ LEADFORM — property ID aur title automatically jayega */}
//                   <LeadForm
//                     propertyId={property._id}
//                     propertyTitle={property.title}
//                     propertyCode={property.propertyCode}
//                     propertyPrice={property.price}
//                     propertyCurrency={property.currency}
//                     onSuccess={(data) => {
//                       console.log("Lead created:", data);
//                     }}
//                   />

//                   <div className="grid grid-cols-2 gap-2">
//                     <a
//                       href={`tel:${property.contact?.phone || ""}`}
//                       className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-colors"
//                     >
//                       <Phone size={13} /> Call
//                     </a>
//                     <a
//                       href={`mailto:${property.contact?.email || ""}`}
//                       className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-colors"
//                     >
//                       <Mail size={13} /> Email
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent */}
//               {property.addedBy && (
//                 <div className="bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-5 border border-white/8">
//                   <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-3">
//                     Listed By
//                   </h4>
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#2B7FFF]/15 shadow-lg">
//                       {property.addedBy?.avatar ? (
//                         <img
//                           src={property.addedBy.avatar}
//                           alt=""
//                           className="w-full h-full rounded-full object-cover"
//                         />
//                       ) : (
//                         <User
//                           size={20}
//                           className="text-[#2B7FFF]/70"
//                         />
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-white">
//                         {property.addedBy?.name || "Agent"}
//                       </p>
//                       <p className="text-xs text-white/30">
//                         Property Agent
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Details */}
//               <div className="bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-5 border border-white/8">
//                 <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-3">
//                   Property Details
//                 </h4>
//                 <div className="space-y-0">
//                   {property.floors && (
//                     <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
//                       <span className="text-white/30 flex items-center gap-2">
//                         <Layers size={12} /> Floors
//                       </span>
//                       <span className="font-semibold text-white">
//                         {property.floors}
//                       </span>
//                     </div>
//                   )}
//                   {property.kitchens && (
//                     <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
//                       <span className="text-white/30">Kitchens</span>
//                       <span className="font-semibold text-white">
//                         {property.kitchens}
//                       </span>
//                     </div>
//                   )}
//                   {property.yearBuilt && (
//                     <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/">
//                       <span className="text-white/30">
//                         Year Built
//                       </span>
//                       <span className="font-semibold text-white">
//                         {property.yearBuilt}
//                       </span>
//                     </div>
//                   )}
//                   {property.leadsCount > 0 && (
//                     <div className="flex items-center justify-between text-sm py-2.5">
//                       <span className="text-white/30">
//                         Interested Buyers
//                       </span>
//                       <span className="font-semibold text-[#2B7FFF]">
//                         {property.leadsCount}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Verified — Luxury */}
//               <div className="relative bg-[#2B7FFF]/5 rounded-2xl p-4 border border-[#2B7FFF]/15 overflow-hidden">
//                 <div className="absolute top-0 right-0 w-20 h-20 bg-[#2B7FFF]/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
//                 <div className="relative flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 border border-[#2B7FFF]/20">
//                     <ShieldCheck
//                       size={15}
//                       className="text-[#2B7FFF]"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-[#2B7FFF]">
//                       Verified Listing
//                     </p>
//                     <p className="text-[11px] text-white/30">
//                       Verified by our team
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== LIGHTBOX ===== */}
//       <AnimatePresence>
//         {showLightbox && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-2000 bg-black/95 flex items-center justify-center"
//             onClick={() => setShowLightbox(false)}
//           >
//             <button
//               onClick={() => setShowLightbox(false)}
//               className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 ring-1 ring-white/20"
//             >
//               <X size={20} />
//             </button>
//             <div
//               className="relative w-full h-full flex items-center justify-center px-16"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeImage}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative max-w-5xl max-h-[80vh] w-full aspect-video"
//                 >
//                   <Image
//                     src={currentDisplayImage}
//                     alt={property.title || "Property"}
//                     fill
//                     className="object-contain"
//                     sizes="100vw"
//                     priority
//                   />
//                 </motion.div>
//               </AnimatePresence>
//               {!hasSingleImage && (
//                 <>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       prevImage();
//                     }}
//                     className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                   >
//                     <ChevronLeft size={24} />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       nextImage();
//                     }}
//                     className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                   >
//                     <ChevronRight size={24} />
//                   </button>
//                 </>
//               )}
//             </div>
//             {!hasSingleImage && (
//               <div
//                 className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4"
//                 style={{ scrollbarWidth: "none" }}
//               >
//                 {images.map((img, index) => {
//                   const safeImg = getSafeImage(img);
//                   if (!safeImg) return null;
//                   return (
//                     <button
//                       key={index}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setActiveImage(index);
//                       }}
//                       className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
//                         activeImage === index
//                           ? "ring-2 ring-[#2B7FFF] scale-105"
//                           : "opacity-50 hover:opacity-80"
//                       }`}
//                     >
//                       <Image
//                         src={safeImg}
//                         alt=""
//                         fill
//                         className="object-cover"
//                         sizes="64px"
//                       />
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//             <div className="absolute top-5 left-5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full ring-1 ring-white/20">
//               <span className="text-white text-sm font-semibold">
//                 {activeImage + 1} / {images.length}
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }






"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  ArrowLeft,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Home,
  CalendarDays,
  Eye,
  Check,
  CheckCircle2,
  Layers,
  ZoomIn,
  Ruler,
  Tag,
  ShieldCheck,
  Grid3x3,
  Image as ImageIcon,
  Crown,
  Gem,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { getPropertyById } from "@/lib/api";
import { Playfair_Display, Inter } from "next/font/google";
import LeadForm from "@/components/forms/LeadForm";

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
// SAFE IMAGE HELPER
// ============================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const heroRef = useRef(null);

  // ============================================
  // FETCH
  // ============================================
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        setProperty(res?.data || res);
      } catch (err) {
        setError("Property not found or removed");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  // ============================================
  // GSAP
  // ============================================
  useEffect(() => {
    if (!property || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );
      gsap.fromTo(
        ".detail-item",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    });
    return () => ctx.revert();
  }, [property, loading]);

  // ============================================
  // SAFE IMAGES
  // ============================================
  const rawImages = property?.images || [];
  const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
  const mainImage =
    getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

  // ============================================
  // IMAGE NAVIGATION
  // ============================================
  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setShowLightbox(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, images.length]);

  // ============================================
  // SHARE
  // ============================================
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property?.title,
        text: `Check out ${property?.title} at ${property?.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 border-2px] border-[#2B7FFF]/20 border-t-[#2B7FFF] rounded-full animate-spin" />
            <Gem
              size={16}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2B7FFF]/60"
            />
          </div>
          <p
            className={`text-white/40 text-sm tracking-[0.2em] uppercase ${inter.variable} font-(family-name:--font-inter)`}
          >
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error || !property) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <X size={32} className="text-white/40" />
        </div>
        <h2
          className={`text-xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
        >
          Property Not Found
        </h2>
        <p className="text-white/50 text-sm text-center max-w-sm">{error}</p>
        <Link
          href="/properties"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF]/10 backdrop-blur-md border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm font-semibold rounded-xl hover:bg-[#2B7FFF]/20 transition-colors"
        >
          <ArrowLeft size={16} /> Browse Properties
        </Link>
      </div>
    );
  }

  const currentDisplayImage =
    images.length > 0 ? images[activeImage] || mainImage : mainImage;
  const hasSingleImage = images.length <= 1;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      className={`min-h-screen bg-linear-to-br from-[#070d1a] via-[#0a1628] to-[#070d1a] relative overflow-x-hidden ${inter.variable} font-(family-name:--font-inter)`}
    >
      {/* ===== LUXURY BACKGROUND ===== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.07)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.05)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(43,127,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(43,127,255,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ===== HERO GALLERY ===== */}
      <div className="relative mt-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb + Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-white/30">
              <Link
                href="/properties"
                className="hover:text-[#2B7FFF] transition-colors"
              >
                Properties
              </Link>
              <ChevronRight size={14} />
              <span className="text-white/60 font-medium">
                {property.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {property.isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2B7FFF]/15 text-[#6BABFF] text-[11px] font-bold rounded-full border border-[#2B7FFF]/25 backdrop-blur-sm">
                  <Crown size={11} className="fill-[#2B7FFF] text-[#2B7FFF]" />
                  Featured
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full border backdrop-blur-sm ${
                  property.status === "available"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                    : property.status === "sold"
                      ? "bg-red-500/15 text-red-300 border-red-500/25"
                      : "bg-blue-500/15 text-blue-300 border-blue-500/25"
                }`}
              >
                <ShieldCheck size={11} />
                {property.status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 text-white/70 text-[11px] font-bold rounded-full border border-white/10 backdrop-blur-sm">
                <Tag size={11} />
                {property.priceType}
              </span>
            </div>
          </div>

          {/* Title & Price — LUXURY TYPOGRAPHY */}
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
              <span className="text-[10px] font-bold text-[#2B7FFF]/70 uppercase tracking-[0.25em]">
                Exclusive Listing
              </span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-4 ${playfair.variable} font-(family-name:--font-playfair)`}
            >
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 sm:gap-8">
              <div>
                <p
                  className={`text-3xl sm:text-4xl lg:text-[2.75rem] text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}
                >
                  {property.currency === "PKR" ? "Rs" : "$"}{" "}
                  {Number(property.price)?.toLocaleString()}
                </p>
                {property.priceType === "rent" && (
                  <p className="text-white/30 text-xs mt-1">per month</p>
                )}
              </div>
              <div className="h-10 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2 text-white/40">
                <MapPin size={15} className="text-[#2B7FFF]/70" />
                <span className="text-sm font-medium">
                  {property.location || property.city}
                </span>
              </div>
            </div>
          </div>

          {/* ===== IMAGE GALLERY ===== */}
          {hasSingleImage ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div
                  ref={heroRef}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-white/10"
                  onClick={() => setShowLightbox(true)}
                >
                  <Image
                    src={currentDisplayImage}
                    alt={property.title || "Property"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
                    <ZoomIn size={18} className="text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
                    <ImageIcon size={12} className="text-white/80" />
                    <span className="text-white text-xs font-semibold">
                      1 Photo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
              {/* Main Image */}
              <div className="md:col-span-9 lg:col-span-8 relative group">
                <div
                  ref={heroRef}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-[#2B7FFF]/10"
                  onClick={() => setShowLightbox(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentDisplayImage}
                        alt={property.title || "Property"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 66vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
                    <ZoomIn size={18} className="text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-[#2B7FFF]/20">
                    <Grid3x3 size={12} className="text-[#2B7FFF]/80" />
                    <span className="text-white text-xs font-semibold">
                      {activeImage + 1} / {images.length}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Side Thumbnails - Limited to 4 with See More */}
              <div className="md:col-span-3 lg:col-span-4 grid grid-cols-4 md:grid-cols-2 md:grid-rows-2 gap-2">
                {images.slice(0, 4).map((img, index) => {
                  const safeImg = getSafeImage(img);
                  if (!safeImg) return null;

                  const isSeeMore = images.length > 4 && index === 3;
                  const isActive = activeImage === index;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (isSeeMore) {
                          setActiveImage(3);
                          setShowLightbox(true);
                        } else {
                          setActiveImage(index);
                        }
                      }}
                      className={`relative rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-white/30 aspect-square md:aspect-auto ${
                        isActive && !isSeeMore
                          ? "ring-2 ring-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/20"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={safeImg}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                      />

                      {/* Proper Bold Visible Tick */}
                      {isActive && !isSeeMore && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg shadow-[#2B7FFF]/50 z-10 border-2 border-white">
                          <Check
                            size={14}
                            strokeWidth={3}
                            className="text-white"
                          />
                        </div>
                      )}

                      {/* See More Overlay */}
                      {isSeeMore && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-1 z-10">
                          <Grid3x3 size={18} className="text-white" />
                          <span className="text-white text-xs font-bold">
                            +{images.length - 3} More
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ===== LEFT ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta */}
            {property.propertyCode && (
              <div className="detail-item flex flex-wrap items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B7FFF]/5 rounded-full text-[#2B7FFF]/80 font-semibold border border-[#2B7FFF]/15">
                  <Building2 size={12} />
                  {property.propertyCode}
                </span>
                {property.viewsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {property.viewsCount} views
                  </span>
                )}
                {property.createdAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {new Date(property.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="detail-item grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.bedrooms > 0 && (
                <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
                    <Bed size={18} className="text-[#2B7FFF]/80" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      Beds
                    </p>
                    <p
                      className={`text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
                    >
                      {property.bedrooms}
                    </p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
                    <Bath size={18} className="text-[#2B7FFF]/80" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      Baths
                    </p>
                    <p
                      className={`text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
                    >
                      {property.bathrooms}
                    </p>
                  </div>
                </div>
              )}
              {(property.areaSize || property.area) > 0 && (
                <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
                    <Ruler size={18} className="text-[#2B7FFF]/80" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      Area
                    </p>
                    <p
                      className={`text-lg font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
                    >
                      {property.areaSize || property.area}
                      <span className="text-[10px] font-normal text-white/30 ml-0.5">
                        {property.areaUnit || "sqft"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {property.propertyType && (
                <div className="relative flex items-center gap-3 bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-4 border border-white/8 hover:border-[#2B7FFF]/20 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2B7FFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#2B7FFF]/10 transition-colors" />
                  <div className="w-11 h-11 rounded-xl bg-[#2B7FFF]/10 group-hover:bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/10">
                    <Home size={18} className="text-[#2B7FFF]/80" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      Type
                    </p>
                    <p className="text-sm font-bold text-white leading-tight capitalize">
                      {property.propertyType}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="relative">
                  <h3
                    className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                  >
                    Description
                  </h3>
                  <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
                  <div
                    className="text-white/50 text-[15px] leading-[1.9] whitespace-pre-line max-h-80 overflow-y-auto pr-3"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(43,127,255,0.3) transparent",
                    }}
                  >
                    {property.description}
                  </div>
                </div>
              </div>
            )}


            {/* Address */}
            {property.address && (
              <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="relative">
                  <h3
                    className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                  >
                    Address
                  </h3>
                  <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
                  <div className="flex items-start gap-3 bg-[#2B7FFF]/5 rounded-xl p-4 border border-[#2B7FFF]/10">
                    <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={14} className="text-[#2B7FFF]/80" />
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {property.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

                      {/* Features */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <div className="detail-item relative bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-6 sm:p-7 border border-white/8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2B7FFF]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative">
                  <h3
                    className={`text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                  >
                    Features & Amenities
                  </h3>
                  <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-5" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[...(property.features || []), ...(property.amenities || [])].map(
                      (item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 text-sm text-white/60 bg-white/3 rounded-xl px-3 py-2.5 border border-white/6 hover:bg-[#2B7FFF]/5 hover:border-[#2B7FFF]/15 transition-colors group"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/20 transition-colors">
                            <CheckCircle2 size={12} className="text-[#2B7FFF]/70" />
                          </div>
                          <span className="capitalize">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-1">
            {/* ✅ FIX: lg:sticky lg:top-24 applied to stop glitch on mobile screens */}
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Price + CTA */}
              <div className="relative bg-linear-to-br from-white/[0.07] to-white/8 rounded-2xl border border-white/8 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#2B7FFF]/5 via-transparent to-[#2B7FFF]/3 pointer-events-none" />
                <div className="relative bg-linear-to-r from-[#2B7FFF]/10 via-[#2B7FFF]/5 to-transparent px-6 py-5 border-b border-white/6">
                  <p className="text-[10px] text-[#2B7FFF]/60 uppercase tracking-[0.2em] font-bold mb-1">
                    Asking Price
                  </p>
                  <p
                    className={`text-3xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] ${playfair.variable} font-(family-name:--font-playfair)`}
                  >
                    {property.currency === "PKR" ? "Rs" : "$"}{" "}
                    {Number(property.price)?.toLocaleString()}
                  </p>
                  <p className="text-white/30 text-xs mt-1.5 capitalize tracking-wide">
                    {property.priceType} &bull; {property.propertyType}
                  </p>
                </div>

                <div className="relative p-5 space-y-3">
                  <LeadForm
                    propertyId={property._id}
                    propertyTitle={property.title}
                    propertyCode={property.propertyCode}
                    propertyPrice={property.price}
                    propertyCurrency={property.currency}
                    onSuccess={(data) => {
                      console.log("Lead created:", data);
                    }}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${property.contact?.phone || ""}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-colors"
                    >
                      <Phone size={13} /> Call
                    </a>
                    <a
                      href={`mailto:${property.contact?.email || ""}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-colors"
                    >
                      <Mail size={13} /> Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Agent */}
              {property.addedBy && (
                <div className="bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-5 border border-white/8">
                  <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-3">
                    Listed By
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#2B7FFF]/15 shadow-lg">
                      {property.addedBy?.avatar ? (
                        <img
                          src={property.addedBy.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-[#2B7FFF]/70" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {property.addedBy?.name || "Agent"}
                      </p>
                      <p className="text-xs text-white/30">Property Agent</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="bg-linear-to-br from-white/6 to-white/2 rounded-2xl p-5 border border-white/8">
                <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-3">
                  Property Details
                </h4>
                <div className="space-y-0">
                  {property.floors && (
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
                      <span className="text-white/30 flex items-center gap-2">
                        <Layers size={12} /> Floors
                      </span>
                      <span className="font-semibold text-white">
                        {property.floors}
                      </span>
                    </div>
                  )}
                  {property.kitchens && (
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
                      <span className="text-white/30">Kitchens</span>
                      <span className="font-semibold text-white">
                        {property.kitchens}
                      </span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
                      <span className="text-white/30">Year Built</span>
                      <span className="font-semibold text-white">
                        {property.yearBuilt}
                      </span>
                    </div>
                  )}
                  {property.leadsCount > 0 && (
                    <div className="flex items-center justify-between text-sm py-2.5">
                      <span className="text-white/30">Interested Buyers</span>
                      <span className="font-semibold text-[#2B7FFF]">
                        {property.leadsCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified */}
              <div className="relative bg-[#2B7FFF]/5 rounded-2xl p-4 border border-[#2B7FFF]/15 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#2B7FFF]/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                <div className="relative flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 border border-[#2B7FFF]/20">
                    <ShieldCheck size={15} className="text-[#2B7FFF]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2B7FFF]">
                      Verified Listing
                    </p>
                    <p className="text-[11px] text-white/30">
                      Verified by our team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 bg-black/95 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 ring-1 ring-white/20"
            >
              <X size={20} />
            </button>
            <div
              className="relative w-full h-full flex items-center justify-center px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-5xl max-h-[80vh] w-full aspect-video"
                >
                  <Image
                    src={currentDisplayImage}
                    alt={property.title || "Property"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>
              {!hasSingleImage && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            {!hasSingleImage && (
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, index) => {
                  const safeImg = getSafeImage(img);
                  if (!safeImg) return null;
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(index);
                      }}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
                        activeImage === index
                          ? "ring-2 ring-[#2B7FFF] scale-105"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={safeImg}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
            <div className="absolute top-5 left-5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full ring-1 ring-white/20">
              <span className="text-white text-sm font-semibold">
                {activeImage + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}