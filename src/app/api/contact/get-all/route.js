import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    // Search & Filters
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const isRead = searchParams.get('isRead'); // 'true', 'false', ya empty
    const isReplied = searchParams.get('isReplied'); // 'true', 'false', ya empty
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // ============================================
    // FILTER BUILD
    // ============================================
    const filter = {};

    // Search Filter (Name, Email, Phone, Message)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Read/Unread Filter
    if (isRead === 'true') {
      filter.isRead = true;
    } else if (isRead === 'false') {
      filter.isRead = false;
    }

    // Replied/Not Replied Filter
    if (isReplied === 'true') {
      filter.isReplied = true;
    } else if (isReplied === 'false') {
      filter.isReplied = false;
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

    // ============================================
    // SORTING
    // ============================================
    const sort = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'email'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // ============================================
    // PAGINATION
    // ============================================
    const skip = (page - 1) * limit;
    const totalContacts = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // ============================================
    // STATS
    // ============================================
    const stats = {
      total: totalContacts,
      unread: await Contact.countDocuments({ isRead: false }),
      read: await Contact.countDocuments({ isRead: true }),
      replied: await Contact.countDocuments({ isReplied: true }),
      pending: await Contact.countDocuments({ isReplied: false }),
    };

    // ============================================
    // PAGINATION OBJECT
    // ============================================
    const totalPages = Math.ceil(totalContacts / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalRecords: totalContacts,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Contacts fetched successfully",
        total: totalContacts,
        data: contacts,
        pagination,
        stats,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Contacts Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching contacts",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}