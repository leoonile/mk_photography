// /api/admin.js — All admin operations

const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Busboy = require('busboy');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const d = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    return d.role === 'admin' ? d : null;
  } catch { return null; }
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    const fields = {};
    const files = [];
    bb.on('field', (name, val) => { fields[name] = val; });
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', c => chunks.push(c));
      stream.on('end', () => files.push({ name, buffer: Buffer.concat(chunks), info }));
    });
    bb.on('close', () => resolve({ fields, files }));
    bb.on('error', reject);
    req.pipe(bb);
  });
}

function uploadToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `mk-photography/${folder}`,
        public_id: filename.replace(/\.[^/.]+$/, ''),
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      (err, result) => err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  // ── LOGIN ────────────────────────────────────────────────────────
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).end();
    const { password } = req.body || {};
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.status(200).json({ token });
  }

  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const supabase = getSupabase();

  // ── LIST GALLERIES ───────────────────────────────────────────────
  if (action === 'galleries' && req.method === 'GET') {
    const { data, error } = await supabase
      .from('galleries')
      .select('id, client_name, slug, event_date, event_type, is_active, created_at, gallery_images(count)')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ galleries: data });
  }

  // ── CREATE GALLERY ───────────────────────────────────────────────
  if (action === 'create-gallery' && req.method === 'POST') {
    const { client_name, slug, password, event_date, event_type } = req.body || {};
    if (!client_name || !slug || !password) {
      return res.status(400).json({ error: 'client_name, slug and password required' });
    }
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const password_hash = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from('galleries')
      .insert({ client_name, slug: cleanSlug, password_hash, event_date: event_date || null, event_type: event_type || null })
      .select().single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ gallery: data });
  }

  // ── UPLOAD IMAGES ────────────────────────────────────────────────
  if (action === 'upload-images' && req.method === 'POST') {
    let fields, files;
    try { ({ fields, files } = await parseMultipart(req)); }
    catch (e) { return res.status(400).json({ error: 'Failed to parse upload' }); }

    const { gallery_id } = fields;
    if (!gallery_id || !files.length) return res.status(400).json({ error: 'gallery_id and files required' });

    const { data: gallery } = await supabase.from('galleries').select('id, slug').eq('id', gallery_id).single();
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    const results = [], errors = [];
    for (const file of files) {
      try {
        const cloud = await uploadToCloudinary(file.buffer, gallery.slug, file.info.filename || `photo-${Date.now()}`);
        const { data: img, error: dbErr } = await supabase.from('gallery_images')
          .insert({ gallery_id, cloudinary_url: cloud.secure_url, cloudinary_id: cloud.public_id, filename: file.info.filename || cloud.public_id, display_order: results.length })
          .select().single();
        if (dbErr) throw dbErr;
        results.push(img);
      } catch (e) {
        errors.push({ file: file.info.filename, error: e.message });
      }
    }
    return res.status(200).json({ uploaded: results, errors });
  }

  // ── TOGGLE PORTFOLIO ─────────────────────────────────────────────
  if (action === 'toggle-portfolio' && req.method === 'PUT') {
    const { image_id, in_portfolio, portfolio_category } = req.body || {};
    if (!image_id) return res.status(400).json({ error: 'image_id required' });
    const { data, error } = await supabase.from('gallery_images')
      .update({ in_portfolio, portfolio_category: portfolio_category || null })
      .eq('id', image_id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ image: data });
  }

  // ── UPDATE GALLERY ───────────────────────────────────────────────
  if (action === 'update-gallery' && req.method === 'PUT') {
    const { gallery_id, client_name, event_date, event_type, is_active, new_password } = req.body || {};
    if (!gallery_id) return res.status(400).json({ error: 'gallery_id required' });
    const updates = {};
    if (client_name) updates.client_name = client_name;
    if (event_date)  updates.event_date  = event_date;
    if (event_type)  updates.event_type  = event_type;
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (new_password) updates.password_hash = await bcrypt.hash(new_password, 12);
    const { data, error } = await supabase.from('galleries').update(updates).eq('id', gallery_id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ gallery: data });
  }

  // ── DELETE IMAGE ─────────────────────────────────────────────────
  if (action === 'delete-image' && req.method === 'DELETE') {
    const { image_id } = req.body || {};
    if (!image_id) return res.status(400).json({ error: 'image_id required' });
    const { data: img } = await supabase.from('gallery_images').select('cloudinary_id').eq('id', image_id).single();
    if (img?.cloudinary_id) { try { await cloudinary.uploader.destroy(img.cloudinary_id); } catch {} }
    const { error } = await supabase.from('gallery_images').delete().eq('id', image_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ deleted: true });
  }

  // ── DELETE GALLERY ───────────────────────────────────────────────
  if (action === 'delete-gallery' && req.method === 'DELETE') {
    const { gallery_id } = req.body || {};
    if (!gallery_id) return res.status(400).json({ error: 'gallery_id required' });
    const { data: images } = await supabase.from('gallery_images').select('cloudinary_id').eq('gallery_id', gallery_id);
    for (const img of images || []) { try { await cloudinary.uploader.destroy(img.cloudinary_id); } catch {} }
    const { error } = await supabase.from('galleries').delete().eq('id', gallery_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ deleted: true });
  }

  // ── GET GALLERY IMAGES ───────────────────────────────────────────
  if (action === 'gallery-images' && req.method === 'GET') {
    const { gallery_id } = req.query;
    if (!gallery_id) return res.status(400).json({ error: 'gallery_id required' });
    const { data, error } = await supabase.from('gallery_images').select('*').eq('gallery_id', gallery_id).order('display_order');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ images: data });
  }

  // ── GET PORTFOLIO IMAGES (public) ────────────────────────────────
  if (action === 'portfolio-images' && req.method === 'GET') {
    const { data, error } = await supabase.from('gallery_images')
      .select('id, cloudinary_url, portfolio_category, filename')
      .eq('in_portfolio', true)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ images: data });
  }

  return res.status(404).json({ error: 'Unknown action' });
};

module.exports.config = { api: { bodyParser: false } };
