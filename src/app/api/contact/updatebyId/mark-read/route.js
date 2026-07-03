import { NextResponse } from "next/server";
import  connectDB  from "@/backend/lib/db";
import Contact from "@/backend/models/contact";

// ✅ PATCH: Mark Single Contact as Read by ID
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Find and update ONLY this specific contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact marked as read",
        data: updatedContact,
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