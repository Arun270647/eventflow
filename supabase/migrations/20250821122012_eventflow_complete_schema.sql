-- Location: supabase/migrations/20250821122012_eventflow_complete_schema.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema for EventFlow platform
-- Dependencies: No existing tables to reference

-- 1. Types and Extensions (with public qualification)
CREATE TYPE public.user_role AS ENUM ('admin', 'artist', 'user');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.genre_type AS ENUM ('rock', 'pop', 'jazz', 'blues', 'electronic', 'hip_hop', 'country', 'classical', 'folk', 'reggae', 'other');

-- 2. Core User Management Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Location and Venue Management
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    capacity INTEGER,
    description TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Category System
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Event Management
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.event_status DEFAULT 'draft'::public.event_status,
    max_capacity INTEGER DEFAULT 100,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    image_url TEXT,
    requirements TEXT,
    application_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Event Categories Junction Table
CREATE TABLE public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, category_id)
);

-- 7. Artist Profiles
CREATE TABLE public.artist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    stage_name TEXT NOT NULL,
    bio TEXT,
    genres public.genre_type[] DEFAULT ARRAY[]::public.genre_type[],
    experience_years INTEGER DEFAULT 0,
    portfolio_links JSONB DEFAULT '[]'::jsonb,
    social_media JSONB DEFAULT '{}'::jsonb,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB DEFAULT '{}'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Artist Applications
CREATE TABLE public.artist_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.application_status DEFAULT 'pending'::public.application_status,
    cover_letter TEXT,
    proposed_fee DECIMAL(10,2),
    portfolio_attachments JSONB DEFAULT '[]'::jsonb,
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);

-- 9. Event Artist Assignments (Approved Artists)
CREATE TABLE public.event_artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    performance_time TIMESTAMPTZ,
    performance_duration INTEGER DEFAULT 60, -- minutes
    agreed_fee DECIMAL(10,2),
    contract_details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);

-- 10. User Bookings and Tickets
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    booking_reference TEXT UNIQUE,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Essential Indexes for Performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_venue ON public.events(venue_id);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_artist_profiles_user ON public.artist_profiles(user_id);
CREATE INDEX idx_artist_applications_event ON public.artist_applications(event_id);
CREATE INDEX idx_artist_applications_artist ON public.artist_applications(artist_id);
CREATE INDEX idx_artist_applications_status ON public.artist_applications(status);
CREATE INDEX idx_bookings_event ON public.bookings(event_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_event_categories_event ON public.event_categories(event_id);
CREATE INDEX idx_event_artists_event ON public.event_artists(event_id);

-- 12. Functions (Must be before RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.booking_reference = 'EVT-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    RETURN NEW;
END;
$$;

-- 13. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 14. RLS Policies using correct patterns

-- Pattern 1: Core User Tables - user_profiles
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Public read access for venues and categories
CREATE POLICY "public_can_read_venues"
ON public.venues
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_venues"
ON public.venues
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

CREATE POLICY "public_can_read_categories"
ON public.categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_categories"
ON public.categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Events policies - public read, authenticated create/manage
CREATE POLICY "public_can_read_published_events"
ON public.events
FOR SELECT
TO public
USING (status = 'published');

CREATE POLICY "users_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

-- Event categories - public read, event owners manage
CREATE POLICY "public_can_read_event_categories"
ON public.event_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "event_owners_manage_categories"
ON public.event_categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Pattern 2: Simple User Ownership - artist_profiles
CREATE POLICY "users_manage_own_artist_profiles"
ON public.artist_profiles
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read for verified artist profiles
CREATE POLICY "public_can_read_verified_artist_profiles"
ON public.artist_profiles
FOR SELECT
TO public
USING (is_verified = true);

-- Pattern 2: Simple User Ownership - artist_applications
CREATE POLICY "users_manage_own_artist_applications"
ON public.artist_applications
FOR ALL
TO authenticated
USING (artist_id = auth.uid())
WITH CHECK (artist_id = auth.uid());

-- Event organizers can view applications for their events
CREATE POLICY "event_organizers_view_applications"
ON public.artist_applications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Event organizers can update application status
CREATE POLICY "event_organizers_update_applications"
ON public.artist_applications
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Event artists - public read, event owners manage
CREATE POLICY "public_can_read_event_artists"
ON public.event_artists
FOR SELECT
TO public
USING (true);

CREATE POLICY "event_owners_manage_artists"
ON public.event_artists
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- Pattern 2: Simple User Ownership - bookings
CREATE POLICY "users_manage_own_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Event organizers can view bookings for their events
CREATE POLICY "event_organizers_view_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
);

-- 15. Triggers for automation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON public.artist_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_applications_updated_at
  BEFORE UPDATE ON public.artist_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER generate_booking_ref_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_reference();

-- 16. Storage Buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'artist-portfolios',
        'artist-portfolios',
        false,
        10485760, -- 10MB limit
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4']
    ),
    (
        'event-media',
        'event-media',
        true,
        5242880, -- 5MB limit
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    );

-- Storage RLS Policies for artist portfolios (private)
CREATE POLICY "artists_manage_own_portfolio_files"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'artist-portfolios' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'artist-portfolios' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage RLS Policies for event media (public read)
CREATE POLICY "public_can_view_event_media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-media');

CREATE POLICY "authenticated_users_upload_event_media"
ON storage.objects  
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-media');

CREATE POLICY "owners_manage_event_media"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'event-media' AND owner = auth.uid())
WITH CHECK (bucket_id = 'event-media' AND owner = auth.uid());

-- 17. Mock Data for Development and Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    artist_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    venue1_uuid UUID := gen_random_uuid();
    venue2_uuid UUID := gen_random_uuid();
    category1_uuid UUID := gen_random_uuid();
    category2_uuid UUID := gen_random_uuid();
    event1_uuid UUID := gen_random_uuid();
    event2_uuid UUID := gen_random_uuid();
    artist_profile_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@eventflow.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Event Administrator", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (artist_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'artist@eventflow.com', crypt('artist123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jazz Artist", "role": "artist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@eventflow.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Event Attendee", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert venues
    INSERT INTO public.venues (id, name, address, city, state, capacity) VALUES
        (venue1_uuid, 'Downtown Music Hall', '123 Main Street', 'Austin', 'TX', 500),
        (venue2_uuid, 'Riverside Amphitheater', '456 River Road', 'Nashville', 'TN', 1000);

    -- Insert categories
    INSERT INTO public.categories (id, name, description, color_code) VALUES
        (category1_uuid, 'Live Music', 'Live musical performances', '#FF6B6B'),
        (category2_uuid, 'Festival', 'Music festivals and outdoor events', '#4ECDC4');

    -- Insert events
    INSERT INTO public.events (id, title, description, event_date, venue_id, organizer_id, status, max_capacity, ticket_price, is_free) VALUES
        (event1_uuid, 'Summer Jazz Festival', 'Annual jazz festival featuring local and international artists', '2025-07-15 19:00:00+00', venue1_uuid, admin_uuid, 'published', 400, 25.00, false),
        (event2_uuid, 'Acoustic Night', 'Intimate acoustic performances', '2025-06-20 20:00:00+00', venue2_uuid, admin_uuid, 'published', 150, 15.00, false);

    -- Insert event categories
    INSERT INTO public.event_categories (event_id, category_id) VALUES
        (event1_uuid, category1_uuid),
        (event1_uuid, category2_uuid),
        (event2_uuid, category1_uuid);

    -- Insert artist profile
    INSERT INTO public.artist_profiles (id, user_id, stage_name, bio, genres, experience_years, is_verified) VALUES
        (artist_profile_uuid, artist_uuid, 'Smooth Jazz Collective', 'Professional jazz ensemble with 10+ years experience', ARRAY['jazz', 'blues'], 10, true);

    -- Insert artist application
    INSERT INTO public.artist_applications (event_id, artist_id, status, cover_letter, proposed_fee) VALUES
        (event1_uuid, artist_uuid, 'approved', 'We would love to perform at your jazz festival. Our ensemble brings a unique blend of contemporary and classic jazz.', 500.00);

    -- Insert event artist assignment
    INSERT INTO public.event_artists (event_id, artist_id, performance_time, agreed_fee) VALUES
        (event1_uuid, artist_uuid, '2025-07-15 20:30:00+00', 500.00);

    -- Insert sample booking
    INSERT INTO public.bookings (event_id, user_id, quantity, total_amount, status) VALUES
        (event1_uuid, user_uuid, 2, 50.00, 'confirmed');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 18. Helpful Views for Common Queries
CREATE VIEW public.upcoming_events AS
SELECT 
    e.*,
    v.name as venue_name,
    v.city as venue_city,
    COUNT(b.id) as total_bookings,
    SUM(b.quantity) as total_attendees
FROM public.events e
LEFT JOIN public.venues v ON e.venue_id = v.id
LEFT JOIN public.bookings b ON e.id = b.event_id AND b.status = 'confirmed'
WHERE e.status = 'published' AND e.event_date > NOW()
GROUP BY e.id, v.name, v.city
ORDER BY e.event_date ASC;

-- Functions for cleanup and maintenance
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@eventflow.com';

    -- Delete in dependency order
    DELETE FROM public.bookings WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.event_artists WHERE artist_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.artist_applications WHERE artist_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.artist_profiles WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.event_categories WHERE event_id IN (
        SELECT id FROM public.events WHERE organizer_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.events WHERE organizer_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.categories;
    DELETE FROM public.venues;
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;