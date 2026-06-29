import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // 1. Database Connect
    await dbConnect();

    // 2. ID Ko Params Se Lo
    const { id } = await params;

    // 3. ID Valid Ha Ya Nahi Check Karo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Contact ID format" },
        { status: 400 }
      );
    }

    // 4. Database Mein Dhundo
    const contact = await Contact.findById(id).lean();

    // 5. Agar Nahi Mila
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    // 6. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Contact fetched successfully",
        data: contact
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Contact By ID Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching contact",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}