// 'use client';

// import { useState, useEffect, useCallback } from "react";
// import {
//   Search,
//   Delete,
//   Eye,
//   MailCheck,
//   Filter,
//   RefreshCw,
//   X,
//   Phone,
//   Mail,
//   User,
//   Home,
//   Calendar,
//   TrendingUp,
//   Users,
//   FileDown,
//   Info,
//   CheckCircle,
//   AlertCircle,
//   AlertTriangle,
//   Sparkles,
//   MessageSquare,
//   Star,
//   Check,
//   XCircle,
//   FileText,
//   MapPin,
//   DollarSign,
//   Grid3X3,
//   Building2,
//   ChevronLeft,
//   ChevronRight,
//   BookOpen,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Playfair_Display, Inter } from "next/font/google";
// import {
//   getAllLeads,
//   getLeadById,
//   deleteLead,
//   markLeadAsRead,
// } from "@/lib/api";

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
// // CONSTANTS
// // ============================================
// const STATUS_CONFIG = {
//   new: {
//     label: "New",
//     color: "text-blue-400",
//     bg: "bg-blue-500/15",
//     border: "border-blue-500/25",
//     icon: <Sparkles size={12} />,
//   },
//   contacted: {
//     label: "Contacted",
//     color: "text-orange-400",
//     bg: "bg-orange-500/15",
//     border: "border-orange-500/25",
//     icon: <MessageSquare size={12} />,
//   },
//   qualified: {
//     label: "Qualified",
//     color: "text-emerald-400",
//     bg: "bg-emerald-500/15",
//     border: "border-emerald-500/25",
//     icon: <Check size={12} />,
//   },
//   converted: {
//     label: "Converted",
//     color: "text-indigo-400",
//     bg: "bg-indigo-500/15",
//     border: "border-indigo-500/25",
//     icon: <Star size={12} />,
//   },
//   lost: {
//     label: "Lost",
//     color: "text-red-400",
//     bg: "bg-red-500/15",
//     border: "border-red-500/25",
//     icon: <XCircle size={12} />,
//   },
// };

// const SOURCE_CONFIG = {
//   website: { label: "Website", color: "text-blue-400" },
//   facebook: { label: "Facebook", color: "text-indigo-400" },
//   instagram: { label: "Instagram", color: "text-pink-400" },
//   google: { label: "Google", color: "text-emerald-400" },
//   referral: { label: "Referral", color: "text-amber-400" },
//   direct: { label: "Direct", color: "text-gray-400" },
//   whatsapp: { label: "WhatsApp", color: "text-emerald-400" },
//   call: { label: "Call", color: "text-orange-400" },
//   email: { label: "Email", color: "text-blue-400" },
// };

// // ============================================
// // HELPERS
// // ============================================
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-PK", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const formatPrice = (price, currency = "PKR") => {
//   if (!price) return "N/A";
//   return `${currency} ${Number(price).toLocaleString()}`;
// };

// // ✅ Helper: Type column mein kya dikhana hai
// const getLeadTypeDisplay = (lead) => {
//   if (lead.leadType === "guide_download") {
//     if (lead.guideType === "buyer") {
//       return {
//         label: "Buyer Guide",
//         icon: <BookOpen size={12} />,
//         color: "text-cyan-400",
//         bg: "bg-cyan-500/15",
//         border: "border-cyan-500/25",
//       };
//     }
//     if (lead.guideType === "seller") {
//       return {
//         label: "Seller Guide",
//         icon: <BookOpen size={12} />,
//         color: "text-amber-400",
//         bg: "bg-amber-500/15",
//         border: "border-amber-500/25",
//       };
//     }
//     return {
//       label: "Guide Download",
//       icon: <FileDown size={12} />,
//       color: "text-emerald-400",
//       bg: "bg-emerald-500/15",
//       border: "border-emerald-500/25",
//     };
//   }

//   return {
//     label: "Property Inquiry",
//     icon: <Home size={12} />,
//     color: "text-blue-400",
//     bg: "bg-blue-500/15",
//     border: "border-blue-500/25",
//   };
// };

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function LeadsPage() {
//   // ---- State ----
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 10,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });
//   const [stats, setStats] = useState(null);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sourceFilter, setSourceFilter] = useState("all");
//   const [leadTypeFilter, setLeadTypeFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // UI
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [leadToDelete, setLeadToDelete] = useState(null);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     type: "success",
//   });

//   // Mark read loading per lead
//   const [markingReadIds, setMarkingReadIds] = useState(new Set());

//   // ---- Debounce ----
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // ---- Fetch ----
//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: page + 1,
//         limit: rowsPerPage,
//         search: debouncedSearch,
//         sortBy,
//         sortOrder,
//         status: statusFilter !== "all" ? statusFilter : undefined,
//         source: sourceFilter !== "all" ? sourceFilter : undefined,
//         leadType: leadTypeFilter !== "all" ? leadTypeFilter : undefined,
//       };
//       const response = await getAllLeads(params);
//       if (response.success) {
//         setLeads(response.data);
//         setPagination(response.pagination);
//         setStats(response.stats);
//       }
//     } catch (error) {
//       console.error("Fetch Leads Error:", error);
//       showSnackbar("Failed to fetch leads", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     page,
//     rowsPerPage,
//     debouncedSearch,
//     statusFilter,
//     sourceFilter,
//     leadTypeFilter,
//     sortBy,
//     sortOrder,
//   ]);

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   // ---- Snackbar ----
//   const showSnackbar = (message, type = "success") => {
//     setSnackbar({ open: true, message, type });
//   };

//   // ---- Handlers ----
//   const handleSort = (field) => {
//     const isAsc = sortBy === field && sortOrder === "asc";
//     setSortOrder(isAsc ? "desc" : "asc");
//     setSortBy(field);
//   };

//   // ✅ View Lead + Auto Mark as Read
//   const handleViewLead = async (lead, e) => {
//     if (e) e.stopPropagation();
//     try {
//       let leadData = lead;

//       // Agar property ya assignedTo nahi hai toh fresh data lo
//       if (!lead.property && !lead.assignedTo) {
//         const response = await getLeadById(lead._id);
//         if (response.success) {
//           leadData = response.data;
//         }
//       }

//       setSelectedLead(leadData);
//       setDetailDrawerOpen(true);

//       // ✅ Auto Mark as Read jab user view kare
//       if (!leadData.isRead) {
//         handleMarkAsRead(leadData._id);
//       }
//     } catch (error) {
//       console.error("View Lead Error:", error);
//       showSnackbar("Failed to load lead details", "error");
//     }
//   };

//   // ✅ Mark as Read - Properly working
//   const handleMarkAsRead = async (leadId) => {
//     // Agar already marking read hai toh dubara na karo
//     if (markingReadIds.has(leadId)) return;

//     try {
//       setMarkingReadIds((prev) => new Set(prev).add(leadId));

//       const response = await markLeadAsRead(leadId);

//       if (response.success) {
//         // Table mein update karo
//         setLeads((prev) =>
//           prev.map((l) =>
//             l._id === leadId
//               ? { ...l, isRead: true, readAt: new Date().toISOString() }
//               : l
//           )
//         );

//         // Drawer mein agar same lead hai toh bhi update karo
//         setSelectedLead((prev) => {
//           if (prev && prev._id === leadId) {
//             return { ...prev, isRead: true, readAt: new Date().toISOString() };
//           }
//           return prev;
//         });

//         showSnackbar("Marked as read", "success");
//       }
//     } catch (error) {
//       console.error("Mark Read Error:", error);
//       showSnackbar("Failed to mark as read", "error");
//     } finally {
//       setMarkingReadIds((prev) => {
//         const next = new Set(prev);
//         next.delete(leadId);
//         return next;
//       });
//     }
//   };

//   const handleDeleteClick = (lead, e) => {
//     if (e) e.stopPropagation();
//     setLeadToDelete(lead);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!leadToDelete?._id) return;
//     try {
//       const response = await deleteLead(leadToDelete._id);
//       if (response.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
//         setPagination((prev) => ({
//           ...prev,
//           totalRecords: prev.totalRecords - 1,
//         }));
//         if (stats) {
//           setStats((prev) => ({
//             ...prev,
//             total: prev.total - 1,
//             [leadToDelete.status]: Math.max(
//               0,
//               (prev[leadToDelete.status] || 0) - 1
//             ),
//           }));
//         }
//         showSnackbar("Lead deleted successfully", "success");
//         if (selectedLead?._id === leadToDelete._id) {
//           setDetailDrawerOpen(false);
//           setSelectedLead(null);
//         }
//       }
//     } catch (error) {
//       console.error("Delete Error:", error);
//       showSnackbar(error.message || "Failed to delete lead", "error");
//     } finally {
//       setDeleteDialogOpen(false);
//       setLeadToDelete(null);
//     }
//   };

//   const handleResetFilters = () => {
//     setSearchQuery("");
//     setStatusFilter("all");
//     setSourceFilter("all");
//     setLeadTypeFilter("all");
//     setSortBy("createdAt");
//     setSortOrder("desc");
//     setPage(0);
//   };

//   const activeFiltersCount = [
//     statusFilter !== "all",
//     sourceFilter !== "all",
//     leadTypeFilter !== "all",
//     debouncedSearch !== "",
//   ].filter(Boolean).length;

//   // ---- Render ----
//   return (
//     <div className={`${inter.variable} font-(family-name:--font-inter)`}>
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//         <div>
//           <h1
//             className={`text-2xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//           >
//             Leads Management
//           </h1>
//           <p className="text-white/40 text-sm">
//             Manage and track all your leads from various sources
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={fetchLeads}
//             disabled={loading}
//             className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
//             title="Refresh"
//           >
//             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
//           </button>
//           <button
//             onClick={() => setFilterDrawerOpen(true)}
//             className={`p-2 rounded-lg hover:bg-white/10 transition-colors relative ${
//               activeFiltersCount > 0 ? "text-[#2B7FFF]" : "text-white/50"
//             }`}
//             title="Filters"
//           >
//             <Filter size={18} />
//             {activeFiltersCount > 0 && (
//               <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//                 {activeFiltersCount}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
//           <div
//             className={`bg-[#1b3454] rounded-2xl p-4 border-2 transition-all cursor-pointer ${
//               statusFilter === "all"
//                 ? "border-[#2B7FFF]"
//                 : "border-white/10 hover:border-white/20"
//             }`}
//             onClick={() => {
//               setStatusFilter("all");
//               setPage(0);
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
//                   Total
//                 </p>
//                 <p className="text-2xl font-bold text-white">{stats.total}</p>
//               </div>
//               <div className="w-9 h-9 rounded-xl bg-[#2B7FFF]/15 flex items-center justify-center border border-[#2B7FFF]/20">
//                 <Users size={16} className="text-[#2B7FFF]" />
//               </div>
//             </div>
//           </div>

//           {Object.entries(STATUS_CONFIG).map(([key, config]) => (
//             <div
//               key={key}
//               className={`bg-[#1b3454] rounded-2xl p-4 border-2 transition-all cursor-pointer ${
//                 statusFilter === key
//                   ? "border-[#2B7FFF]"
//                   : "border-white/10 hover:border-white/20"
//               }`}
//               onClick={() => {
//                 setStatusFilter(statusFilter === key ? "all" : key);
//                 setPage(0);
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p
//                     className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}
//                   >
//                     {config.label}
//                   </p>
//                   <p className="text-2xl font-bold text-white">
//                     {stats[key] || 0}
//                   </p>
//                 </div>
//                 <div
//                   className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.bg} border ${config.border}`}
//                 >
//                   {config.icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <Search
//           size={16}
//           className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
//         />
//         <input
//           type="text"
//           placeholder="Search leads by name, email, phone, or title..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setPage(0);
//           }}
//           className="w-full bg-[#1b3454] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
//         />
//         {searchQuery && (
//           <button
//             onClick={() => setSearchQuery("")}
//             className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
//           >
//             <X size={14} className="text-white/30" />
//           </button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-white/10 bg-white/5">
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-12">
//                   #
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-[220px]">
//                   <button
//                     onClick={() => handleSort("name")}
//                     className="flex items-center gap-1 hover:text-white/60 transition-colors"
//                   >
//                     Lead Info
//                     <span className="text-[10px] opacity-50">
//                       {sortBy === "name"
//                         ? sortOrder === "asc"
//                           ? "↑"
//                           : "↓"
//                         : "⇅"}
//                     </span>
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-[140px]">
//                   <button
//                     onClick={() => handleSort("leadType")}
//                     className="flex items-center gap-1 hover:text-white/60 transition-colors"
//                   >
//                     Type
//                     <span className="text-[10px] opacity-50">
//                       {sortBy === "leadType"
//                         ? sortOrder === "asc"
//                           ? "↑"
//                           : "↓"
//                         : "⇅"}
//                     </span>
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
//                   Property
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
//                   <button
//                     onClick={() => handleSort("status")}
//                     className="flex items-center gap-1 hover:text-white/60 transition-colors"
//                   >
//                     Status
//                     <span className="text-[10px] opacity-50">
//                       {sortBy === "status"
//                         ? sortOrder === "asc"
//                           ? "↑"
//                           : "↓"
//                         : "⇅"}
//                     </span>
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
//                   Source
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
//                   <button
//                     onClick={() => handleSort("createdAt")}
//                     className="flex items-center gap-1 hover:text-white/60 transition-colors"
//                   >
//                     Date
//                     <span className="text-[10px] opacity-50">
//                       {sortBy === "createdAt"
//                         ? sortOrder === "asc"
//                           ? "↑"
//                           : "↓"
//                         : "⇅"}
//                     </span>
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {loading ? (
//                 Array.from({ length: rowsPerPage }).map((_, i) => (
//                   <tr key={i} className="animate-pulse">
//                     <td className="px-4 py-3">
//                       <div className="w-6 h-4 bg-white/5 rounded" />
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-white/5" />
//                         <div>
//                           <div className="w-32 h-4 bg-white/5 rounded" />
//                           <div className="w-24 h-3 bg-white/5 rounded mt-1" />
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="w-20 h-5 bg-white/5 rounded" />
//                     </td>
//                     <td>
//                       <div className="w-20 h-4 bg-white/5 rounded" />
//                     </td>
//                     <td>
//                       <div className="w-14 h-6 bg-white/5 rounded-full" />
//                     </td>
//                     <td>
//                       <div className="w-16 h-5 bg-white/5 rounded" />
//                     </td>
//                     <td>
//                       <div className="w-24 h-4 bg-white/5 rounded" />
//                     </td>
//                     <td>
//                       <div className="flex justify-center gap-1">
//                         <div className="w-7 h-7 bg-white/5 rounded-lg" />
//                         <div className="w-7 h-7 bg-white/5 rounded-lg" />
//                         <div className="w-7 h-7 bg-white/5 rounded-lg" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : leads.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-16">
//                     <div className="w-16 h-16 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center mx-auto mb-4 border border-[#2B7FFF]/15">
//                       <Users size={28} className="text-[#2B7FFF]/40" />
//                     </div>
//                     <p className="text-white/40 text-sm">No leads found</p>
//                     {(debouncedSearch || activeFiltersCount > 0) && (
//                       <button
//                         onClick={handleResetFilters}
//                         className="text-[#2B7FFF] text-sm font-semibold mt-2 hover:underline"
//                       >
//                         Clear filters
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ) : (
//                 leads.map((lead, idx) => {
//                   const statusConfig =
//                     STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
//                   const sourceConfig = SOURCE_CONFIG[lead.source] || {
//                     label: lead.source || "N/A",
//                     color: "text-gray-400",
//                   };
//                   const leadTypeDisplay = getLeadTypeDisplay(lead);

//                   return (
//                     <tr
//                       key={lead._id}
//                       className={`hover:bg-white/5 transition-colors ${
//                         !lead.isRead ? "bg-white/[0.03]" : ""
//                       }`}
//                     >
//                       <td className="px-4 py-3 text-white/40 text-xs">
//                         {page * rowsPerPage + idx + 1}
//                       </td>

//                       {/* ✅ Lead Info + NEW Badge */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="relative flex-shrink-0">
//                             <div
//                               className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase ${
//                                 !lead.isRead
//                                   ? "bg-[#2B7FFF] text-white"
//                                   : "bg-white/10 text-white/40"
//                               }`}
//                             >
//                               {lead.name?.charAt(0) || "?"}
//                             </div>
//                             {!lead.isRead && (
//                               <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2B7FFF] rounded-full border-2 border-[#1b3454]" />
//                             )}
//                           </div>
//                           <div className="min-w-0">
//                             <div className="flex items-center gap-2">
//                               <p
//                                 className={`text-sm truncate max-w-[150px] ${
//                                   !lead.isRead
//                                     ? "font-semibold text-white"
//                                     : "text-white/70"
//                                 }`}
//                               >
//                                 {lead.name || "N/A"}
//                               </p>
//                               {/* ✅ NEW Label - sirf unread leads par */}
//                               {!lead.isRead && (
//                                 <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#2B7FFF] text-white uppercase tracking-wider flex-shrink-0">
//                                   New
//                                 </span>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-white/40">
//                               <Mail size={10} />
//                               <span className="truncate max-w-[120px]">
//                                 {lead.email || "No email"}
//                               </span>
//                               {lead.phone && (
//                                 <>
//                                   <span className="text-white/20">•</span>
//                                   <Phone size={10} />
//                                   <span className="truncate max-w-[80px]">
//                                     {lead.phone}
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* ✅ Type - Buyer Guide / Seller Guide dikhao */}
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${leadTypeDisplay.color} ${leadTypeDisplay.bg} border ${leadTypeDisplay.border}`}
//                         >
//                           {leadTypeDisplay.icon}
//                           {leadTypeDisplay.label}
//                         </span>
//                       </td>

//                       {/* Property */}
//                       <td className="px-4 py-3">
//                         {lead.property ? (
//                           <div>
//                             <p className="text-white/70 text-sm truncate max-w-[140px]">
//                               {lead.property.title || "N/A"}
//                             </p>
//                             {lead.property.city && (
//                               <p className="text-white/30 text-[11px]">
//                                 {lead.property.city}
//                               </p>
//                             )}
//                           </div>
//                         ) : (
//                           <span className="text-white/30 text-sm">—</span>
//                         )}
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusConfig.color} ${statusConfig.bg} border ${statusConfig.border}`}
//                         >
//                           {statusConfig.icon}
//                           {statusConfig.label}
//                         </span>
//                       </td>

//                       {/* Source */}
//                       <td className="px-4 py-3">
//                         <span className={`text-xs ${sourceConfig.color}`}>
//                           {sourceConfig.label}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-3 text-white/40 text-xs">
//                         {formatDate(lead.createdAt)}
//                       </td>

//                       {/* ✅ Actions: Eye + Read + Delete */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-center gap-1">
//                           {/* Eye - View */}
//                           <button
//                             onClick={(e) => handleViewLead(lead, e)}
//                             className="p-1.5 rounded-lg hover:bg-[#2B7FFF]/15 text-white/40 hover:text-[#2B7FFF] transition-colors"
//                             title="View Details"
//                           >
//                             <Eye size={15} />
//                           </button>

//                           {/* ✅ Read - sirf unread par dikhao */}
//                           {!lead.isRead && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleMarkAsRead(lead._id);
//                               }}
//                               disabled={markingReadIds.has(lead._id)}
//                               className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-white/40 hover:text-emerald-400 transition-colors disabled:opacity-40"
//                               title="Mark as Read"
//                             >
//                               <MailCheck
//                                 size={15}
//                                 className={
//                                   markingReadIds.has(lead._id)
//                                     ? "animate-pulse"
//                                     : ""
//                                 }
//                               />
//                             </button>
//                           )}

//                           {/* Delete */}
//                           <button
//                             onClick={(e) => handleDeleteClick(lead, e)}
//                             className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors"
//                             title="Delete Lead"
//                           >
//                             <Delete size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {!loading && leads.length > 0 && (
//           <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
//             <div className="text-sm text-white/40">
//               Showing {page * rowsPerPage + 1}–
//               {Math.min((page + 1) * rowsPerPage, pagination.totalRecords)} of{" "}
//               {pagination.totalRecords}
//             </div>
//             <div className="flex items-center gap-2">
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setPage(0);
//                 }}
//                 className="bg-[#1b3454] border border-white/10 rounded-lg px-2 py-1 text-sm text-white/60 focus:outline-none focus:border-[#2B7FFF]/40"
//               >
//                 {[5, 10, 25, 50].map((val) => (
//                   <option key={val} value={val}>
//                     {val}
//                   </option>
//                 ))}
//               </select>
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setPage((p) => Math.max(0, p - 1))}
//                   disabled={page === 0}
//                   className="w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronLeft size={14} />
//                 </button>
//                 <span className="text-sm text-white/40 px-2">
//                   {page + 1} / {pagination.totalPages}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setPage((p) => Math.min(pagination.totalPages - 1, p + 1))
//                   }
//                   disabled={page >= pagination.totalPages - 1}
//                   className="w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Filter Drawer */}
//       <AnimatePresence>
//         {filterDrawerOpen && (
//           <>
//             <div
//               className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
//               onClick={() => setFilterDrawerOpen(false)}
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#13273f] border-l border-white/10 z-50 overflow-y-auto"
//             >
//               <div className="p-5">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-white">Filters</h3>
//                   <button
//                     onClick={() => setFilterDrawerOpen(false)}
//                     className="p-2 rounded-lg hover:bg-white/10 transition-colors"
//                   >
//                     <X size={18} className="text-white/50" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Status */}
//                   <div>
//                     <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
//                       Status
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => {
//                           setStatusFilter("all");
//                           setPage(0);
//                         }}
//                         className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                           statusFilter === "all"
//                             ? "bg-[#2B7FFF] text-white"
//                             : "bg-white/5 text-white/50 hover:bg-white/10"
//                         }`}
//                       >
//                         All
//                       </button>
//                       {Object.entries(STATUS_CONFIG).map(([key, config]) => (
//                         <button
//                           key={key}
//                           onClick={() => {
//                             setStatusFilter(statusFilter === key ? "all" : key);
//                             setPage(0);
//                           }}
//                           className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                             statusFilter === key
//                               ? `${config.bg} ${config.color} border ${config.border}`
//                               : "bg-white/5 text-white/50 hover:bg-white/10"
//                           }`}
//                         >
//                           {config.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Source */}
//                   <div>
//                     <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
//                       Source
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => {
//                           setSourceFilter("all");
//                           setPage(0);
//                         }}
//                         className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                           sourceFilter === "all"
//                             ? "bg-[#2B7FFF] text-white"
//                             : "bg-white/5 text-white/50 hover:bg-white/10"
//                         }`}
//                       >
//                         All
//                       </button>
//                       {Object.entries(SOURCE_CONFIG).map(([key, config]) => (
//                         <button
//                           key={key}
//                           onClick={() => {
//                             setSourceFilter(sourceFilter === key ? "all" : key);
//                             setPage(0);
//                           }}
//                           className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                             sourceFilter === key
//                               ? `bg-white/10 text-white`
//                               : "bg-white/5 text-white/50 hover:bg-white/10"
//                           }`}
//                         >
//                           {config.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Lead Type */}
//                   <div>
//                     <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
//                       Lead Type
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => {
//                           setLeadTypeFilter("all");
//                           setPage(0);
//                         }}
//                         className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                           leadTypeFilter === "all"
//                             ? "bg-[#2B7FFF] text-white"
//                             : "bg-white/5 text-white/50 hover:bg-white/10"
//                         }`}
//                       >
//                         All
//                       </button>
//                       <button
//                         onClick={() => {
//                           setLeadTypeFilter(
//                             leadTypeFilter === "property_inquiry"
//                               ? "all"
//                               : "property_inquiry"
//                           );
//                           setPage(0);
//                         }}
//                         className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                           leadTypeFilter === "property_inquiry"
//                             ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
//                             : "bg-white/5 text-white/50 hover:bg-white/10"
//                         }`}
//                       >
//                         Property Inquiry
//                       </button>
//                       <button
//                         onClick={() => {
//                           setLeadTypeFilter(
//                             leadTypeFilter === "guide_download"
//                               ? "all"
//                               : "guide_download"
//                           );
//                           setPage(0);
//                         }}
//                         className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
//                           leadTypeFilter === "guide_download"
//                             ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
//                             : "bg-white/5 text-white/50 hover:bg-white/10"
//                         }`}
//                       >
//                         Guide Download
//                       </button>
//                     </div>
//                   </div>

//                   <div className="pt-4 border-t border-white/10">
//                     <button
//                       onClick={handleResetFilters}
//                       className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all"
//                     >
//                       Reset All Filters
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Lead Detail Drawer */}
//       <AnimatePresence>
//         {detailDrawerOpen && selectedLead && (
//           <>
//             <div
//               className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
//               onClick={() => {
//                 setDetailDrawerOpen(false);
//                 setSelectedLead(null);
//               }}
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#13273f] border-l border-white/10 z-50 overflow-y-auto"
//             >
//               {/* Header */}
//               <div
//                 className={`p-5 border-b border-white/10 ${
//                   selectedLead.isRead ? "bg-[#1b3454]" : "bg-[#2B7FFF]/20"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3
//                       className={`text-xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {selectedLead.name || "N/A"}
//                     </h3>
//                     <p className="text-white/40 text-xs mt-0.5">
//                       {selectedLead.isRead ? "Read" : "Unread"} • #
//                       {selectedLead._id?.slice(-6)}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setDetailDrawerOpen(false);
//                       setSelectedLead(null);
//                     }}
//                     className="p-2 rounded-lg hover:bg-white/10 transition-colors"
//                   >
//                     <X size={18} className="text-white/50" />
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-3">
//                   <span
//                     className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${STATUS_CONFIG[selectedLead.status]?.color} ${STATUS_CONFIG[selectedLead.status]?.bg} border ${STATUS_CONFIG[selectedLead.status]?.border}`}
//                   >
//                     {STATUS_CONFIG[selectedLead.status]?.icon}
//                     {STATUS_CONFIG[selectedLead.status]?.label}
//                   </span>
//                   <span
//                     className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getLeadTypeDisplay(selectedLead).color} ${getLeadTypeDisplay(selectedLead).bg} border ${getLeadTypeDisplay(selectedLead).border}`}
//                   >
//                     {getLeadTypeDisplay(selectedLead).icon}
//                     {getLeadTypeDisplay(selectedLead).label}
//                   </span>
//                   <span
//                     className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${SOURCE_CONFIG[selectedLead.source]?.color || "text-gray-400"} bg-white/5 border border-white/10`}
//                   >
//                     {SOURCE_CONFIG[selectedLead.source]?.label ||
//                       selectedLead.source ||
//                       "N/A"}
//                   </span>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="p-5 space-y-5">
//                 {/* Contact */}
//                 <div>
//                   <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                     Contact Information
//                   </h4>
//                   <div className="bg-[#1b3454] rounded-xl border border-white/10 p-3 space-y-2">
//                     {selectedLead.email && (
//                       <div className="flex items-center gap-2.5 text-sm">
//                         <Mail size={14} className="text-white/30 flex-shrink-0" />
//                         <span className="text-white/70 break-all">
//                           {selectedLead.email}
//                         </span>
//                       </div>
//                     )}
//                     {selectedLead.phone && (
//                       <div className="flex items-center gap-2.5 text-sm">
//                         <Phone size={14} className="text-white/30 flex-shrink-0" />
//                         <span className="text-white/70">
//                           {selectedLead.phone}
//                         </span>
//                       </div>
//                     )}
//                     {selectedLead.title && (
//                       <div className="flex items-center gap-2.5 text-sm">
//                         <FileText size={14} className="text-white/30 flex-shrink-0" />
//                         <span className="text-white/70">
//                           {selectedLead.title}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Message */}
//                 {selectedLead.message && (
//                   <div>
//                     <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                       Message
//                     </h4>
//                     <div className="bg-[#1b3454] rounded-xl border border-white/10 p-3 text-white/60 text-sm whitespace-pre-wrap leading-relaxed">
//                       {selectedLead.message}
//                     </div>
//                   </div>
//                 )}

//                 {/* Property Details */}
//                 {selectedLead.property && (
//                   <div>
//                     <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                       Property Details
//                     </h4>
//                     <div className="bg-[#1b3454] rounded-xl border border-white/10 p-3 space-y-3">
//                       <div className="flex gap-3">
//                         {selectedLead.property.thumbnail && (
//                           <img
//                             src={selectedLead.property.thumbnail}
//                             alt={selectedLead.property.title}
//                             className="w-20 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
//                           />
//                         )}
//                         <div className="min-w-0">
//                           <p className="text-white font-semibold text-sm truncate">
//                             {selectedLead.property.title || "N/A"}
//                           </p>
//                           {selectedLead.property.propertyCode && (
//                             <p className="text-white/30 text-xs">
//                               Code: {selectedLead.property.propertyCode}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         {selectedLead.property.propertyType && (
//                           <div>
//                             <p className="text-white/30 text-[11px]">Type</p>
//                             <p className="text-white/70 capitalize">
//                               {selectedLead.property.propertyType}
//                             </p>
//                           </div>
//                         )}
//                         {selectedLead.property.city && (
//                           <div>
//                             <p className="text-white/30 text-[11px]">City</p>
//                             <p className="text-white/70">
//                               {selectedLead.property.city}
//                             </p>
//                           </div>
//                         )}
//                         {selectedLead.property.price && (
//                           <div>
//                             <p className="text-white/30 text-[11px]">Price</p>
//                             <p className="text-white/70">
//                               {formatPrice(
//                                 selectedLead.property.price,
//                                 selectedLead.property.currency
//                               )}
//                               {selectedLead.property.priceType &&
//                                 ` ${selectedLead.property.priceType}`}
//                             </p>
//                           </div>
//                         )}
//                         {selectedLead.property.areaSize && (
//                           <div>
//                             <p className="text-white/30 text-[11px]">Area</p>
//                             <p className="text-white/70">
//                               {selectedLead.property.areaSize}{" "}
//                               {selectedLead.property.areaUnit}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ✅ Guide Download Info - Buyer/Seller clearly */}
//                 {selectedLead.leadType === "guide_download" && (
//                   <div>
//                     <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                       Guide Information
//                     </h4>
//                     <div
//                       className={`rounded-xl border p-3 flex items-center gap-3 ${
//                         selectedLead.guideType === "buyer"
//                           ? "bg-cyan-500/10 border-cyan-500/20"
//                           : selectedLead.guideType === "seller"
//                           ? "bg-amber-500/10 border-amber-500/20"
//                           : "bg-emerald-500/10 border-emerald-500/20"
//                       }`}
//                     >
//                       <BookOpen
//                         size={18}
//                         className={
//                           selectedLead.guideType === "buyer"
//                             ? "text-cyan-400"
//                             : selectedLead.guideType === "seller"
//                             ? "text-amber-400"
//                             : "text-emerald-400"
//                         }
//                       />
//                       <div>
//                         <p className="text-white font-semibold text-sm">
//                           {selectedLead.guideType === "buyer"
//                             ? "Buyer Guide"
//                             : selectedLead.guideType === "seller"
//                             ? "Seller Guide"
//                             : "Guide"}
//                         </p>
//                         <p className="text-white/40 text-xs">
//                           Downloaded on{" "}
//                           {formatDate(selectedLead.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Additional */}
//                 <div>
//                   <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                     Additional Info
//                   </h4>
//                   <div className="bg-[#1b3454] rounded-xl border border-white/10 p-3 space-y-2 text-sm">
//                     <div className="flex items-center gap-2.5">
//                       <span className="text-white/30">Source:</span>
//                       <span
//                         className={`${
//                           SOURCE_CONFIG[selectedLead.source]?.color ||
//                           "text-white/70"
//                         }`}
//                       >
//                         {SOURCE_CONFIG[selectedLead.source]?.label ||
//                           selectedLead.source ||
//                           "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2.5">
//                       <span className="text-white/30">Created:</span>
//                       <span className="text-white/70">
//                         {formatDate(selectedLead.createdAt)}
//                       </span>
//                     </div>
//                     {selectedLead.readAt && (
//                       <div className="flex items-center gap-2.5">
//                         <span className="text-white/30">Read at:</span>
//                         <span className="text-white/70">
//                           {formatDate(selectedLead.readAt)}
//                         </span>
//                       </div>
//                     )}
//                     {selectedLead.assignedTo && (
//                       <div className="flex items-center gap-2.5">
//                         <span className="text-white/30">Assigned to:</span>
//                         <span className="text-white/70">
//                           {selectedLead.assignedTo.name || "N/A"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Property Images */}
//                 {selectedLead.property?.images?.length > 0 && (
//                   <div>
//                     <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
//                       Property Images
//                     </h4>
//                     <div className="grid grid-cols-3 gap-1.5">
//                       {selectedLead.property.images
//                         .slice(0, 6)
//                         .map((img, i) => (
//                           <img
//                             key={i}
//                             src={img}
//                             alt={`Property ${i + 1}`}
//                             className="w-full h-20 rounded-lg object-cover border border-white/10 hover:scale-105 transition-transform cursor-pointer"
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               <div className="p-4 border-t border-white/10 bg-[#1b3454] sticky bottom-0">
//                 <div className="flex gap-2">
//                   {!selectedLead.isRead && (
//                     <button
//                       onClick={() => handleMarkAsRead(selectedLead._id)}
//                       disabled={markingReadIds.has(selectedLead._id)}
//                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#2B7FFF]/25 disabled:opacity-50"
//                     >
//                       <MailCheck
//                         size={16}
//                         className={
//                           markingReadIds.has(selectedLead._id)
//                             ? "animate-pulse"
//                             : ""
//                         }
//                       />
//                       {markingReadIds.has(selectedLead._id)
//                         ? "Marking..."
//                         : "Mark as Read"}
//                     </button>
//                   )}
//                   {selectedLead.isRead && (
//                     <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/15 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-500/25">
//                       <CheckCircle size={16} />
//                       Already Read
//                     </div>
//                   )}
//                   <button
//                     onClick={() => {
//                       setDetailDrawerOpen(false);
//                       handleDeleteClick(selectedLead);
//                     }}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold rounded-xl transition-all"
//                   >
//                     <Delete size={16} /> Delete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Delete Confirmation Dialog */}
//       <AnimatePresence>
//         {deleteDialogOpen && leadToDelete && (
//           <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//             <div
//               className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//               onClick={() => {
//                 setDeleteDialogOpen(false);
//                 setLeadToDelete(null);
//               }}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 10 }}
//               className="relative bg-[#1b3454] rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl"
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
//                   <AlertTriangle size={24} className="text-red-400" />
//                 </div>
//                 <h3 className="text-lg font-bold text-white mb-2">
//                   Delete Lead
//                 </h3>
//                 <p className="text-white/50 text-sm mb-4">
//                   Are you sure you want to delete this lead? This action cannot
//                   be undone.
//                 </p>

//                 {leadToDelete && (
//                   <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5">
//                     <p className="text-white font-semibold text-sm">
//                       {leadToDelete.name || "N/A"}
//                     </p>
//                     <p className="text-white/40 text-xs mt-0.5">
//                       {leadToDelete.email || "No email"}
//                     </p>
//                     {leadToDelete.phone && (
//                       <p className="text-white/40 text-xs">
//                         {leadToDelete.phone}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex gap-3 w-full">
//                   <button
//                     onClick={() => {
//                       setDeleteDialogOpen(false);
//                       setLeadToDelete(null);
//                     }}
//                     className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleConfirmDelete}
//                     className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/25"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Snackbar */}
//       <AnimatePresence>
//         {snackbar.open && (
//           <motion.div
//             initial={{ opacity: 0, y: 50, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: 50, x: "-50%" }}
//             className="fixed bottom-6 left-1/2 z-[99999]"
//           >
//             <div
//               className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${
//                 snackbar.type === "success"
//                   ? "bg-emerald-500/90 text-white border-emerald-400/30"
//                   : snackbar.type === "error"
//                   ? "bg-red-500/90 text-white border-red-400/30"
//                   : "bg-[#2B7FFF]/90 text-white border-[#2B7FFF]/30"
//               }`}
//             >
//               {snackbar.type === "success" ? (
//                 <CheckCircle size={16} />
//               ) : snackbar.type === "error" ? (
//                 <AlertCircle size={16} />
//               ) : (
//                 <Info size={16} />
//               )}
//               {snackbar.message}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }











'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Trash2,
  Eye,
  MailCheck,
  RefreshCw,
  X,
  Phone,
  Mail,
  User,
  Home,
  Calendar,
  TrendingUp,
  Users,
  FileDown,
  Info,
  Sparkles,
  MessageSquare,
  Star,
  Check,
  XCircle,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import {
  getAllLeads,
  getLeadById,
  deleteLead,
  markLeadAsRead,
} from "@/lib/api";

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
// CONSTANTS
// ============================================
const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
    icon: <Sparkles size={12} />,
  },
  contacted: {
    label: "Contacted",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/25",
    icon: <MessageSquare size={12} />,
  },
  qualified: {
    label: "Qualified",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/25",
    icon: <Check size={12} />,
  },
  converted: {
    label: "Converted",
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/25",
    icon: <Star size={12} />,
  },
  lost: {
    label: "Lost",
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/25",
    icon: <XCircle size={12} />,
  },
};

const SOURCE_CONFIG = {
  website: { label: "Website", color: "text-blue-400" },
  facebook: { label: "Facebook", color: "text-indigo-400" },
  instagram: { label: "Instagram", color: "text-pink-400" },
  google: { label: "Google", color: "text-emerald-400" },
  referral: { label: "Referral", color: "text-amber-400" },
  direct: { label: "Direct", color: "text-gray-400" },
  whatsapp: { label: "WhatsApp", color: "text-emerald-400" },
  call: { label: "Call", color: "text-orange-400" },
  email: { label: "Email", color: "text-blue-400" },
};

// ============================================
// HELPERS
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${Number(price).toLocaleString()}`;
};

const getLeadTypeDisplay = (lead) => {
  if (lead.leadType === "guide_download") {
    if (lead.guideType === "buyer") {
      return {
        label: "Buyer Guide",
        icon: <BookOpen size={12} />,
        color: "text-cyan-400",
        bg: "bg-cyan-500/15",
        border: "border-cyan-500/25",
      };
    }
    if (lead.guideType === "seller") {
      return {
        label: "Seller Guide",
        icon: <BookOpen size={12} />,
        color: "text-amber-400",
        bg: "bg-amber-500/15",
        border: "border-amber-500/25",
      };
    }
    return {
      label: "Guide Download",
      icon: <FileDown size={12} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/25",
    };
  }

  return {
    label: "Property Inquiry",
    icon: <Home size={12} />,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
  };
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function LeadsPage() {
  // ---- State ----
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all"); // "all" | "read" | "unread"
  const [statusFilterNew, setStatusFilterNew] = useState(false); // if true, show only status 'new'

  // These are kept for API calls but not exposed via UI
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [leadTypeFilter, setLeadTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // UI
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [markingReadIds, setMarkingReadIds] = useState(new Set());

  // ---- Debounce Search ----
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ---- Fetch ----
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
        status: statusFilter !== "all" ? statusFilter : undefined,
        source: sourceFilter !== "all" ? sourceFilter : undefined,
        leadType: leadTypeFilter !== "all" ? leadTypeFilter : undefined,
      };
      const response = await getAllLeads(params);
      if (response.success) {
        setLeads(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      showSnackbar("Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, sourceFilter, leadTypeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ---- Client-side filtering (search, read, new) ----
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // 1. Read filter
    if (readFilter === "read") {
      result = result.filter((l) => l.isRead === true);
    } else if (readFilter === "unread") {
      result = result.filter((l) => l.isRead !== true);
    }

    // 2. New status filter
    if (statusFilterNew) {
      result = result.filter((l) => l.status === "new");
    }

    // 3. Search (client-side partial match)
    if (debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((l) =>
        (l.name && l.name.toLowerCase().includes(query)) ||
        (l.email && l.email.toLowerCase().includes(query)) ||
        (l.phone && l.phone.toLowerCase().includes(query)) ||
        (l.property?.title && l.property.title.toLowerCase().includes(query))
      );
    }

    return result;
  }, [leads, readFilter, statusFilterNew, debouncedSearch]);

  // ---- Counts for cards ----
  const counts = useMemo(() => {
    const total = leads.length;
    const read = leads.filter(l => l.isRead === true).length;
    const unread = leads.filter(l => l.isRead !== true).length;
    const newLeads = leads.filter(l => l.status === "new").length;
    return { total, read, unread, newLeads };
  }, [leads]);

  // ---- Snackbar (auto-dismiss) ----
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  // ---- Handlers ----
  const handleViewLead = async (lead, e) => {
    if (e) e.stopPropagation();
    try {
      let leadData = lead;
      if (!lead.property && !lead.assignedTo) {
        const response = await getLeadById(lead._id);
        if (response.success) leadData = response.data;
      }
      setSelectedLead(leadData);
      setDetailModalOpen(true);
      if (!leadData.isRead) {
        handleMarkAsRead(leadData._id, true);
      }
    } catch (error) {
      console.error("View Lead Error:", error);
      showSnackbar("Failed to load lead details", "error");
    }
  };

  const handleMarkAsRead = async (leadId, silent = false) => {
    if (markingReadIds.has(leadId)) return;
    try {
      setMarkingReadIds((prev) => new Set(prev).add(leadId));
      const response = await markLeadAsRead(leadId);
      if (response.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === leadId
              ? { ...l, isRead: true, readAt: new Date().toISOString() }
              : l
          )
        );
        setSelectedLead((prev) => {
          if (prev && prev._id === leadId) {
            return { ...prev, isRead: true, readAt: new Date().toISOString() };
          }
          return prev;
        });
        if (!silent) {
          showSnackbar("Marked as read", "success");
        }
      }
    } catch (error) {
      console.error("Mark Read Error:", error);
      if (!silent) showSnackbar("Failed to mark as read", "error");
    } finally {
      setMarkingReadIds((prev) => {
        const next = new Set(prev);
        next.delete(leadId);
        return next;
      });
    }
  };

  const handleDeleteClick = (lead, e) => {
    if (e) e.stopPropagation();
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete?._id) return;
    try {
      const response = await deleteLead(leadToDelete._id);
      if (response.success) {
        setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
        setPagination((prev) => ({ ...prev, totalRecords: prev.totalRecords - 1 }));
        showSnackbar("Lead deleted successfully", "success");
        if (selectedLead?._id === leadToDelete._id) {
          setDetailModalOpen(false);
          setSelectedLead(null);
        }
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to delete lead", "error");
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setReadFilter("all");
    setStatusFilterNew(false);
    setPage(0);
  };

  // ---- Render ----
  return (
    <div className={`${inter.variable} font-(family-name:--font-inter)}`}>
      {/* Header with Refresh Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)}`}>
            Leads Management
          </h1>
          <p className="text-white/40 text-sm">Manage and track all your leads from various sources</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ===== CARDS: All, Read, Unread, New ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => { setReadFilter("all"); setStatusFilterNew(false); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "all" && !statusFilterNew ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">All Leads</span>
            <Users size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.total}</p>
        </div>

        <div
          onClick={() => { setReadFilter("unread"); setStatusFilterNew(false); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "unread" && !statusFilterNew ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Unread</span>
            <Mail size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.unread}</p>
        </div>

        <div
          onClick={() => { setReadFilter("read"); setStatusFilterNew(false); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "read" && !statusFilterNew ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Read</span>
            <MailCheck size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.read}</p>
        </div>

        <div
          onClick={() => { setReadFilter("all"); setStatusFilterNew(true); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            statusFilterNew && readFilter === "all" ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">New</span>
            <Sparkles size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.newLeads}</p>
        </div>
      </div>

      {/* ===== Search + Filter Buttons (half-half) ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar - Half Width */}
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or property title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full bg-[#1b3454] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} className="text-white/30" />
            </button>
          )}
        </div>

        {/* Filter Buttons - Half Width */}
        <div className="flex items-center gap-2 w-full md:w-1/2 justify-start md:justify-end">
          <button
            onClick={() => { setReadFilter("all"); setStatusFilterNew(false); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "all" && !statusFilterNew
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setReadFilter("unread"); setStatusFilterNew(false); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "unread" && !statusFilterNew
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => { setReadFilter("read"); setStatusFilterNew(false); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "read" && !statusFilterNew
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Read
          </button>
          <button
            onClick={() => { setReadFilter("all"); setStatusFilterNew(true); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilterNew && readFilter === "all"
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            New
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-50">Lead Info</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-40">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-30">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="w-6 h-4 bg-white/5 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5" />
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-white/5 rounded" />
                          <div className="w-24 h-3 bg-white/5 rounded mt-1" />
                          <div className="w-20 h-3 bg-white/5 rounded mt-1" />
                        </div>
                      </div>
                    </td>
                    <td><div className="w-24 h-4 bg-white/5 rounded" /></td>
                    <td><div className="w-20 h-5 bg-white/5 rounded" /></td>
                    <td><div className="w-14 h-6 bg-white/5 rounded-full" /></td>
                    <td><div className="w-16 h-5 bg-white/5 rounded" /></td>
                    <td><div className="w-24 h-4 bg-white/5 rounded" /></td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center mx-auto mb-4 border border-[#2B7FFF]/15">
                      <Users size={28} className="text-[#2B7FFF]/40" />
                    </div>
                    <p className="text-white/40 text-sm">No leads found</p>
                    <p className="text-white/25 text-xs mt-1">
                      {debouncedSearch || readFilter !== "all" || statusFilterNew
                        ? "Try adjusting your search or filters"
                        : "Leads will appear here when customers submit inquiries"}
                    </p>
                    {(debouncedSearch || readFilter !== "all" || statusFilterNew) && (
                      <button onClick={handleResetFilters} className="text-[#2B7FFF] text-sm font-semibold mt-2 hover:underline cursor-pointer">
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, idx) => {
                  const isUnread = !lead.isRead;
                  // Determine status display: if unread, show "New" regardless of actual status
                  const statusKey = isUnread ? "new" : (lead.status || "new");
                  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
                  const sourceConfig = SOURCE_CONFIG[lead.source] || { label: lead.source || "N/A", color: "text-gray-400" };
                  const leadTypeDisplay = getLeadTypeDisplay(lead);

                  return (
                    <tr
                      key={lead._id}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${isUnread ? "bg-white/3" : ""}`}
                      onClick={(e) => handleViewLead(lead, e)}
                    >
                      <td className="px-4 py-3 text-white/40 text-xs">{page * rowsPerPage + idx + 1}</td>

                      {/* Lead Info: Name, Email, Phone (each on new line) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase ${isUnread ? "bg-[#2B7FFF] text-white" : "bg-white/10 text-white/40"}`}>
                              {lead.name?.charAt(0) || "?"}
                            </div>
                            {isUnread && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2B7FFF] rounded-full border-2 border-[#1b3454]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm truncate max-w-37 ${isUnread ? "font-semibold text-white" : "text-white/70"}`}>
                                {lead.name || "N/A"}
                              </p>
                              {isUnread && (
                                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#2B7FFF] text-white uppercase tracking-wider shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-white/40 truncate max-w-40">
                              <Mail size={10} className="inline mr-1" />
                              {lead.email || "No email"}
                            </div>
                            {lead.phone && (
                              <div className="text-[11px] text-white/40 truncate max-w-40">
                                <Phone size={10} className="inline mr-1" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-4 py-3 text-white/70 text-sm truncate max-w-40">
                        {lead.property?.title || "N/A"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${leadTypeDisplay.color} ${leadTypeDisplay.bg} border ${leadTypeDisplay.border}`}>
                          {leadTypeDisplay.icon}
                          {leadTypeDisplay.label}
                        </span>
                      </td>

                      {/* Status - shows "New" if unread, else actual status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusConfig.color} ${statusConfig.bg} border ${statusConfig.border}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3">
                        <span className={`text-xs ${sourceConfig.color}`}>{sourceConfig.label}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-white/40 text-xs">{formatDate(lead.createdAt)}</td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleViewLead(lead, e)}
                            className="p-2 rounded-lg hover:bg-[#2B7FFF]/15 text-white/40 hover:text-[#2B7FFF] transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>

                          {isUnread && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(lead._id);
                              }}
                              disabled={markingReadIds.has(lead._id)}
                              className="p-2 rounded-lg hover:bg-emerald-500/15 text-white/40 hover:text-emerald-400 transition-colors disabled:opacity-40 cursor-pointer"
                              title="Mark as Read"
                            >
                              <MailCheck size={20} className={markingReadIds.has(lead._id) ? "animate-pulse" : ""} />
                            </button>
                          )}

                          <button
                            onClick={(e) => handleDeleteClick(lead, e)}
                            className="p-2 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination (attractive) ===== */}
        {!loading && filteredLeads.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
            <div className="text-sm text-white/40">
              Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, pagination.totalRecords)} of {pagination.totalRecords}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-[#1b3454] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/60 focus:outline-none focus:border-[#2B7FFF]/40 cursor-pointer"
              >
                {[5, 10, 25, 50].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] hover:bg-[#2B7FFF]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {/* Show page numbers */}
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    // Show first, last, and around current
                    if (i === 0) pageNum = 1;
                    else if (i === 4) pageNum = pagination.totalPages;
                    else {
                      const mid = Math.min(Math.max(page, 1), pagination.totalPages - 2);
                      pageNum = mid + i - 1;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum - 1)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        page === pageNum - 1
                          ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                  disabled={page >= pagination.totalPages - 1}
                  className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] hover:bg-[#2B7FFF]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== LEAD DETAIL MODAL (Centered Card) ===== */}
      <AnimatePresence>
        {detailModalOpen && selectedLead && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setDetailModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-[#1b3454] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold uppercase ${!selectedLead.isRead ? "bg-[#2B7FFF] text-white" : "bg-white/10 text-white/40"}`}>
                      {selectedLead.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedLead.name || "N/A"}</h2>
                      <p className="text-sm text-white/40">{selectedLead.email || "No email"}</p>
                      {selectedLead.phone && <p className="text-sm text-white/40">{selectedLead.phone}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={20} className="text-white/50" />
                  </button>
                </div>

                {/* Lead Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-white/30" />
                      <span className="text-white/60">Name:</span>
                      <span className="text-white">{selectedLead.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-white/30" />
                      <span className="text-white/60">Email:</span>
                      <span className="text-white break-all">{selectedLead.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-white/30" />
                      <span className="text-white/60">Phone:</span>
                      <span className="text-white">{selectedLead.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Home size={16} className="text-white/30" />
                      <span className="text-white/60">Property:</span>
                      <span className="text-white">{selectedLead.property?.title || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Info size={16} className="text-white/30" />
                      <span className="text-white/60">Status:</span>
                      <span className={`${STATUS_CONFIG[selectedLead.status]?.color || "text-white"}`}>
                        {STATUS_CONFIG[selectedLead.status]?.label || selectedLead.status || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp size={16} className="text-white/30" />
                      <span className="text-white/60">Source:</span>
                      <span className={SOURCE_CONFIG[selectedLead.source]?.color || "text-white"}>
                        {SOURCE_CONFIG[selectedLead.source]?.label || selectedLead.source || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-white/30" />
                      <span className="text-white/60">Created:</span>
                      <span className="text-white">{formatDate(selectedLead.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MailCheck size={16} className="text-white/30" />
                      <span className="text-white/60">Read:</span>
                      <span className="text-white">{selectedLead.isRead ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedLead.message && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/60">Message:</p>
                    <p className="text-white text-sm mt-1">{selectedLead.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                  {!selectedLead.isRead && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedLead._id);
                      }}
                      disabled={markingReadIds.has(selectedLead._id)}
                      className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <MailCheck size={16} />
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      setLeadToDelete(selectedLead);
                      setDeleteDialogOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ===== DELETE CONFIRMATION DIALOG ===== */}
      <AnimatePresence>
        {deleteDialogOpen && leadToDelete && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setDeleteDialogOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1b3454] rounded-2xl border border-white/10 max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-2">Delete Lead</h3>
                <p className="text-white/60 text-sm mb-6">
                  Are you sure you want to delete the lead <span className="text-white font-semibold">{leadToDelete.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ===== SNACKBAR ===== */}
      <AnimatePresence>
        {snackbar.open && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                snackbar.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" :
                snackbar.type === "error" ? "bg-red-500/20 border border-red-500/30 text-red-400" :
                "bg-blue-500/20 border border-blue-500/30 text-blue-400"
              }`}
            >
              {snackbar.type === "success" && <Check size={18} />}
              {snackbar.type === "error" && <AlertCircle size={18} />}
              <span className="text-sm font-medium">{snackbar.message}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}