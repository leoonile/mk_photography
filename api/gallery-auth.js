// /api/gallery-auth.js
// Client submits slug + password → returns signed JWT if valid

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body || {};
  if (!slug || !password) {
    return res.status(400).json({ error: 'Missing slug or password' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: gallery, error } = await supabase
      .from('galleries')
      .select('id, client_name, slug, password_hash, is_active, event_date, event_type')
      .eq('slug', slug.toLowerCase().trim())
      .single();

    if (error || !gallery) {
      return res.status(401).json({ error: 'Gallery not found' });
    }
    if (!gallery.is_active) {
      return res.status(403).json({ error: 'This gallery is not currently active' });
    }

    const valid = await bcrypt.compare(password, gallery.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { gallery_id: gallery.id, slug: gallery.slug, client_name: gallery.client_name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      gallery: {
        client_name: gallery.client_name,
        event_date: gallery.event_date,
        event_type: gallery.event_type,
      },
    });
  } catch (err) {
    console.error('[gallery-auth]', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
