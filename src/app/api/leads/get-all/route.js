// import { NextResponse } from 'next/server';
// import dbConnect from '@/backend/lib/db';
// import Lead from '@/backend/models/lead';
// import Property from '@/backend/models/property';  // ✅ YE LINE ADD KARO
// import mongoose from 'mongoose';

// export async function GET(request) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
    
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 10;
//     const search = searchParams.get('search') || '';
//     const status = searchParams.get('status') || '';
//     const source = searchParams.get('source') || '';
//     const priority = searchParams.get('priority') || '';
//     const property = searchParams.get('property') || '';
//     const dateFrom = searchParams.get('dateFrom') || '';
//     const dateTo = searchParams.get('dateTo') || '';
//     const sortBy = searchParams.get('sortBy') || 'createdAt';
//     const sortOrder = searchParams.get('sortOrder') || 'desc';

//     const filter = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { propertyName: { $regex: search, $options: 'i' } },
//       ];
//     }

//     if (status) filter.status = status;
//     if (source) filter.source = source;
//     if (priority) filter.priority = priority;

//     if (property && mongoose.Types.ObjectId.isValid(property)) {
//       filter.property = new mongoose.Types.ObjectId(property);
//     }

//     if (dateFrom || dateTo) {
//       filter.createdAt = {};
//       if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
//       if (dateTo) {
//         const endDate = new Date(dateTo);
//         endDate.setDate(endDate.getDate() + 1);
//         filter.createdAt.$lt = endDate;
//       }
//     }

//     const sort = {};
//     const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'priority', 'source'];
//     const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
//     sort[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

//     const skip = (page - 1) * limit;

//     const totalLeads = await Lead.countDocuments(filter);
    
//     const leads = await Lead.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .populate('property', 'title propertyCode city propertyType price')  // ✅ Ab yeh kaam karega
//       .lean();

//     const stats = {
//       total: totalLeads,
//       new: await Lead.countDocuments({ status: 'new' }),
//       contacted: await Lead.countDocuments({ status: 'contacted' }),
//       qualified: await Lead.countDocuments({ status: 'qualified' }),
//       converted: await Lead.countDocuments({ status: 'converted' }),
//       lost: await Lead.countDocuments({ status: 'lost' }),
//     };

//     const totalPages = Math.ceil(totalLeads / limit);

//     const pagination = {
//       currentPage: page,
//       totalPages,
//       totalRecords: totalLeads,
//       limit,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//       nextPage: page < totalPages ? page + 1 : null,
//       prevPage: page > 1 ? page - 1 : null,
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Leads fetched successfully",
//         data: leads,
//         pagination,
//         stats,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("GET Leads Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error while fetching leads",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }

























// backend/app/api/leads/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import Property from '@/backend/models/property';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const priority = searchParams.get('priority') || '';
    const property = searchParams.get('property') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // ✅ NEW: Guide & Lead Type Filters
    const leadType = searchParams.get('leadType') || '';
    const guideType = searchParams.get('guideType') || '';

    const filter = {};

    // Search Filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    // Existing Filters
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;

    // Property Filter
    if (property && mongoose.Types.ObjectId.isValid(property)) {
      filter.property = new mongoose.Types.ObjectId(property);
    }

    // ✅ NEW: Lead Type Filter (property_inquiry ya guide_download)
    if (leadType) {
      filter.leadType = leadType;
    }

    // ✅ NEW: Guide Type Filter (buyer ya seller)
    if (guideType) {
      filter.guideType = guideType;
    }

    // Date Range Filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filter.createdAt.$lt = endDate;
      }
    }

    // Sorting
    const sort = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'priority', 'source', 'leadType', 'guideType'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Total Count
    const totalLeads = await Lead.countDocuments(filter);

    // Fetch Leads
    const leads = await Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('property', 'title propertyCode city propertyType price')
      .lean();

    // ✅ Updated Stats (Guide downloads bhi include kiye)
    const stats = {
      total: totalLeads,
      new: await Lead.countDocuments({ status: 'new' }),
      contacted: await Lead.countDocuments({ status: 'contacted' }),
      qualified: await Lead.countDocuments({ status: 'qualified' }),
      converted: await Lead.countDocuments({ status: 'converted' }),
      lost: await Lead.countDocuments({ status: 'lost' }),
      // ✅ NEW: Guide Download Stats
      propertyInquiries: await Lead.countDocuments({ leadType: 'property_inquiry' }),
      guideDownloads: await Lead.countDocuments({ leadType: 'guide_download' }),
      buyerGuideDownloads: await Lead.countDocuments({ guideType: 'buyer' }),
      sellerGuideDownloads: await Lead.countDocuments({ guideType: 'seller' }),
    };

    // Pagination
    const totalPages = Math.ceil(totalLeads / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalRecords: totalLeads,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Leads fetched successfully",
        total: totalLeads,
        data: leads,
        pagination,
        stats,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Leads Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching leads",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}