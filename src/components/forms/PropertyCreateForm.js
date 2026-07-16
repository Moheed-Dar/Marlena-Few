"use client";

import { useState } from "react";
import { createProperty } from "@/lib/properties/api";
import {
  X,
  Loader2,
  Upload,
  ImagePlus,
  Trash2,
  MapPin,
  Building2,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Tag,
  Star,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROPERTY_TYPES = [
  "house", "apartment", "villa", "penthouse",
  "plot", "commercial", "office", "shop",
  "warehouse", "farmhouse", "flat", "studio",
];

const PRICE_TYPES = ["sale", "rent"];
const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED"];
const AREA_UNITS = ["sqft", "sqm", "marla", "kanal", "acre"];

const SUGGESTED_FEATURES = [
  "Parking", "Garage", "Garden", "Swimming Pool",
  "Gym", "Security", "CCTV", "Elevator",
  "Balcony", "Terrace", "Central Heating", "AC",
  "Furnished", "Semi-Furnished", "Unfurnished",
  "Water Supply", "Gas Connection", "Electricity Backup",
  "Mosque Nearby", "Park Nearby", "School Nearby",
  "Hospital Nearby", "Shopping Mall Nearby", "Main Road",
];

const SUGGESTED_AMENITIES = [
  "WiFi", "TV Lounge", "Study Room", "Servant Quarter",
  "Laundry Room", "Store Room", "Rooftop Access",
  "Community Center", "Playground", "Jogging Track",
  "BBQ Area", "Sauna", "Spa", "Steam Room",
];

export default function PropertyCreateForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    priceType: "sale",
    currency: "PKR",
    location: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    areaSize: "",
    areaUnit: "sqft",
    floors: "",
    yearBuilt: "",
    isFeatured: false,
    isPublished: true,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    features: [],
    amenities: [],
  });

  // ============================================
  // HANDLE CHANGE
  // ============================================
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ============================================
  // TOGGLE FEATURE / AMENITY
  // ============================================
  const toggleItem = (field, item) => {
    setForm((prev) => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
  };

  // ============================================
  // IMAGE HANDLING
  // ============================================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
    setError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================
  // SUBMIT — Uses lib/api.js → /api/properties/create
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.title || !form.description || !form.price || !form.location || !form.city || !form.propertyType) {
      setError("Please fill all required fields");
      return;
    }

    if (form.description.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Text fields
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("priceType", form.priceType);
      formData.append("currency", form.currency);
      formData.append("location", form.location);
      formData.append("city", form.city);
      formData.append("area", form.area);
      formData.append("address", form.address);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      formData.append("propertyType", form.propertyType);
      formData.append("bedrooms", form.bedrooms || 0);
      formData.append("bathrooms", form.bathrooms || 0);
      formData.append("kitchens", form.kitchens || 0);
      formData.append("areaSize", form.areaSize || 0);
      formData.append("areaUnit", form.areaUnit);
      formData.append("floors", form.floors || 0);
      formData.append("yearBuilt", form.yearBuilt);
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isPublished", String(form.isPublished));
      formData.append("contactName", form.contactName);
      formData.append("contactPhone", form.contactPhone);
      formData.append("contactEmail", form.contactEmail);

      // JSON arrays
      formData.append("features", JSON.stringify(form.features));
      formData.append("amenities", JSON.stringify(form.amenities));

      // Images
      images.forEach((img) => {
        formData.append("images", img);
      });

      // ✅ CORRECT: Uses lib/api.js which calls /api/properties/create
      const res = await createProperty(formData);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Failed to create property");
        if (res.errors) {
          setError(res.errors.join(", "));
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INPUT CLASS
  // ============================================
  const inputClass =
    "w-full bg-[#1b3454] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all";

  const selectClass =
    "w-full bg-[#1b3454] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all appearance-none";

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        className="relative bg-[#0d1f3c] rounded-2xl border border-white/10 w-full max-w-3xl shadow-2xl shadow-black/50 mb-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Add New Property</h2>
            <p className="text-white/40 text-xs mt-0.5">Fill in the property details</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Step Indicators */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  step === s
                    ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                    : "text-white/30 hover:text-white/50 border border-transparent hover:bg-white/5"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s ? "bg-[#2B7FFF] text-white" : "bg-white/10 text-white/40"
                }`}>
                  {s}
                </span>
                {s === 1 && "Basic"}
                {s === 2 && "Details"}
                {s === 3 && "Media"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* ===== STEP 1: BASIC INFO ===== */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. 5 Marla House for Sale in DHA Phase 5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the property in detail..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-white/20 text-[10px] mt-1">{form.description.length}/5000 characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="5000000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={form.priceType}
                    onChange={(e) => handleChange("priceType", e.target.value)}
                    className={selectClass}
                  >
                    {PRICE_TYPES.map((t) => (
                      <option key={t} value={t} style={{ backgroundColor: "#1b3454" }} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className={selectClass}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: "#1b3454" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. DHA Phase 5, Lahore"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="e.g. Lahore"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Property Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.propertyType}
                  onChange={(e) => handleChange("propertyType", e.target.value)}
                  className={selectClass}
                >
                  <option value="" style={{ backgroundColor: "#1b3454" }}>Select type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t} style={{ backgroundColor: "#1b3454" }} className="capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ===== STEP 2: DETAILS ===== */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Bedrooms</label>
                  <input type="number" value={form.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Bathrooms</label>
                  <input type="number" value={form.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Kitchens</label>
                  <input type="number" value={form.kitchens} onChange={(e) => handleChange("kitchens", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Floors</label>
                  <input type="number" value={form.floors} onChange={(e) => handleChange("floors", e.target.value)} placeholder="0" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Area Size</label>
                  <input type="number" value={form.areaSize} onChange={(e) => handleChange("areaSize", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Area Unit</label>
                  <select value={form.areaUnit} onChange={(e) => handleChange("areaUnit", e.target.value)} className={selectClass}>
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u} style={{ backgroundColor: "#1b3454" }}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Year Built</label>
                  <input type="number" value={form.yearBuilt} onChange={(e) => handleChange("yearBuilt", e.target.value)} placeholder="2024" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Address</label>
                <input type="text" value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Full address..." className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Latitude</label>
                  <input type="number" step="any" value={form.latitude} onChange={(e) => handleChange("latitude", e.target.value)} placeholder="31.5204" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Longitude</label>
                  <input type="number" step="any" value={form.longitude} onChange={(e) => handleChange("longitude", e.target.value)} placeholder="74.3587" className={inputClass} />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Features ({form.features.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_FEATURES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem("features", item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.features.includes(item)
                          ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Amenities ({form.amenities.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_AMENITIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem("amenities", item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.amenities.includes(item)
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => handleChange("isFeatured", !form.isFeatured)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${form.isFeatured ? "bg-[#2B7FFF]" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs text-white/50">Featured</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => handleChange("isPublished", !form.isPublished)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${form.isPublished ? "bg-[#2B7FFF]" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs text-white/50">Published</span>
                </label>
              </div>
            </div>
          )}

          {/* ===== STEP 3: IMAGES + CONTACT ===== */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Images ({images.length}/10)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#2B7FFF]/30 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <ImagePlus size={20} className="text-white/20 mb-1" />
                      <span className="text-[10px] text-white/20">Add</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Contact Name</label>
                  <input type="text" value={form.contactName} onChange={(e) => handleChange("contactName", e.target.value)} placeholder="Agent name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Contact Phone</label>
                  <input type="tel" value={form.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} placeholder="+92 300 1234567" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Contact Email</label>
                  <input type="email" value={form.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} placeholder="agent@example.com" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Property"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}