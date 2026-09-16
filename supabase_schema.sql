-- ==============================================================================
-- INNOVATE FORWARD 2026: SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- 1. Log in to https://supabase.com/dashboard
-- 2. Select your project -> SQL Editor -> New Query
-- 3. Paste this script and click "RUN"
-- ==============================================================================

-- Enable UUID generation extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLE: registrations
-- Stores all invitee & attendee registration details along with device telemetry
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Invitee Contact & Personal Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- Conference Preferences & Community
    brings_you TEXT NOT NULL,
    other_brings_you TEXT,
    interests TEXT[] NOT NULL DEFAULT '{}',
    other_interest TEXT,
    community TEXT NOT NULL,
    organization TEXT,
    registered_with_kingschat BOOLEAN DEFAULT FALSE,
    
    -- Visitor Device & Network Telemetry at time of Registration
    ip_address TEXT,
    os_name TEXT,
    os_version TEXT,
    browser_name TEXT,
    browser_version TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for lightning-fast queries and analytics aggregation
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_community ON public.registrations (community);
CREATE INDEX IF NOT EXISTS idx_registrations_ip ON public.registrations (ip_address);

-- ==============================================================================
-- 2. TABLE: visitor_logs
-- Logs page and registration section visits with full device telemetry
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Network & Location Telemetry
    ip_address TEXT,
    
    -- Device & Browser Telemetry
    os_name TEXT,
    os_version TEXT,
    browser_name TEXT,
    browser_version TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    user_agent TEXT,
    
    -- Page Context
    section_viewed TEXT DEFAULT 'landing_page', -- e.g. 'landing_page', 'registration_section'
    referrer TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for visitor queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON public.visitor_logs (ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_section ON public.visitor_logs (section_viewed);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on both tables
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors (public) to insert new registrations
DROP POLICY IF EXISTS "Allow anonymous registrations insert" ON public.registrations;
CREATE POLICY "Allow anonymous registrations insert" 
ON public.registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading registrations with anon key (for dashboard demo) or authenticated role
DROP POLICY IF EXISTS "Allow select registrations" ON public.registrations;
CREATE POLICY "Allow select registrations" 
ON public.registrations 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow anonymous visitors to log page/registration section views
DROP POLICY IF EXISTS "Allow anonymous visitor logs insert" ON public.visitor_logs;
CREATE POLICY "Allow anonymous visitor logs insert" 
ON public.visitor_logs 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading visitor logs
DROP POLICY IF EXISTS "Allow select visitor logs" ON public.visitor_logs;
CREATE POLICY "Allow select visitor logs" 
ON public.visitor_logs 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- ==============================================================================
-- SUCCESS MESSAGE
-- ==============================================================================
COMMENT ON TABLE public.registrations IS 'Innovate Forward 2026 attendee registrations';
COMMENT ON TABLE public.visitor_logs IS 'Innovate Forward 2026 page & registration visitor telemetry';
