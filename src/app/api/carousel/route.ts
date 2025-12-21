import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { carouselImages } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/lib/env';

// Add Cloudinary config at the top of the file
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// IMPORTANT: Force dynamic for Vercel
export const dynamic = 'force-dynamic';

// GET all carousel images
export async function GET(request: NextRequest) {
  try {
    const data = await db.select().from(carouselImages);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/carousel error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST new image with Cloudinary upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 10MB" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'carousel',
          transformation: [
            { width: 1400, height: 600, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const imageURL = (uploadResult as any).secure_url;

    // Save to database
    await db.insert(carouselImages).values({
      id: uuid(),
      imageDescription: description || "",
      imageURL: imageURL,
    });

    return NextResponse.json({ success: true, imageURL });
  } catch (error) {
    console.error("POST /api/carousel error:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}

// DELETE image by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing image id" },
        { status: 400 }
      );
    }

    await db
      .delete(carouselImages)
      .where(eq(carouselImages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/carousel error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}