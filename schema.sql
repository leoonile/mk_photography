-- Create 'galleries' table
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    event_date DATE,
    event_type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create 'gallery_images' table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    cloudinary_url TEXT NOT NULL,
    cloudinary_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    in_portfolio BOOLEAN DEFAULT false,
    portfolio_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- We'll enable RLS but create a policy that allows the service key to bypass it 
-- (which is the default behavior of the service_role key anyway, but good practice).
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Optional: If you ever query from the browser anon key, you'd add policies here.
-- Since the Next.js API uses the SUPABASE_SERVICE_KEY, it bypasses RLS automatically.
