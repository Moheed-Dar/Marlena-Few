// import mongoose from 'mongoose';

// const leadSchema = new mongoose.Schema(
//   {
//     // Lead Contact Info
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       minlength: [2, 'Name must be at least 2 characters'],
//       maxlength: [50, 'Name cannot exceed 50 characters'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       trim: true,
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         'Please provide a valid email',
//       ],
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required'],
//       trim: true,
//     },

//     // Lead Details
//     message: {
//       type: String,
//       trim: true,
//       maxlength: [1000, 'Message cannot exceed 1000 characters'],
//     },

//     // Property Reference
//     property: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Property',
//     },
//     title: {
//       type: String,
//       trim: true,
//     },

//     // Lead Source
//     source: {
//       type: String,
//       enum: ['website', 'facebook', 'whatsapp', 'referral', 'other'],
//       default: 'website',
//     },

//     // Lead Status
//     status: {
//       type: String,
//       enum: ['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'],
//       default: 'new',
//     },

//     // Priority
//     priority: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'hot'],
//       default: 'medium',
//     },

//     // Notes (for admin)
//     notes: {
//       type: String,
//       trim: true,
//     },

//     // Follow Up
//     followUpDate: {
//       type: Date,
//     },
//     followUpNotes: {
//       type: String,
//       trim: true,
//     },

//     // Assigned To
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },

//     // IP Address
//     ipAddress: {
//       type: String,
//     },

//     // User Agent
//     userAgent: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Create indexes
// leadSchema.index({ property: 1 });
// leadSchema.index({ status: 1 });
// leadSchema.index({ email: 1 });
// leadSchema.index({ createdAt: -1 });

// export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// backend/models/lead.js

import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    // Lead Contact Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Lead Details
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    // ✅ NEW: Lead Type (Property Inquiry ya Guide Download)
    leadType: {
      type: String,
      enum: ["property_inquiry", "guide_download"],
      default: "property_inquiry",
    },

    // ✅ NEW: Guide Type (Konsa guide download kiya)
    guideType: {
      type: String,
      enum: ["buyer", "seller", null],
      default: null,
    },

    // Property Reference
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    title: {
      type: String,
      trim: true,
    },

    // Lead Source
    source: {
      type: String,
      enum: ["website", "facebook", "whatsapp", "referral", "other"],
      default: "website",
    },

    // Lead Status
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "negotiation",
        "converted",
        "lost",
      ],
      default: "new",
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "hot"],
      default: "medium",
    },

    // Notes (for admin)
    notes: {
      type: String,
      trim: true,
    },

    // Follow Up
    followUpDate: {
      type: Date,
    },
    followUpNotes: {
      type: String,
      trim: true,
    },

    // Assigned To
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    // IP Address
    ipAddress: {
      type: String,
    },

    // User Agent
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes
leadSchema.index({ property: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });
// ✅ NEW Indexes
leadSchema.index({ leadType: 1 });
leadSchema.index({ guideType: 1 });

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
