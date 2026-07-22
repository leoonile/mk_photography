import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();
    if (!slug || !password) {
      return NextResponse.json({ error: "Missing slug or password" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || ""
    );

    const { data: gallery, error } = await supabase
      .from("galleries")
      .select("id, client_name, slug, password_hash, is_active, event_date, event_type")
      .eq("slug", slug.toLowerCase().trim())
      .single();

    if (error || !gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 401 });
    }
    if (!gallery.is_active) {
      return NextResponse.json({ error: "This gallery is not currently active" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, gallery.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const token = jwt.sign(
      { gallery_id: gallery.id, slug: gallery.slug, client_name: gallery.client_name },
      process.env.JWT_SECRET || "",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      token,
      gallery: {
        client_name: gallery.client_name,
        event_date: gallery.event_date,
        event_type: gallery.event_type,
      },
    });
  } catch (err: any) {
    console.error("[gallery-auth]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
