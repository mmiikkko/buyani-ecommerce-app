import { NextResponse } from "next/server";
import { db } from "@/server/drizzle"; // your drizzle connection
import { carouselImages } from "@/server/schema/auth-schema"; 
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const data = await db.select().from(carouselImages);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/carousel error:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel images" },
      { status: 500 }
    );
  }
}

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
      { error: "Failed to add carousel image" },
      { status: 500 }
    );
  }
}
