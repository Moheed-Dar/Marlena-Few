// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';

// const patchProperty = async (request, context, user) => {
//   try {
//     await connectDB();

//     if (user.role !== 'admin') {
//       throw new ApiError(403, 'Access denied. Only admin can update properties.');
//     }

//     const { id } = await context.params;
//     if (!id) throw new ApiError(400, 'Property ID is required');

//     const existingProperty = await Property.findById(id);
//     if (!existingProperty) throw new ApiError(404, 'Property not found');

//     const contentType = request.headers.get('content-type') || '';
//     let updateData = {};
//     let newImageFiles = [];
//     let imagesToRemove = [];

//     // ============================================
//     // 1. DATA EXTRACT
//     // ============================================
//     if (contentType.includes('multipart/form-data')) {
//       const formData = await request.formData();

//       const textFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
//       ];

//       textFields.forEach(field => {
//         const val = formData.get(field);
//         if (val !== null && val !== undefined && val !== '') {
//           if (['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'].includes(field)) {
//             updateData[field] = Number(val);
//           } else if (field === 'isFeatured' || field === 'isPublished') {
//             updateData[field] = val === 'true' || val === true;
//           } else if (field === 'latitude' || field === 'longitude') {
//             updateData[field] = Number(val) || null;
//           } else {
//             updateData[field] = String(val).trim();
//           }
//         }
//       });

//       for (const field of ['features', 'amenities']) {
//         const raw = formData.get(field);
//         if (raw) {
//           try {
//             const parsed = JSON.parse(raw);
//             if (Array.isArray(parsed)) updateData[field] = parsed;
//           } catch (e) { }
//         }
//       }

//       const removeRaw = formData.get('removeImages');
//       if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
//         try {
//           const parsed = JSON.parse(removeRaw);
//           if (Array.isArray(parsed)) {
//             imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
//           } else if (typeof parsed === 'string' && parsed.trim()) {
//             imagesToRemove = [parsed.trim()];
//           }
//         } catch (e) {
//           const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
//           if (cleaned.includes(',')) {
//             imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
//           } else if (cleaned) {
//             imagesToRemove = [cleaned];
//           }
//         }
//       }

//       const allImages = formData.getAll('images');
//       newImageFiles = allImages.filter(file => {
//         if (file instanceof File && file.size > 0) return true;
//         if (file && typeof file === 'object' && file.name && file.size > 0 && file.type?.startsWith('image/')) return true;
//         return false;
//       });

//     } else {
//       const body = await request.json();
//       const allowedFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
//         'features', 'amenities'
//       ];

//       allowedFields.forEach(field => {
//         if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
//           updateData[field] = body[field];
//         }
//       });

//       if (body.removeImages) {
//         if (Array.isArray(body.removeImages)) {
//           imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
//         } else if (typeof body.removeImages === 'string') {
//           imagesToRemove = [body.removeImages];
//         }
//       }
//     }

//     // ============================================
//     // 2. IMAGE LOGIC (SAME POSITION REPLACE)
//     // ============================================
//     let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
//     let imageModified = false;
//     let removedIndexes = [];

//     if (imagesToRemove.length > 0) {
//       const foundMatches = [];
      
//       for (const removeId of imagesToRemove) {
//         const matchIndex = currentImages.findIndex(img => {
//           const dbId = img.public_id || '';
//           return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
//         });

//         if (matchIndex !== -1) {
//           foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
//         }
//       }

//       foundMatches.sort((a, b) => b.index - a.index);

//       for (const match of foundMatches) {
//         try {
//           await deleteImage(match.public_id);
//         } catch (err) { }
//         currentImages.splice(match.index, 1);
//         removedIndexes.push(match.index);
//         imageModified = true;
//       }

//       removedIndexes.sort((a, b) => a - b);
//     }

//     let uploadedImages = [];
    
//     if (newImageFiles.length > 0) {
//       if (currentImages.length + newImageFiles.length > 10) {
//         throw new ApiError(400, `Maximum 10 images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}`);
//       }

//       uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
//         maxWidth: 1920,
//         maxHeight: 1080,
//         quality: 80,
//       });
//     }

//     if (uploadedImages.length > 0) {
//       uploadedImages.forEach((img, i) => {
//         if (i < removedIndexes.length) {
//           currentImages.splice(removedIndexes[i], 0, img);
//         } else {
//           currentImages.push(img);
//         }
//       });
//       imageModified = true;
//     }

//     if (imageModified) {
//       updateData.images = currentImages;
//       updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
//     }

//     // ============================================
//     // 3. DATABASE UPDATE
//     // ============================================
//     if (Object.keys(updateData).length === 0) {
//       throw new ApiError(400, 'No valid fields provided to update');
//     }

//     updateData.updatedBy = user._id;

//     const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
//       new : true,
//       runValidators: true,
//     });

//     if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

//     await updatedProperty.populate('addedBy', 'name email phone avatar');

//     // ============================================
//     // 4. RESPONSE
//     // ============================================
//     const obj = updatedProperty.toObject();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Property updated successfully',
//       updatedFields: Object.keys(updateData),
//       data: {
//         _id: obj._id,
//         propertyCode: obj.propertyCode,
//         title: obj.title,
//         description: obj.description,
//         price: obj.price,
//         priceType: obj.priceType,
//         currency: obj.currency,
//         location: obj.location,
//         city: obj.city,
//         area: obj.area,
//         address: obj.address,
//         coordinates: { latitude: obj.latitude, longitude: obj.longitude },
//         propertyType: obj.propertyType,
//         bedrooms: obj.bedrooms,
//         bathrooms: obj.bathrooms,
//         kitchens: obj.kitchens,
//         areaSize: obj.areaSize,
//         areaUnit: obj.areaUnit,
//         floors: obj.floors,
//         yearBuilt: obj.yearBuilt,
//         features: obj.features,
//         amenities: obj.amenities,
//         images: obj.images,
//         thumbnail: obj.thumbnail,
//         status: obj.status,
//         isFeatured: obj.isFeatured,
//         isPublished: obj.isPublished,
//         contact: {
//           name: obj.contactName,
//           phone: obj.contactPhone,
//           email: obj.contactEmail,
//         },
//         addedBy: obj.addedBy,
//         createdAt: obj.createdAt,
//         updatedAt: obj.updatedAt,
//       },
//     }, { status: 200 });

//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal Server Error' },
//       { status: statusCode }
//     );
//   }
// };

// export const PATCH = withAuth(patchProperty);

















import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Property from '@/backend/models/property';
import { withAdminAuth } from '@/backend/middleware/auth';
import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { getSecurityHeaders, securityLog, sanitizeInput, validateFiles } from '@/backend/lib/security';

// ==========================================
// ✅ MONGODB OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const patchProperty = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    // ❌ REMOVED: Manual admin check (withAdminAuth handles it now)

    const { id } = await context.params;
    
    // ==========================================
    // 1. STRICT ID VALIDATION
    // ==========================================
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_PROPERTY_ID_PATCH', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid Property ID format');
    }

    // ==========================================
    // 2. FETCH EXISTING PROPERTY (Only images needed initially)
    // ==========================================
    const existingProperty = await Property.findById(id).select('images').lean();
    if (!existingProperty) throw new ApiError(404, 'Property not found');

    const contentType = request.headers.get('content-type') || '';
    let updateData = {};
    let newImageFiles = [];
    let imagesToRemove = [];

    // ============================================
    // 3. DATA EXTRACT & SANITIZE
    // ============================================
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const textFields = [
        'title', 'description', 'price', 'priceType', 'currency',
        'location', 'city', 'area', 'address', 'latitude', 'longitude',
        'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
        'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
        'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
      ];

      textFields.forEach(field => {
        const val = formData.get(field);
        if (val !== null && val !== undefined && val !== '') {
          if (['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'].includes(field)) {
            updateData[field] = Number(val);
          } else if (field === 'isFeatured' || field === 'isPublished') {
            updateData[field] = val === 'true' || val === true;
          } else if (field === 'latitude' || field === 'longitude') {
            updateData[field] = Number(val) || null;
          } else {
            // ✅ SECURITY: Sanitize text inputs
            updateData[field] = sanitizeInput(String(val).trim());
          }
        }
      });

      for (const field of ['features', 'amenities']) {
        const raw = formData.get(field);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) updateData[field] = sanitizeInput(parsed); // ✅ Sanitize Array
          } catch (e) { }
        }
      }

      const removeRaw = formData.get('removeImages');
      if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
        try {
          const parsed = JSON.parse(removeRaw);
          if (Array.isArray(parsed)) {
            imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
          } else if (typeof parsed === 'string' && parsed.trim()) {
            imagesToRemove = [parsed.trim()];
          }
        } catch (e) {
          const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
          if (cleaned.includes(',')) {
            imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
          } else if (cleaned) {
            imagesToRemove = [cleaned];
          }
        }
      }

      const allImages = formData.getAll('images');
      newImageFiles = allImages.filter(file => {
        if (file instanceof File && file.size > 0) return true;
        if (file && typeof file === 'object' && file.name && file.size > 0 && file.type?.startsWith('image/')) return true;
        return false;
      });

    } else {
      const body = await request.json();
      const allowedFields = [
        'title', 'description', 'price', 'priceType', 'currency',
        'location', 'city', 'area', 'address', 'latitude', 'longitude',
        'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
        'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
        'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
        'features', 'amenities'
      ];

      allowedFields.forEach(field => {
        if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
          // ✅ SECURITY: Sanitize strings, leave numbers/booleans for Mongoose to validate
          if (typeof body[field] === 'string') {
            updateData[field] = sanitizeInput(body[field]);
          } else if (Array.isArray(body[field])) {
            updateData[field] = sanitizeInput(body[field]);
          } else {
            updateData[field] = body[field];
          }
        }
      });

      if (body.removeImages) {
        if (Array.isArray(body.removeImages)) {
          imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
        } else if (typeof body.removeImages === 'string') {
          imagesToRemove = [body.removeImages];
        }
      }
    }

    // ============================================
    // 4. NEW FILE VALIDATION (Before uploading)
    // ============================================
    if (newImageFiles.length > 0) {
      const fileValidation = validateFiles(newImageFiles);
      if (!fileValidation.valid) {
        throw new ApiError(400, fileValidation.errors.join(' '));
      }
    }

    // ============================================
    // 5. IMAGE LOGIC (SAME POSITION REPLACE) - UNTOUCHED!
    // ============================================
    let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
    let imageModified = false;
    let removedIndexes = [];

    if (imagesToRemove.length > 0) {
      const foundMatches = [];
      
      for (const removeId of imagesToRemove) {
        const matchIndex = currentImages.findIndex(img => {
          const dbId = img.public_id || '';
          return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
        });

        if (matchIndex !== -1) {
          foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
        }
      }

      foundMatches.sort((a, b) => b.index - a.index);

      for (const match of foundMatches) {
        try {
          await deleteImage(match.public_id);
        } catch (err) { }
        currentImages.splice(match.index, 1);
        removedIndexes.push(match.index);
        imageModified = true;
      }

      removedIndexes.sort((a, b) => a - b);
    }

    let uploadedImages = [];
    
    if (newImageFiles.length > 0) {
      if (currentImages.length + newImageFiles.length > 10) {
        throw new ApiError(400, `Maximum 10 images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}`);
      }

      uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 80,
      });
    }

    if (uploadedImages.length > 0) {
      uploadedImages.forEach((img, i) => {
        if (i < removedIndexes.length) {
          currentImages.splice(removedIndexes[i], 0, img);
        } else {
          currentImages.push(img);
        }
      });
      imageModified = true;
    }

    if (imageModified) {
      updateData.images = currentImages;
      updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
    }

    // ============================================
    // 6. DATABASE UPDATE
    // ============================================
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    updateData.updatedBy = user._id;

    // Note: Cannot use .lean() here because runValidators and .populate() require Mongoose Document
    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new : true,
      runValidators: true,
    });

    if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

    await updatedProperty.populate('addedBy', 'name email phone avatar');

    // ============================================
    // 7. SECURITY AUDIT LOG
    // ============================================
    securityLog('PROPERTY_UPDATED', {
      requestId,
      adminId: user._id,
      propertyId: id,
      updatedFields: Object.keys(updateData),
      imagesAdded: uploadedImages.length,
      imagesRemoved: removedIndexes.length,
      duration: Date.now() - startTime,
    });

    // ============================================
    // 8. RESPONSE
    // ============================================
    const obj = updatedProperty.toObject();
    
    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      updatedFields: Object.keys(updateData),
      data: {
        _id: obj._id,
        propertyCode: obj.propertyCode,
        title: obj.title,
        description: obj.description,
        price: obj.price,
        priceType: obj.priceType,
        currency: obj.currency,
        location: obj.location,
        city: obj.city,
        area: obj.area,
        address: obj.address,
        coordinates: { latitude: obj.latitude, longitude: obj.longitude },
        propertyType: obj.propertyType,
        bedrooms: obj.bedrooms,
        bathrooms: obj.bathrooms,
        kitchens: obj.kitchens,
        areaSize: obj.areaSize,
        areaUnit: obj.areaUnit,
        floors: obj.floors,
        yearBuilt: obj.yearBuilt,
        features: obj.features,
        amenities: obj.amenities,
        images: obj.images,
        thumbnail: obj.thumbnail,
        status: obj.status,
        isFeatured: obj.isFeatured,
        isPublished: obj.isPublished,
        contact: {
          name: obj.contactName,
          phone: obj.contactPhone,
          email: obj.contactEmail,
        },
        addedBy: obj.addedBy,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      },
    }, { 
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'Cache-Control': 'no-store', // Never cache dynamic updates
        'X-Request-Id': requestId,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    securityLog('PATCH_PROPERTY_ERROR', {
      requestId,
      userId: user?._id,
      error: error.message,
      duration: Date.now() - startTime,
    });

    const statusCode = error.statusCode || 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production') 
      ? 'Failed to update property' 
      : error.message;
      
    return NextResponse.json(
      { success: false, message: message },
      { 
        status: statusCode,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'no-store',
          'X-Request-Id': requestId,
        }
      }
    );
  }
};

// ==========================================
// ✅ EXPORTS & METHOD BLOCKING
// ==========================================
export const PATCH = withAdminAuth(patchProperty, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: 'Too many update attempts. Please try again later.',
});

const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'PATCH' } }
  );
};

export const GET = methodNotAllowed;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;