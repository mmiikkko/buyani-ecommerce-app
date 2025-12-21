import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/lib/env';
import { getAuthenticatedUser } from '@/lib/mobile-auth';

// Add validation logging
console.log('[CLOUDINARY_CONFIG]', {
  cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
  apiKey: env.CLOUDINARY_API_KEY ? '✓' : '✗',
  apiSecret: env.CLOUDINARY_API_SECRET ? '✓' : '✗',
});

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user with better error handling
    let user;
    try {
      user = await getAuthenticatedUser(request);
      if (!user?.id) {
        console.error('[AUTH_ERROR] No user ID found');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (authError) {
      console.error('[AUTH_ERROR]', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    console.log('[UPLOAD_START]', { fileCount: files.length, userId: user.id });
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 });
    }

    // Validate file sizes and types
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        );
      }
      
      // Validate image type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image` },
          { status: 400 }
        );
      }
    }

    // Upload with individual error handling
    const uploadPromises = files.map(async (file, index) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Use upload_stream instead of base64 for better performance
        return await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `products/${user.id}`,
              transformation: [
                { width: 2000, height: 2000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
              ],
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                console.error(`[CLOUDINARY_ERROR] File ${index}:`, error);
                reject(error);
              } else {
                resolve({
                  url: result!.secure_url,
                  publicId: result!.public_id,
                  isPrimary: index === 0,
                });
              }
            }
          );
          
          uploadStream.end(buffer);
        });
      } catch (fileError) {
        console.error(`[FILE_PROCESSING_ERROR] File ${index}:`, fileError);
        throw new Error(`Failed to process ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    
    console.log('[UPLOAD_SUCCESS]', { count: uploadedImages.length });

    return NextResponse.json({ images: uploadedImages });
  } catch (error) {
    // Enhanced error logging
    console.error('[CLOUDINARY_UPLOAD_ERROR]', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name,
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload images',
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    );
  }
}