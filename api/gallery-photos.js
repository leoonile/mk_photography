// /api/gallery-photos.js
// Returns photos for authenticated gallery client

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('id, cloudinary_url, filename, display_order')
      .eq('gallery_id', decoded.gallery_id)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return res.status(200).json({ images: images || [] });
  } catch (err) {
    console.error('[gallery-photos]', err.message);
    return res.status(500).json({ error: 'Failed to fetch photos' });
  }
};
