"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Grid3X3,
  List,
  X,
  Star,
  ArrowUpRight,
  Building2,
  Crown,
  Gem,
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

const PROPERTY_TYPES = [
  "all", "house", "apartment", "villa", "penthouse",
  "plot", "commercial", "flat", "studio",
];

const PRICE_TYPES = [
  { value: "", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "title", label: "Name: A to Z" },
  { value: "viewsCount", label: "Most Viewed" },
];

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// ============================================
// HIGHLIGHT MATCHED TEXT
// ============================================
const HighlightText = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#2B7FFF] font-semibold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

// ============================================
// REUSABLE: SELECT WITH CUSTOM ARROW
// ============================================
const DarkSelect = ({ value, onChange, options, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-3 pr-7 py-2 bg-[#0d1f3c] border border-white/10 text-white/70 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 cursor-pointer"
      style={{ colorScheme: "dark" }}
    >
      {options}
    </select>
    <ChevronDown size={13} strokeWidth={2.5} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceType, setPriceType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ============================================
  // FETCH
  // ============================================
  const fetchProperties = async (pageNum = page) => {
    try {
      setLoading(true);
      let url = `/api/properties/get-all?page=${pageNum}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (priceType) url += `&priceType=${priceType}`;
      if (propertyType && propertyType !== "all") url += `&propertyType=${propertyType}`;
      const res = await axios.get(url);
      setProperties(res.data?.data || []);
      setPagination(res.data?.pagination || null);
      setPage(pageNum);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
  }, [propertyType, priceType, sortBy, sortOrder]);

  // ============================================
  // CLIENT-SIDE SEARCH FILTER
  // ============================================
  const matchProperty = useCallback((p, words) => {
    const title = (p.title || "").toLowerCase();
    const location = (p.location || p.city || "").toLowerCase();
    return words.every((word) => title.includes(word) || location.includes(word));
  }, []);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties;
    const searchWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return properties;
    return properties.filter((p) => matchProperty(p, searchWords));
  }, [properties, search, matchProperty]);

  // ============================================
  // SUGGESTIONS
  // ============================================
  const suggestions = useMemo(() => {
    if (!searchInput.trim()) return [];
    const words = searchInput.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return properties.filter((p) => matchProperty(p, words)).slice(0, 5);
  }, [searchInput, properties, matchProperty]);

  // ============================================
  // DEBOUNCED AUTO-SEARCH
  // ============================================
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => { setSearch(searchInput); }, 300);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [searchInput]);

  // ============================================
  // CLOSE SUGGESTIONS ON OUTSIDE CLICK
  // ============================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setShowSuggestions(false); };
  const handleClearSearch = () => { setSearchInput(""); setSearch(""); setShowSuggestions(false); searchInputRef.current?.focus(); };
  const handleSuggestionClick = () => { setShowSuggestions(false); };

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const hasActiveFilters = propertyType !== "all" || priceType || search;
  const clearAllFilters = () => {
    setPropertyType("all"); setPriceType(""); setSearch(""); setSearchInput("");
    setSortBy("createdAt"); setSortOrder("desc");
  };

  // ============================================
  // SKELETONS
  // ============================================
  const SkeletonCard = () => (
    <div className="bg-[#0d1f3c] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="h-72 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-[#0d1f3c] rounded-2xl overflow-hidden border border-white/5 animate-pulse flex h-48">
      <div className="w-56 bg-white/5 shrink-0" />
      <div className="p-5 flex-1 space-y-3">
        <div className="h-5 bg-white/5 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
      </div>
    </div>
  );

  // ============================================
  // PROPERTY CARD (GRID) — LUXURY
  // ============================================
  const PropertyCard = ({ property }) => {
    const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link href={`/properties/${property._id}`} className="group block">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-105 sm:h-110px rounded-2xl overflow-hidden border border-white/8 shadow-xl shadow-black/30 bg-[#0d1f3c] cursor-pointer hover:shadow-2xl hover:shadow-[#2B7FFF]/10 hover:border-[#2B7FFF]/20 transition-all duration-500"
        >
          <Image src={img} alt={property.title} fill priority className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex flex-wrap gap-2">
              {property.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <Crown size={9} className="fill-white" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                {property.priceType}
              </span>
            </div>
            <button onClick={(e) => toggleLike(property._id, e)} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all">
              <Heart size={15} className={isLiked ? "fill-red-400 text-red-400" : "text-white/70"} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <div className="flex items-center gap-3 mb-3">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
                  <Bed size={12} className="text-[#2B7FFF]/80" />
                  <span className="text-white text-xs font-semibold">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
                  <Bath size={12} className="text-[#2B7FFF]/80" />
                  <span className="text-white text-xs font-semibold">{property.bathrooms}</span>
                </div>
              )}
              {(property.areaSize || property.area) > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
                  <Maximize size={12} className="text-[#2B7FFF]/80" />
                  <span className="text-white text-xs font-semibold">{property.areaSize || property.area} {property.areaUnit || "sqft"}</span>
                </div>
              )}
            </div>

            <h3 className={`text-xl text-white mb-1.5 leading-tight line-clamp-1 drop-shadow-lg ${playfair.variable} font-(family-name:--font-playfair)`}>
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
              <MapPin size={13} className="text-[#2B7FFF]/70 shrink-0" />
              <span className="truncate">{property.location || property.city}</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className={`text-2xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}>
                  {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${property.status === "available" ? "bg-emerald-400" : property.status === "sold" ? "bg-red-400" : "bg-[#2B7FFF]"}`} />
                  <span className="text-white/50 text-xs capitalize">{property.status}</span>
                  {property.viewsCount > 0 && <span className="text-white/30 text-xs">· {property.viewsCount} views</span>}
                </div>
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2B7FFF] text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-[#2B7FFF]/30">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  // ============================================
  // PROPERTY CARD (LIST) — LUXURY
  // ============================================
  const PropertyListItem = ({ property }) => {
    const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link href={`/properties/${property._id}`} className="group block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-white/8 shadow-lg shadow-black/30 bg-[#0d1f3c] cursor-pointer hover:shadow-2xl hover:shadow-[#2B7FFF]/10 hover:border-[#2B7FFF]/20 transition-all duration-500"
        >
          <Image src={img} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            <div className="flex gap-1.5">
              {property.isFeatured && (
                <span className="px-2 py-0.5 bg-[#2B7FFF]/90 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  <Crown size={8} className="fill-white inline mr-0.5" />Featured
                </span>
              )}
              <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white/80 text-[9px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                {property.priceType}
              </span>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${property.status === "available" ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                {property.status}
              </span>
            </div>
            <button onClick={(e) => toggleLike(property._id, e)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all">
              <Heart size={14} className={isLiked ? "fill-red-400 text-red-400" : "text-white/70"} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className={`text-lg text-white mb-0.5 leading-tight drop-shadow-lg line-clamp-1 ${playfair.variable} font-(family-name:--font-playfair)`}>
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <MapPin size={11} className="text-[#2B7FFF]/70" />
                  <span className="truncate">{property.location || property.city}</span>
                  <span className="text-white/20 mx-1">·</span>
                  <div className="flex items-center gap-2">
                    {property.bedrooms > 0 && <span>{property.bedrooms} Bed</span>}
                    {property.bathrooms > 0 && <span>{property.bathrooms} Bath</span>}
                    {(property.areaSize || property.area) > 0 && <span>{property.areaSize || property.area} {property.areaUnit || "sqft"}</span>}
                  </div>
                </div>
              </div>
              <p className={`text-xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}>
                {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  // ============================================
  // DARK OPTION STYLE
  // ============================================
  const darkOptionStyle = {
    backgroundColor: "#0d1f3c",
    color: "#94a3b8",
    padding: "8px 12px",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`min-h-screen bg-[#0a1628] ${inter.variable} font-(family-name:--font-inter)`}>
      {/* Luxury BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.07)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "50px 50px" }} />
      </div>

      {/* ===== HERO — z-50 ===== */}
      <div className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
              <p className="text-[#2B7FFF] text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <Building2 size={14} />
                Explore Listings
              </p>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-4 ${playfair.variable} font-(family-name:--font-playfair)`}>
              Our Properties
            </h1>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8">
              Discover your perfect property from our curated collection of premium real estate listings.
            </p>
          </div>

          {/* ===== SEARCH BAR WITH SUGGESTIONS ===== */}
          <div className="max-w-2xl relative">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-[#2B7FFF]/50 focus-within:ring-2 focus-within:ring-[#2B7FFF]/20 transition-all">
                <Search size={18} className="absolute left-4 text-white/30" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => { if (searchInput.trim()) setShowSuggestions(true); }}
                  placeholder="Search by title or location..."
                  className="w-full pl-11 pr-20 py-4 bg-transparent text-white placeholder-white/25 text-sm focus:outline-none"
                  autoComplete="off"
                />
                {searchInput && (
                  <button type="button" onClick={handleClearSearch} className="absolute right-14 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                    <X size={14} className="text-white/40" />
                  </button>
                )}
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#2B7FFF] text-white text-sm font-semibold rounded-xl hover:bg-[#4D94FF] transition-colors shadow-lg shadow-[#2B7FFF]/25">
                  Search
                </button>
              </div>
            </form>

            {/* ===== SUGGESTIONS DROPDOWN ===== */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0d1f3c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                      {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""} found
                    </span>
                    <button onClick={() => setShowSuggestions(false)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                      <X size={11} className="text-white/30" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(43,127,255,0.3) transparent" }}>
                    {suggestions.map((property) => {
                      const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
                      return (
                        <Link key={property._id} href={`/properties/${property._id}`} onClick={handleSuggestionClick} className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 shadow-lg shadow-black/30 ring-1 ring-white/10">
                            <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold text-white leading-tight line-clamp-1 ${playfair.variable} font-(family-name:--font-playfair)`}>
                              <HighlightText text={property.title} query={searchInput} />
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <MapPin size={10} className="text-[#2B7FFF]/70 shrink-0" />
                              <span className="text-[11px] text-white/40 truncate">
                                <HighlightText text={property.location || property.city || "N/A"} query={searchInput} />
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-xs font-bold text-white/60">{property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}</span>
                            <div className="w-6 h-6 rounded-md bg-[#2B7FFF]/10 flex items-center justify-center">
                              <ArrowUpRight size={11} className="text-[#2B7FFF]/60" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/5">
                    <button
                      onClick={() => { setSearch(searchInput); setShowSuggestions(false); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#2B7FFF] hover:bg-[#2B7FFF]/10 transition-colors"
                    >
                      <Search size={12} />
                      View all results for &quot;{searchInput.slice(0, 30)}{searchInput.length > 30 ? "..." : ""}&quot;
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showSuggestions && searchInput.trim().length > 0 && suggestions.length === 0 && !loading && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0d1f3c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    <div className="w-10 h-10 rounded-full bg-[#2B7FFF]/5 flex items-center justify-center mb-3 border border-[#2B7FFF]/10">
                      <Search size={16} className="text-[#2B7FFF]/40" />
                    </div>
                    <p className="text-sm text-white/40 font-medium">No matches found</p>
                    <p className="text-[11px] text-white/25 mt-1">Try different keywords</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="sticky top-0 z-40 bg-[#0d1f3c]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                  showFilters || hasActiveFilters
                    ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/25"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-4 h-4 flex items-center justify-center bg-white text-[#2B7FFF] text-[10px] font-black rounded-full">!</span>
                )}
              </button>

              {hasActiveFilters && (
                <div className="hidden md:flex items-center gap-1.5 overflow-x-auto">
                  {propertyType !== "all" && (
                    <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/15 text-[#6BABFF] text-[11px] font-semibold rounded-full capitalize border border-[#2B7FFF]/25">
                      {propertyType}
                      <button onClick={() => setPropertyType("all")}><X size={9} /></button>
                    </span>
                  )}
                  {priceType && (
                    <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/15 text-[#6BABFF] text-[11px] font-semibold rounded-full capitalize border border-[#2B7FFF]/25">
                      {priceType}
                      <button onClick={() => setPriceType("")}><X size={9} /></button>
                    </span>
                  )}
                  {search && (
                    <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/15 text-[#6BABFF] text-[11px] font-semibold rounded-full border border-[#2B7FFF]/25">
                      &quot;{search.slice(0, 12)}&quot;
                      <button onClick={handleClearSearch}><X size={9} /></button>
                    </span>
                  )}
                  <button onClick={clearAllFilters} className="shrink-0 text-[11px] text-red-400 font-semibold hover:underline">Clear</button>
                </div>
              )}

              {!loading && (
                <span className="hidden sm:block text-xs text-white/30 shrink-0">
                  {filteredProperties.length} result{filteredProperties.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <DarkSelect
                className="hidden sm:block w-44"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => { const [f, o] = e.target.value.split("-"); setSortBy(f); setSortOrder(o); }}
                options={SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={`${opt.value}-${opt.value === "price" ? "asc" : "desc"}`} style={darkOptionStyle}>{opt.label}</option>
                ))}
              />

              <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/25" : "text-white/40 hover:text-white/70"}`}>
                  <Grid3X3 size={15} />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/25" : "text-white/40 hover:text-white/70"}`}>
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-1.5">Property Type</label>
                    <DarkSelect className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} options={PROPERTY_TYPES.map((t) => (<option key={t} value={t} style={darkOptionStyle} className="capitalize">{t === "all" ? "All Types" : t}</option>))} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-1.5">Listing Type</label>
                    <DarkSelect className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80" value={priceType} onChange={(e) => setPriceType(e.target.value)} options={PRICE_TYPES.map((t) => (<option key={t.value} value={t.value} style={darkOptionStyle}>{t.label}</option>))} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-1.5">Sort By</label>
                    <DarkSelect className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80" value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [f, o] = e.target.value.split("-"); setSortBy(f); setSortOrder(o); }} options={SORT_OPTIONS.map((opt) => (<option key={opt.value} value={`${opt.value}-${opt.value === "price" ? "asc" : "desc"}`} style={darkOptionStyle}>{opt.label}</option>))} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={clearAllFilters} className="w-full px-4 py-2.5 border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors">Reset</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== GRID / LIST ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonList key={i} />)}
            </div>
          )
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#2B7FFF]/5 flex items-center justify-center mb-4 border border-[#2B7FFF]/15">
              <Search size={28} className="text-[#2B7FFF]/30" />
            </div>
            <h3 className={`text-lg text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}>No Properties Found</h3>
            <p className="text-white/40 text-sm max-w-sm mb-4">
              {hasActiveFilters ? `No match found for "${search}". Try different keywords or clear filters.` : "No properties listed yet."}
            </p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="px-5 py-2.5 bg-[#2B7FFF] text-white text-sm font-semibold rounded-xl hover:bg-[#4D94FF] transition-colors shadow-lg shadow-[#2B7FFF]/25">
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProperties.map((property) => (
              <PropertyListItem key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => fetchProperties(page - 1)} disabled={!pagination.hasPrevPage} className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push("..."); acc.push(p); return acc; }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`d${i}`} className="w-10 h-10 flex items-center justify-center text-white/20 text-sm">...</span>
                ) : (
                  <button key={item} onClick={() => fetchProperties(item)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${page === item ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/25" : "border border-white/10 text-white/50 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF]"}`}>
                    {item}
                  </button>
                )
              )}
            <button onClick={() => fetchProperties(page + 1)} disabled={!pagination.hasNextPage} className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}