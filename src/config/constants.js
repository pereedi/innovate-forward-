/**
 * Application Constants and Media Resources
 * 
 * You can override the teaser video URL at any time via the 
 * VITE_TEASER_VIDEO_URL environment variable in your .env file or host server
 * (e.g. Vercel, Netlify, Cloudflare).
 */

export const TEASER_VIDEO_URL = 
  import.meta.env.VITE_TEASER_VIDEO_URL || 
  'https://res.cloudinary.com/dnk3ipnep/video/upload/v1789653820/if1.mp4';
