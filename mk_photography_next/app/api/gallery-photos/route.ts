import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || ""
    );

    const { data: images, error } = await supabase
      .from("gallery_images")
      .select("id, cloudinary_url, filename, display_order")
      .eq("gallery_id", decoded.gallery_id)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ images: images || [] });
  } catch (err: any) {
    console.error("[gallery-photos]", err.message);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
