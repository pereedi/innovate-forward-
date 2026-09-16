import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize client only if valid URL is provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage keys for development & preview
const LOCAL_STORAGE_REGS_KEY = 'if_local_registrations';
const LOCAL_STORAGE_VISITORS_KEY = 'if_local_visitor_logs';

/**
 * Get locally persisted registrations (fallback when Supabase is not yet configured)
 */
function getLocalRegistrations() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Save locally persisted registrations
 */
function setLocalRegistrations(regs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_REGS_KEY, JSON.stringify(regs));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

/**
 * Get locally persisted visitor logs
 */
function getLocalVisitors() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VISITORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Save locally persisted visitor logs
 */
function setLocalVisitors(logs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_VISITORS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

/**
 * Save a new attendee registration to Supabase with full telemetry
 */
export async function saveRegistration(formData, telemetry = {}) {
  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    location: formData.location,
    brings_you: Array.isArray(formData.bringsYou) ? formData.bringsYou.join(', ') : (formData.bringsYou || ''),
    other_brings_you: formData.otherBringsYou || null,
    interests: formData.interests || [],
    other_interest: formData.otherInterest || null,
    community: formData.community,
    organization: formData.organization || null,
    registered_with_kingschat: Boolean(formData.registeredWithKingsChat),
    ip_address: telemetry.ip_address || 'Unavailable',
    os_name: telemetry.os_name || 'Unknown',
    os_version: telemetry.os_version || '',
    browser_name: telemetry.browser_name || 'Unknown',
    browser_version: telemetry.browser_version || '',
    device_type: telemetry.device_type || 'Desktop',
    screen_resolution: telemetry.screen_resolution || '',
    user_agent: telemetry.user_agent || navigator.userAgent,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, isLive: true };
    } catch (err) {
      console.warn('Supabase insert failed, falling back to local session store:', err.message);
      // Fall through to local fallback
    }
  }

  // Fallback to local storage
  const localRegs = getLocalRegistrations();
  const fallbackRecord = {
    id: 'local-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...payload
  };
  localRegs.unshift(fallbackRecord);
  setLocalRegistrations(localRegs);

  return { data: fallbackRecord, error: null, isLive: false };
}

/**
 * Log a page or registration section visitor
 */
export async function logVisitor(telemetry = {}) {
  const payload = {
    ip_address: telemetry.ip_address || 'Unavailable',
    os_name: telemetry.os_name || 'Unknown',
    os_version: telemetry.os_version || '',
    browser_name: telemetry.browser_name || 'Unknown',
    browser_version: telemetry.browser_version || '',
    device_type: telemetry.device_type || 'Desktop',
    screen_resolution: telemetry.screen_resolution || '',
    user_agent: telemetry.user_agent || navigator.userAgent,
    section_viewed: telemetry.section_viewed || 'landing_page',
    referrer: telemetry.referrer || document.referrer || 'Direct',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('visitor_logs')
        .insert([payload]);

      if (!error) return { data, error: null, isLive: true };
    } catch (err) {
      // Silent fallback
    }
  }

  // Fallback to local storage (keep max 100 recent)
  const localLogs = getLocalVisitors();
  const fallbackRecord = {
    id: 'local-vis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    ...payload
  };
  localLogs.unshift(fallbackRecord);
  if (localLogs.length > 100) localLogs.length = 100;
  setLocalVisitors(localLogs);

  return { data: fallbackRecord, error: null, isLive: false };
}

/**
 * Fetch all attendee registrations
 */
export async function fetchRegistrations() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data, error: null, isLive: true };
      }
    } catch (err) {
      console.warn('Error fetching registrations from Supabase:', err.message);
    }
  }

  return { data: getLocalRegistrations(), error: null, isLive: false };
}

/**
 * Fetch recent visitor activity logs
 */
export async function fetchVisitorLogs(limit = 100) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return { data, error: null, isLive: true };
      }
    } catch (err) {
      console.warn('Error fetching visitor logs from Supabase:', err.message);
    }
  }

  return { data: getLocalVisitors().slice(0, limit), error: null, isLive: false };
}
