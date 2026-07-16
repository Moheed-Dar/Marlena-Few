import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    
    // ⚠️ YEH 2 FIELDS MISSING THE JO MAINE ADD KIYE HAIN
    isRead: {
      type: Boolean,
      default: false, // Naya contact aaye toh by default unread hoga
    },
    readAt: {
      type: Date,
      default: null, // Jab tak read nahi hoga tab tak null rahega
    },
    // ==========================================

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Yeh automatically createdAt aur updatedAt add kar dega
  }
);

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);