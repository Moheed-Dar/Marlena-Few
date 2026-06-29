import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import Property from '@/backend/models/property';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // 1. Database Connect
    await dbConnect();

    // 2. ID Nikalo (await lagaya hai - Next.js 15+ mein params Promise hai)
    const { id } = await params;

    // 3. ID Valid Check Karo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Lead ID format" },
        { status: 400 }
      );
    }

    // 4. Lead Fetch Karo With Property Details
    const lead = await Lead.findById(id)
      .populate('property', 'title propertyCode city propertyType price priceType currency areaSize areaUnit location thumbnail images')
      .populate('assignedTo', 'name email phone avatar')
      .lean();

    // 5. Lead Exist Check Karo
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    // 6. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Lead fetched successfully",
        data: lead,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Single Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching lead",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}