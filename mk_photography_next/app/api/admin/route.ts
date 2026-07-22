import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getSupabase() {
  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_KEY || "");
}

function verifyAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any;
    return decoded.role === "admin" ? decoded : null;
  } catch {
    return null;
  }
}

async function uploadToCloudinary(buffer: Buffer, folder: string, filename: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `mk-photography/${folder}`,
        public_id: filename.replace(/\.[^/.]+$/, ""),
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// OPTIONS handler for CORS if needed (standard Next.js handles CORS, but keeping it robust)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "portfolio-images") {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, cloudinary_url, portfolio_category, filename")
        .eq("in_portfolio", true)
        .order("created_at", { ascending: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ images: data });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Admin verification required for everything else
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabase();

  if (action === "galleries") {
    const { data, error } = await supabase
      .from("galleries")
      .select("id, client_name, slug, event_date, event_type, is_active, created_at, gallery_images(count)")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ galleries: data });
  }

  if (action === "gallery-images") {
    const gallery_id = searchParams.get("gallery_id");
    if (!gallery_id) return NextResponse.json({ error: "gallery_id required" }, { status: 400 });
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("gallery_id", gallery_id)
      .order("display_order");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ images: data });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  // Login action does not require authentication
  if (action === "login") {
    try {
      const { password } = await req.json();
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "12h" });
      return NextResponse.json({ token });
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
  }

  // Admin verification required for everything else
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabase();

  if (action === "create-gallery") {
    try {
      const { client_name, slug, password, event_date, event_type } = await req.json();
      if (!client_name || !slug || !password) {
        return NextResponse.json({ error: "client_name, slug and password required" }, { status: 400 });
      }
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
      const password_hash = await bcrypt.hash(password, 12);
      const { data, error } = await supabase
        .from("galleries")
        .insert({ client_name, slug: cleanSlug, password_hash, event_date: event_date || null, event_type: event_type || null })
        .select()
        .single();
      if (error) {
        if (error.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ gallery: data }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }

  if (action === "upload-images") {
    try {
      const formData = await req.formData();
      const gallery_id = formData.get("gallery_id") as string;
      const file = formData.get("image") as File;

      if (!gallery_id || !file) {
        return NextResponse.json({ error: "gallery_id and file required" }, { status: 400 });
      }

      const { data: gallery } = await supabase
        .from("galleries")
        .select("id, slug")
        .eq("id", gallery_id)
        .single();
      if (!gallery) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

      const buffer = Buffer.from(await file.arrayBuffer());
      const cloud = await uploadToCloudinary(buffer, gallery.slug, file.name || `photo-${Date.now()}`);

      const { data: img, error: dbErr } = await supabase
        .from("gallery_images")
        .insert({
          gallery_id,
          cloudinary_url: cloud.secure_url,
          cloudinary_id: cloud.public_id,
          filename: file.name || cloud.public_id,
          display_order: 0,
        })
        .select()
        .single();

      if (dbErr) throw dbErr;
      return NextResponse.json({ uploaded: [img], errors: [] });
    } catch (e: any) {
      return NextResponse.json({ errors: [{ error: e.message }] }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const supabase = getSupabase();

  if (action === "toggle-portfolio") {
    try {
      const { image_id, in_portfolio, portfolio_category } = await req.json();
      if (!image_id) return NextResponse.json({ error: "image_id required" }, { status: 400 });
      const { data, error } = await supabase
        .from("gallery_images")
        .update({ in_portfolio, portfolio_category: portfolio_category || null })
        .eq("id", image_id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ image: data });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }

  if (action === "update-gallery") {
    try {
      const { gallery_id, client_name, event_date, event_type, is_active, new_password } = await req.json();
      if (!gallery_id) return NextResponse.json({ error: "gallery_id required" }, { status: 400 });
      const updates: any = {};
      if (client_name) updates.client_name = client_name;
      if (event_date)  updates.event_date  = event_date;
      if (event_type)  updates.event_type  = event_type;
      if (typeof is_active === "boolean") updates.is_active = is_active;
      if (new_password) updates.password_hash = await bcrypt.hash(new_password, 12);

      const { data, error } = await supabase
        .from("galleries")
        .update(updates)
        .eq("id", gallery_id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ gallery: data });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const supabase = getSupabase();

  if (action === "delete-image") {
    try {
      const { image_id } = await req.json();
      if (!image_id) return NextResponse.json({ error: "image_id required" }, { status: 400 });
      const { data: img } = await supabase.from("gallery_images").select("cloudinary_id").eq("id", image_id).single();
      if (img?.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(img.cloudinary_id);
        } catch {}
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", image_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ deleted: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }

  if (action === "delete-gallery") {
    try {
      const { gallery_id } = await req.json();
      if (!gallery_id) return NextResponse.json({ error: "gallery_id required" }, { status: 400 });
      const { data: images } = await supabase.from("gallery_images").select("cloudinary_id").eq("gallery_id", gallery_id);
      for (const img of images || []) {
        if (img.cloudinary_id) {
          try {
            await cloudinary.uploader.destroy(img.cloudinary_id);
          } catch {}
        }
      }
      const { error } = await supabase.from("galleries").delete().eq("id", gallery_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ deleted: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}
