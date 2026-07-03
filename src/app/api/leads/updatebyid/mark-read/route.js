import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/database";
import Lead from "@/backend/models/lead";

// ✅ PATCH: Mark Single Lead as Read by ID
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Find and update ONLY this specific lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead marked as read",
        data: updatedLead,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark as read",
        error: error.message,
      },
      { status: 500 }
    );
  }
}