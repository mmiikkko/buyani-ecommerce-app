import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { carouselImages } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// GET all carousel images
export async function GET() {
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

// POST new image
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.imageURL) {
      return NextResponse.json(
        { error: "imageURL is required" },
        { status: 400 }
      );
    }

    await db.insert(carouselImages).values({
      id: uuid(),
      imageDescription: body.imageDescription || "",
      imageURL: body.imageURL,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/carousel error:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}

// DELETE image by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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
